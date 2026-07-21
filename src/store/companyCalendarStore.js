import { create } from "zustand";

export const useCompanyCalendarStore = create((set, get) => ({
    // =============================
    // State
    // =============================
    holidays: [],
    loading: false,
    hasFetched: false,

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
    // Update Holiday (Local)
    // =============================
    updateHoliday: (updatedHoliday) =>
        set((state) => ({
            holidays: state.holidays.map((holiday) =>
                holiday.id === updatedHoliday.id ? updatedHoliday : holiday
            ),
        })),

    // =============================
    // Delete Holiday (Local)
    // =============================
    deleteHoliday: (id) =>
        set((state) => ({
            holidays: state.holidays.filter((holiday) => holiday.id !== id),
        })),

    // =============================
    // Clear Store
    // =============================
    clearHolidays: () =>
        set({
            holidays: [],
            hasFetched: false,
            loading: false,
        }),
}));