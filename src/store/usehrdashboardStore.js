import { create } from "zustand";
import { toast } from "react-hot-toast";

export const usehrdashboardStore = create((set, get) => ({
    dashboard: null,
    cardsinfo: null, // ✅ NEW
    birthdayinfo: [],
    anniversaryinfo: [],
    loading: false,
    error: null,
    hasFetched: false,
    charts: {
        department: [],
        employmentType: [],
        status: [],
    },


    //////////////////////
    // Dashboard Cards Data
    //////////////////////
    fetchDashboard: async (force = false) => {
        const { hasFetched, loading } = get();

        // Prevent duplicate requests
        if (!force && (hasFetched || loading)) return;

        try {
            set({
                loading: true,
                error: null,
            });

            const res = await fetch("/api/v1/dashboard/admin");

            if (!res.ok) {
                throw new Error("Failed to fetch dashboard");
            }

            const response = await res.json();

            if (!response.success) {
                throw new Error(response.message);
            }

            set({
                dashboard: response.data,
                cardsinfo: response.data.cardsinfo,
                birthdayinfo: response.data.birthdayinfo || [],
                anniversaryinfo: response.data.anniversaryinfo || [],
                charts: response.data.charts || {
                    department: [],
                    employmentType: [],
                    status: [],
                },
                loading: false,
                error: null,
                hasFetched: true,
            });

        } catch (error) {
            console.error(error);

            set({
                loading: false,
                error: error.message,
            });

            toast.error("Failed to load dashboard");
        }
    },


}));