import { useEffect } from "react";
import { ensureSocketConnected, syncSocketAuth } from "@/api/socket";
import { useUserStore } from "@/zustand/user.store";

/**
 * Opens one persistent socket per tab and syncs auth without reconnecting.
 */
export function SocketInitializer() {
    const userAuth = useUserStore((state) => state.userAuth);

    useEffect(() => {
        void ensureSocketConnected()
            .then(() => syncSocketAuth(userAuth?.token ?? null))
            .catch(() => {
                /* connection retries automatically */
            });
    }, [userAuth?.token]);

    return null;
}
