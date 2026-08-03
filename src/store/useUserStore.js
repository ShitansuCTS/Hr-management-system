import { create } from "zustand";

export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    hasFetched: false,

    fetchUser: async () => {
        if (get().hasFetched) {
            return get().user;
        }

        set({ loading: true });

        try {
            const res = await fetch("/api/auth/my-profile", {
                credentials: "include",
            });

            if (!res.ok) {
                set({
                    user: null,
                    loading: false,
                    hasFetched: false,
                });
                console.warn("Logged-in profile not available:", res.status);
                return null;
            }

            const data = await res.json();
            const loggedUser = data?.user ?? null;

            console.log("Logged in user profile:", loggedUser);

            set({
                user: loggedUser,
                loading: false,
                hasFetched: true,
            });

            return loggedUser;
        } catch (error) {
            console.error("Profile fetch failed:", error);
            set({
                user: null,
                loading: false,
                hasFetched: false,
            });
            return null;
        }
    },

    clearUser: () =>
        set({
            user: null,
            hasFetched: false,
            loading: false,
        }),
}));