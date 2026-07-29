import { create } from "zustand";

export const useCompanyCalendarStore = create((set, get) => ({
    // =============================
    // State
    // =============================
    holidays: [],
    loading: false,
    hasFetched: false,
    editingHoliday: null,


    events: [],
    hasFetchedEvents: false,
    editingEvent: null,

    // =============================
    // Fetch Holidays
    // =============================
    fetchHolidays: async (force = false) => {
        if (get().hasFetched && !force) return;

        try {
            set({ loading: true });

            const res = await fetch("/api/v1/holidays");
            const data = await res.json();

            set({
                holidays: data.data || [],
                loading: false,
                hasFetched: true,
            });
        } catch (error) {
            console.error("Error fetching holidays:", error);

            set({
                loading: false,
            });
        }
    },

    // =============================
    // Create Holiday
    // =============================
    createHoliday: async (payload) => {
        try {
            set({ loading: true });

            const res = await fetch("/api/v1/holidays", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                set({ loading: false });

                return {
                    success: false,
                    message:
                        Object.values(data.errors || {})[0] ||
                        data.message ||
                        "Failed to create holiday",
                };
            }

            set((state) => ({
                holidays: [data.data, ...state.holidays],
                loading: false,
            }));

            return {
                success: true,
                message: data.message,
                holiday: data.data,
            };
        } catch (error) {
            console.error(error);

            set({ loading: false });

            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // =============================
    // Add Holiday (Local)
    // =============================
    addHoliday: (holiday) =>
        set((state) => ({
            holidays: [holiday, ...state.holidays],
        })),

    // =============================
    // Edit Holiday
    // =============================
    editHoliday: async (id, payload) => {
        try {
            set({ loading: true });

            const res = await fetch(`/api/holidays/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                set({ loading: false });

                return {
                    success: false,
                    message: data.message || "Failed to update holiday",
                };
            }

            set((state) => ({
                holidays: state.holidays.map((holiday) =>
                    holiday.id === id ? data.holiday : holiday
                ),
                loading: false,
            }));

            return {
                success: true,
                message: data.message,
                holiday: data.holiday,
            };
        } catch (error) {
            console.error(error);

            set({ loading: false });

            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // =============================
    // Delete Holiday
    // =============================
    removeHoliday: async (id) => {
        try {
            set({ loading: true });

            const res = await fetch(`/api/holidays/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok) {
                set({ loading: false });

                return {
                    success: false,
                    message: data.message || "Failed to delete holiday",
                };
            }

            set((state) => ({
                holidays: state.holidays.filter((holiday) => holiday.id !== id),
                loading: false,
            }));

            return {
                success: true,
                message: data.message,
            };
        } catch (error) {
            console.error(error);

            set({ loading: false });

            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },






    fetchEvents: async (force = false) => {
        if (get().hasFetchedEvents && !force) return;

        try {
            set({ loading: true });

            const res = await fetch("/api/holidays/event-calender", {
                credentials: "include",
            });

            const data = await res.json();

            set({
                events: data.events || [],
                loading: false,
                hasFetchedEvents: true,
            });
        } catch (error) {
            console.error("Error fetching events:", error);

            set({ loading: false });
        }
    },


    createEvent: async (payload) => {
        try {
            set({ loading: true });

            const res = await fetch("/api/holidays/event-calender", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                set({ loading: false });

                return {
                    success: false,
                    message: data.message,
                };
            }

            await get().fetchEvents(true);

            set({ loading: false });

            return {
                success: true,
                message: data.message,
            };
        } catch (error) {
            console.error(error);

            set({ loading: false });

            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },




    // =============================
    // Clear Store
    // =============================
    clearHolidays: () =>
        set({
            holidays: [],
            hasFetched: false,

            events: [],
            hasFetchedEvents: false,

            loading: false,
        }),
}));