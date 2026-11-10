import { create } from "zustand";
import { useProfileStore } from "@/store/profile.store";
import { useAllUsersStore } from "@/store/useAllUserStore";

function clearCachedUserData() {
    useProfileStore.getState().clearProfileData();
    useAllUsersStore.getState().clearUsers();
}

let authRequestVersion = 0;

export const useAuthStore = create((set, get) => ({
    // =============================
    // Auth State
    // =============================
    user: null,
    loading: false,
    initialized: false,
    isAuthenticated: false,

    // =============================
    // Set User
    // =============================
    setUser: (user) => {
        if (get().user?.id !== user?.id) {
            authRequestVersion += 1;
            clearCachedUserData();
        }
        set({
            user,
            isAuthenticated: !!user,
            initialized: true,
            loading: false,
        });
    },

    // =============================
    // Set Loading
    // =============================
    setLoading: (loading) =>
        set({
            loading,
        }),

    // =============================
    // Login
    // =============================
    login: async (email, password) => {
        try {
            set({
                loading: true,
            });

            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                set({
                    loading: false,
                });

                return {
                    success: false,
                    message: data.message || "Login failed",
                };
            }

            // Cookie is now set by the backend.
            // Fetch the complete profile.
            authRequestVersion += 1;
            clearCachedUserData();
            await get().fetchProfile(true);

            set({
                loading: false,
            });

            return {
                success: true,
                user: get().user,
            };
        } catch (error) {
            console.error("Login Error:", error);

            set({
                loading: false,
            });

            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // =============================
    // Fetch Profile
    // =============================
    fetchProfile: async (force = false) => {
        if (get().initialized && !force) return get().user;
        const requestVersion = authRequestVersion;

        try {
            set({
                loading: true,
            });

            const user = await useProfileStore.getState().fetchProfile(null, force);

            if (requestVersion !== authRequestVersion) return get().user;

            set({
                user,
                loading: false,
                initialized: true,
                isAuthenticated: !!user,
            });
            return user;
        } catch (error) {
            console.error("Fetch Profile Error:", error);

            if (requestVersion !== authRequestVersion) return get().user;

            set({
                user: null,
                loading: false,
                initialized: true,
                isAuthenticated: false,
            });
            return null;
        }
    },

    // =============================
    // Update User
    // =============================
    updateUser: (updatedUser) =>
        set((state) => ({
            user: state.user
                ? {
                    ...state.user,
                    ...updatedUser,
                }
                : null,
        })),

    // =============================
    // Refresh Profile
    // =============================
    refreshProfile: async () => {
        await get().fetchProfile(true);
    },

    // =============================
    // Logout
    // =============================
    clearAuth: () => {
        authRequestVersion += 1;
        clearCachedUserData();
        set({
            user: null,
            loading: false,
            initialized: true,
            isAuthenticated: false,
        });
    },
}));