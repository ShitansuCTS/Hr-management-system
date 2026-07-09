import { create } from "zustand";
import { toast } from "react-hot-toast";

export const useLeaveStore = create((set, get) => ({
  leaveBalances: [],
  isLeavesLoading: false,
  hasFetchedLeaveBalance: false,

  // =============================
  // Fetch Leave Balance
  // =============================
  fetchLeaveBalances: async (force = false) => {
    if (get().hasFetchedLeaveBalance && !force) return;

    try {
      set({ isLeavesLoading: true });

      const res = await fetch("/api/v1/leaves/myleaves-balance", {
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        set({
          leaveBalances: data.data,
          isLeavesLoading: false,
          hasFetchedLeaveBalance: true,
        });
      }
    } catch (error) {
      console.error("Failed to fetch balances");
      set({ isLeavesLoading: false });
    }
  },

  // =============================
  // Apply Leave
  // =============================
  applyLeave: async (formData) => {
    try {
      set({ isLeavesLoading: true });

      const res = await fetch("/api/v1/leaves/myleaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMessage =
          Object.values(data.errors || {})[0] || data.message || "Failed to apply leave";
        toast.error(errorMessage);
        set({ isLeavesLoading: false });
        return false;
      }

      toast.success("Leave applied successfully!");

      // 🔥 Refresh leave balances automatically
      await get().fetchLeaveBalances(true);

      set({ isLeavesLoading: false });

      return true;
    } catch (error) {
      toast.error("Something went wrong");
      set({ isLeavesLoading: false });
      return false;
    }
  },
}));
