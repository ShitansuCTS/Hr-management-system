import { create } from "zustand";
import toast from "react-hot-toast";

export const useAllUsersStore = create((set, get) => ({
    users: [],
    loading: false,
    hasFetched: false, // 🔥 prevent multiple fetch

    fetchUsers: async () => {
        if (get().hasFetched) return; // 🧠 stop duplicate call

        set({ loading: true });

        try {
            const response = await fetch("/api/v1/users/all-users-details");

            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            const data = await response.json();

            // IMPORTANT: access data.users
            // toast.success(data.message || "Data fetched successfully");

            set({
                users: data.data,
                loading: false,
                hasFetched: true,
            });

        } catch (error) {
            console.error("Error fetching users:", error);
            set({ loading: false });
        }
    },

    clearUsers: () =>
        set({
            users: [],
            hasFetched: false,
        }),
}));