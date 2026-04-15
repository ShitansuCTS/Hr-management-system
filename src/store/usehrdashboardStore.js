import { create } from "zustand";
import { toast } from "react-hot-toast";

let fetchPromise = null;

export const usehrdashboardStore = create((set, get) => ({
  dashboard: null,
  cardsinfo: null,
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

  fetchDashboard: async () => {
    // ✅ Already fetched
    if (get().hasFetched) return;

    // ✅ Prevent parallel calls (MOST IMPORTANT)
    if (fetchPromise) return fetchPromise;

    fetchPromise = (async () => {
      try {
        set({ loading: true, error: null });

        const res = await fetch("/api/dashboard/hr");

        if (!res.ok) throw new Error("Failed to fetch dashboard");

        const data = await res.json();

        set({
          dashboard: data,
          cardsinfo: data.cardsinfo,
          birthdayinfo: data.birthdayinfo || [],
          anniversaryinfo: data.anniversaryinfo || [],
          charts: data.charts || {
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
      } finally {
        fetchPromise = null; // reset
      }
    })();

    return fetchPromise;
  },
}));
