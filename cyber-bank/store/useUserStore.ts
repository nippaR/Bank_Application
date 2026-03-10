import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserState {
    id: string | null;
    name: string | null;
    email: string | null;
    role: string | null;
    status: string | null;
}

interface UserStore {
    user: UserState | null;
    setUser: (user: UserState | null) => void;
    clearUser: () => void;
    // UI State
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            clearUser: () => set({ user: null }),

            isSidebarOpen: false,
            toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
        }),
        {
            name: "user-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
