import { create } from "zustand";
import toast from "react-hot-toast";

export const useAllUsersStore = create((set, get) => ({
    users: [],
    loading: false,
    hasFetched: false,

    fetchUsers: async (departmentId = "", force = false) => {
        // Prevent duplicate calls only when fetching all users
        if (!force && !departmentId && get().hasFetched) return;

        set({ loading: true });

        try {
            const url = departmentId
                ? `/api/v1/users/all-users-details?departmentId=${departmentId}`
                : `/api/v1/users/all-users-details`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            const data = await response.json();

            set({
                users: data.data || [],
                loading: false,
                hasFetched: departmentId ? false : true, // Only cache the unfiltered list
            });
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users");

            set({
                loading: false,
            });
        }
    },

    clearUsers: () =>
        set({
            users: [],
            hasFetched: false,
        }),
}));