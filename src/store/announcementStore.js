import { create } from "zustand";


export const useAnnouncementStore = create((set, get) => ({

    // 🔹 All Announcements
    announcements: [],
    loading: false,
    hasFetched: false,

    // 🔹 Recent Announcements
    recentAnnouncements: [],
    hasFetchedRecent: false,



    // =============================
    // Fetch All Announcements
    // =============================
    fetchAnnouncements: async () => {
        if (get().hasFetched) return; // 🧠 stop duplicate fetch

        try {
            set({ loading: true });

            const res = await fetch("/api/v1/announcements/all-announcements");
            const data = await res.json();

            set({
                announcements: data.data || [],
                loading: false,
                hasFetched: true, // ✅ mark as fetched
            });
        } catch (error) {
            console.error("Error fetching announcements:", error);
            set({ loading: false });
        }
    },

    addAnnouncement: (newAnnouncement) =>
        set((state) => ({
            announcements: [newAnnouncement, ...state.announcements],
        })),

    clearAnnouncements: () =>
        set({
            announcements: [],
        }),

    // =============================
    // Fetch Recent Announcements
    // =============================
    fetchRecentAnnouncements: async (force = false) => {
        if (get().hasFetchedRecent && !force) return;

        try {
            set({ loading: true });

            const res = await fetch("/api/v1/announcements");
            const data = await res.json();

            set({
                recentAnnouncements: data.data || [],
                loading: false,
                hasFetchedRecent: true,
            });
        } catch (error) {
            console.error("Error fetching recent announcements:", error);
            set({ loading: false });
        }
    },
}));