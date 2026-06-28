import { useEffect } from "react";
import io2, { Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

let socketInstance: Socket | null = null;
let connectPromise: Promise<Socket> | null = null;
let connectGeneration = 0;
/** `undefined` = use token from storage on next sync */
let pendingAuthToken: string | null | undefined = undefined;
let authSyncPromise: Promise<void> | null = null;

const getSocket = (): Socket | null => {
    return socketInstance?.connected ? socketInstance : null;
};

const resolveSocketOrigin = (): string => {
    const configured = import.meta.env.VITE_SOCKET_URL as string | undefined;
    const fallback =
        typeof window !== "undefined" ? window.location.origin : "";
    const raw = (configured || fallback).trim();

    return raw.replace(/\/ws\/?$/, "");
};

const getOrCreateGuestId = (): string => {
    const key = "guest-socket-id";
    let guestId = sessionStorage.getItem(key);
    if (!guestId) {
        guestId = `no-authenticated:${uuidv4()}`;
        sessionStorage.setItem(key, guestId);
    }
    return guestId;
};

const readAuthToken = (): string => {
    try {
        const user = localStorage.getItem("user");
        const parsedUser = JSON.parse(user || "{}");
        return parsedUser?.token || "";
    } catch {
        return "";
    }
};

const resolveAuthTokenForSync = (): string | null => {
    if (pendingAuthToken !== undefined) {
        return pendingAuthToken;
    }
    return readAuthToken() || null;
};

const waitForSocketConnect = (
    socket: Socket,
    generation: number,
): Promise<Socket> => {
    if (socket.connected) {
        return Promise.resolve(socket);
    }

    return new Promise((resolve) => {
        const timeout = setTimeout(() => {
            socket.off("connect", onConnect);
            if (generation === connectGeneration && socketInstance === socket) {
                resolve(socket);
            }
        }, 8000);

        const onConnect = () => {
            clearTimeout(timeout);
            socket.off("connect", onConnect);
            if (generation === connectGeneration && socketInstance === socket) {
                resolve(socket);
            }
        };

        socket.on("connect", onConnect);
    });
};

const emitWithAck = <T>(
    socket: Socket,
    event: string,
    payload: Record<string, unknown>,
): Promise<T> => {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error(`Socket ack timeout for "${event}"`));
        }, 5000);

        socket.emit(event, payload, (response: T) => {
            clearTimeout(timeout);
            resolve(response);
        });
    });
};

const applyAuthSync = async (): Promise<void> => {
    if (!socketInstance?.connected) {
        return;
    }

    const token = resolveAuthTokenForSync();

    if (token) {
        await emitWithAck<{ success: boolean; error?: string }>(
            socketInstance,
            "authenticate",
            { token },
        );
        return;
    }

    await emitWithAck<{ success: boolean; error?: string }>(
        socketInstance,
        "deauthenticate",
        {},
    );
};

/**
 * Keeps auth state in sync on the single persistent socket (no reconnect).
 */
export const syncSocketAuth = (token: string | null): Promise<void> => {
    pendingAuthToken = token;

    if (authSyncPromise) {
        return authSyncPromise;
    }

    authSyncPromise = (async () => {
        try {
            await ensureSocketConnected();
            await applyAuthSync();
        } catch (error) {
            console.warn("Socket auth sync failed:", error);
        } finally {
            authSyncPromise = null;
        }
    })();

    return authSyncPromise;
};

const teardownSocket = (): void => {
    connectGeneration += 1;
    connectPromise = null;
    authSyncPromise = null;
    pendingAuthToken = undefined;

    if (!socketInstance) {
        return;
    }

    socketInstance.removeAllListeners();
    socketInstance.disconnect();
    socketInstance = null;
};

const createSocketConnection = (): Promise<Socket> => {
    const generation = connectGeneration;
    const socketOrigin = resolveSocketOrigin();

    socketInstance = io2(socketOrigin, {
        query: { clientId: getOrCreateGuestId() },
        transports: ["websocket"],
        autoConnect: false,
        path: "/ws/socket.io",
        reconnection: true,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 10000,
        reconnectionAttempts: Infinity,
    });

    socketInstance.on("connect", () => {
        console.log("Socket connected:", socketInstance?.id);
        void applyAuthSync().catch((error) => {
            console.warn("Socket auth sync on connect failed:", error);
        });
    });

    socketInstance.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
    });

    socketInstance.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message);
    });

    socketInstance.connect();

    return waitForSocketConnect(socketInstance, generation);
};

/**
 * One stable WebSocket per tab. Always connects with the same guest clientId.
 * Auth state is applied via authenticate / deauthenticate messages.
 */
export const ensureSocketConnected = (): Promise<Socket> => {
    if (socketInstance?.connected) {
        return Promise.resolve(socketInstance);
    }

    if (socketInstance && connectPromise) {
        return connectPromise;
    }

    if (socketInstance && !socketInstance.connected) {
        if (connectPromise) {
            return connectPromise;
        }
        connectPromise = waitForSocketConnect(
            socketInstance,
            connectGeneration,
        ).finally(() => {
            connectPromise = null;
        });
        return connectPromise;
    }

    connectPromise = createSocketConnection().finally(() => {
        connectPromise = null;
    });

    return connectPromise;
};

function disconnectSocket(): void {
    teardownSocket();
}

/** Stable client id for `x-socket-id` when not yet connected (guest / non-auth). */
export const socket = {
    get instance() {
        return getSocket();
    },
    get guestId(): string {
        return getOrCreateGuestId();
    },
    disconnect: disconnectSocket,
    /** Clears auth on the persistent socket without closing the connection. */
    signOut: () => syncSocketAuth(null),
    upgradeToAuthenticated: (token?: string) => {
        if (token) {
            try {
                const user = localStorage.getItem("user");
                const parsedUser = JSON.parse(user || "{}");
                localStorage.setItem(
                    "user",
                    JSON.stringify({ ...parsedUser, token }),
                );
            } catch {
                /* empty */
            }
        }
        return syncSocketAuth(readAuthToken() || null);
    },
    joinTenantRoom: (tenantId: string): void => {
        const socketConnection = getSocket();
        if (!socketConnection?.connected || !tenantId) {
            return;
        }
        socketConnection.emit("join-tenant-room", { tenantId });
    },
};

export const useSocketV1 = (
    event: string,
    callback: (...args: any[]) => void,
    dps: React.DependencyList | undefined,
    _mode: "authenticated" | "non-authenticated" = "authenticated",
) => {
    useEffect(() => {
        let mounted = true;
        let boundSocket: Socket | null = null;

        const setupListener = async () => {
            try {
                const socketConnection = await ensureSocketConnected();
                if (!mounted) return;
                boundSocket = socketConnection;
                socketConnection.on(event, callback);
            } catch (error) {
                console.error(
                    "Error setting up socket listener:",
                    error,
                );
            }
        };

        void setupListener();

        return () => {
            mounted = false;
            boundSocket?.off(event, callback);
        };
    }, [event, ...(dps ?? [])]);

    return null;
};

/** @deprecated Use ensureSocketConnected */
export const initializeSocket = ensureSocketConnected;
