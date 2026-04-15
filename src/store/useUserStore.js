import { create } from "zustand";

let fetchUserPromise = null; // 🔥 GLOBAL LOCK

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  hasFetched: false,

  fetchUser: async () => {
    // ✅ Already fetched
    if (get().hasFetched) return;

    // ✅ Prevent parallel calls
    if (fetchUserPromise) return fetchUserPromise;

    fetchUserPromise = (async () => {
      set({ loading: true });

      try {
        const res = await fetch("/api/auth/my-profile");

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();

        set({
          user: data.user,
          loading: false,
          hasFetched: true,
        });
      } catch (error) {
        console.error(error);
        set({ loading: false });
      } finally {
        fetchUserPromise = null; // reset lock
      }
    })();

    return fetchUserPromise;
  },

  clearUser: () =>
    set({
      user: null,
      hasFetched: false,
    }),
}));
