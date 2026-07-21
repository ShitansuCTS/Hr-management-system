import { create } from "zustand";

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
    setUser: (user) =>
        set({
            user,
            isAuthenticated: !!user,
            initialized: true,
            loading: false,
        }),

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
        if (get().initialized && !force) return;

        try {
            set({
                loading: true,
            });

            const res = await fetch("/api/auth/my-profile", {
                credentials: "include",
            });

            if (!res.ok) {
                set({
                    user: null,
                    loading: false,
                    initialized: true,
                    isAuthenticated: false,
                });

                return;
            }

            const data = await res.json();

            set({
                user: data.user ?? null,
                loading: false,
                initialized: true,
                isAuthenticated: !!data.user,
            });
        } catch (error) {
            console.error("Fetch Profile Error:", error);

            set({
                user: null,
                loading: false,
                initialized: true,
                isAuthenticated: false,
            });
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
    clearAuth: () =>
        set({
            user: null,
            loading: false,
            initialized: true,
            isAuthenticated: false,
        }),
}));