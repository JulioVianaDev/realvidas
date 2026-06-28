import { create } from "zustand";
import { RoleType } from "@global-types/entities/user.entity-type";
import { GetUserByIdResponse } from "@global-types/responses/user.response";

function normalizeAuthFromStorage(raw: unknown): AuthUser | null {
    if (!raw || typeof raw !== "object") return null;
    const o = raw as Record<string, unknown>;
    if (typeof o.id !== "string" || typeof o.token !== "string" || typeof o.role !== "string") {
        return null;
    }
    return {
        id: o.id,
        token: o.token,
        role: o.role as RoleType,
        email: typeof o.email === "string" ? o.email : "",
        emailConfirmed:
            typeof o.emailConfirmed === "boolean" ? o.emailConfirmed : true,
    };
}

interface AuthUser {
    id: string;
    token: string;
    role: RoleType;
    email: string;
    emailConfirmed: boolean;
}

interface UserStore {
    userAuth: AuthUser | null;
    setUserAuth: (userAuth: AuthUser | null) => void;
    setUser: (userAuth: GetUserByIdResponse | null) => void;
    user: GetUserByIdResponse | null;
}

export const useUserStore = create<UserStore>((set) => ({
    userAuth: normalizeAuthFromStorage(
        JSON.parse(localStorage.getItem("user") || "null"),
    ),
    setUserAuth: (userAuth) => {
        if (userAuth) {
            localStorage.setItem("user", JSON.stringify(userAuth));
        } else {
            localStorage.removeItem("user-data");
            localStorage.removeItem("user");
        }
        set({ userAuth });
    },
    user: JSON.parse(localStorage.getItem("user-data") || "null"),
    setUser: (user) => {
        if (user) {
            localStorage.setItem("user-data", JSON.stringify(user));
        } else {
            localStorage.removeItem("user-data");
        }
        set({ user });
    },
}));
