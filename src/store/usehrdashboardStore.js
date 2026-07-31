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
    fetchDashboard: async () => {
        if (get().hasFetched) return;

        try {
            set({ loading: true, error: null });

            const res = await fetch("/api/v1/dashboard/admin");

            if (!res.ok) throw new Error("Failed to fetch dashboard");

            const data = await res.json();
            console.log(data);

            if (!data.success) throw new Error(data.message);

            set({
                dashboard: data.data,
                cardsinfo: data.data.cardsinfo, // ✅ IMPORTANT
                birthdayinfo: data.data.birthdayinfo || [],
                anniversaryinfo: data.data.anniversaryinfo || [],
                charts: data.data.charts || {   // ✅ ADD THIS
                    department: [],
                    employmentType: [],
                    status: [],
                },
                loading: false,
                hasFetched: true,
            });

        } catch (error) {
            console.error(error);
            set({ loading: false, error: error.message });
            toast.error("Failed to load dashboard");
        }
    },




}));