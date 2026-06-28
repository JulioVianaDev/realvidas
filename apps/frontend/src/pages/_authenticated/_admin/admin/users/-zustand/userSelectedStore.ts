import { UserTypeReturn } from "@global-types/entities/user.entity-type";
import { create } from "zustand";

interface UserStore {
    user: UserTypeReturn | null;
    setUser: (user: UserTypeReturn | null) => void;
}

export const useUserSelectedStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => {
        set({ user });
    },
}));
