import { create } from "zustand";
import { toast } from "react-hot-toast";

const toTitleCaseStore = (text = "") =>
    text
        .toLowerCase()
        .split("_")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");


export const useLeaveStore = create((set, get) => ({
    // =====================================
    // Employee Leave Balance
    // =====================================
    leaveBalances: [],
    leaveBalancesLoading: false,
    hasFetchedLeaveBalances: false,

    // =====================================
    // Employee Own Leaves
    // =====================================
    myLeaves: [],
    myLeavesLoading: false,
    hasFetchedMyLeaves: false,

    // =====================================
    // Admin All Employee Leaves
    // =====================================
    allEmployeeLeaves: [],
    allEmployeeLeavesLoading: false,
    hasFetchedAllEmployeeLeaves: false,
    leaveStatusLoadingById: {},

    // =====================================
    // Leave Comments
    // =====================================
    commentsByLeaveId: {},
    commentsLoadingByLeaveId: {},
    hasFetchedCommentsByLeaveId: {},
    commentActionLoading: false,

    // =====================================
    // Shared Action Loading
    // =====================================
    leaveActionLoading: false,

    // =====================================
    // Fetch Leave Balances
    // =====================================
    fetchLeaveBalances: async (force = false) => {
        if (get().hasFetchedLeaveBalances && !force) return;

        try {
            set({ leaveBalancesLoading: true });

            const res = await fetch("/api/v1/leaves/myleaves-balance", {
                credentials: "include",
                cache: "no-store",
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to fetch leave balances");
            }

            set({
                leaveBalances: data.data || [],
                leaveBalancesLoading: false,
                hasFetchedLeaveBalances: true,
            });
        } catch (error) {
            console.error("Failed to fetch leave balances:", error);

            set({
                leaveBalancesLoading: false,
            });

            toast.error(error.message || "Failed to fetch leave balances");
        }
    },

    // =====================================
    // Fetch My Leaves
    // =====================================
    fetchMyLeaves: async (force = false) => {
        if (get().hasFetchedMyLeaves && !force) return;

        try {
            set({ myLeavesLoading: true });

            const res = await fetch("/api/v1/leaves/myleaves", {
                credentials: "include",
                cache: "no-store",
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to fetch your leaves");
            }

            set({
                myLeaves: data.data || data.data || [],
                myLeavesLoading: false,
                hasFetchedMyLeaves: true,
            });
        } catch (error) {
            console.error("Failed to fetch my leaves:", error);

            set({
                myLeavesLoading: false,
            });

            toast.error(error.message || "Failed to fetch your leaves");
        }
    },

    // =====================================
    // Fetch All Employee Leaves - Admin
    // =====================================
    fetchAllEmployeeLeaves: async (force = false) => {
        if (get().hasFetchedAllEmployeeLeaves && !force) return;

        try {
            set({ allEmployeeLeavesLoading: true });

            const res = await fetch("/api/v1/leaves/all-employee-leaves", {
                credentials: "include",
                cache: "no-store",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to fetch employee leaves");
            }

            set({
                allEmployeeLeaves: data.leaveApplications || data.data || [],
                allEmployeeLeavesLoading: false,
                hasFetchedAllEmployeeLeaves: true,
            });
        } catch (error) {
            console.error("Failed to fetch employee leaves:", error);

            set({
                allEmployeeLeavesLoading: false,
            });

            toast.error(error.message || "Failed to fetch employee leaves");
        }
    },

    // =====================================
    // Apply Leave - Employee
    // =====================================
    applyLeave: async (formData) => {
        try {
            set({ leaveActionLoading: true });

            const res = await fetch("/api/v1/leaves/myleaves", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                const errorMessage =
                    Object.values(data.errors || {})[0] || data.message || "Failed to apply leave";

                throw new Error(errorMessage);
            }

            const newLeave = data.leaveApplication || data.data || null;

            set((state) => ({
                myLeaves: newLeave ? [newLeave, ...state.myLeaves] : state.myLeaves,
                leaveActionLoading: false,
                hasFetchedMyLeaves: true,
            }));

            toast.success(data.message || "Leave applied successfully");

            // Balance changes after applying, so force only balance refresh
            await get().fetchLeaveBalances(true);

            return true;
        } catch (error) {
            set({ leaveActionLoading: false });

            toast.error(error.message || "Something went wrong");

            return false;
        }
    },

    // =====================================
    // Update Leave Status - Admin
    // =====================================
    updateLeaveStatus: async (leaveId, newStatus) => {
        const previousLeave = get().allEmployeeLeaves.find(
            (leave) => leave.id === leaveId
        );

        try {
            set((state) => ({
                leaveStatusLoadingById: {
                    ...state.leaveStatusLoadingById,
                    [leaveId]: true,
                },
            }));

            const res = await fetch(`/api/v1/leaves/${leaveId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    status: newStatus,
                }),
            });

            const data = await res.json();

            // Also check data.success
            if (!res.ok || data.success === false) {
                throw new Error(
                    data.message || "Failed to update leave status"
                );
            }

            const updatedLeave =
                data.leaveApplication ||
                data.data ||
                null;

            if (!updatedLeave) {
                throw new Error(
                    "The server did not return the updated leave details"
                );
            }

            set((state) => ({
                allEmployeeLeaves: state.allEmployeeLeaves.map((leave) =>
                    leave.id === leaveId
                        ? {
                            ...leave,
                            ...updatedLeave,

                            // Always trust the backend status
                            status: updatedLeave.status,
                        }
                        : leave
                ),

                leaveStatusLoadingById: {
                    ...state.leaveStatusLoadingById,
                    [leaveId]: false,
                },
            }));

            toast.success(
                data.message ||
                `Leave marked as ${toTitleCaseStore(updatedLeave.status)}`
            );

            return {
                success: true,
                leave: updatedLeave,
            };
        } catch (error) {
            console.error("Failed to update leave status:", error);

            // Keep or restore previous leave data
            set((state) => ({
                allEmployeeLeaves: state.allEmployeeLeaves.map((leave) =>
                    leave.id === leaveId && previousLeave
                        ? previousLeave
                        : leave
                ),

                leaveStatusLoadingById: {
                    ...state.leaveStatusLoadingById,
                    [leaveId]: false,
                },
            }));

            toast.error(
                error.message || "Failed to update leave status"
            );

            return {
                success: false,
                leave: previousLeave,
            };
        }
    },

    // =====================================
    // Update One Leave Locally
    // =====================================
    updateLeaveInStore: (updatedLeave) =>
        set((state) => ({
            allEmployeeLeaves: state.allEmployeeLeaves.map((leave) =>
                leave.id === updatedLeave.id ? { ...leave, ...updatedLeave } : leave
            ),

            myLeaves: state.myLeaves.map((leave) =>
                leave.id === updatedLeave.id ? { ...leave, ...updatedLeave } : leave
            ),
        })),

    // =====================================
    // Fetch Leave Comments
    // =====================================
    fetchLeaveComments: async (leaveId, force = false) => {
        if (!leaveId) return;

        const hasFetched = get().hasFetchedCommentsByLeaveId[leaveId];

        if (hasFetched && !force) {
            return get().commentsByLeaveId[leaveId] || [];
        }

        try {
            set((state) => ({
                commentsLoadingByLeaveId: {
                    ...state.commentsLoadingByLeaveId,
                    [leaveId]: true,
                },
            }));

            const res = await fetch(`/api/v1/leaves/${leaveId}/comments`, {
                credentials: "include",
                cache: "no-store",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to fetch comments");
            }

            const comments = data.data || [];

            set((state) => ({
                commentsByLeaveId: {
                    ...state.commentsByLeaveId,
                    [leaveId]: comments,
                },

                commentsLoadingByLeaveId: {
                    ...state.commentsLoadingByLeaveId,
                    [leaveId]: false,
                },

                hasFetchedCommentsByLeaveId: {
                    ...state.hasFetchedCommentsByLeaveId,
                    [leaveId]: true,
                },
            }));

            return comments;
        } catch (error) {
            set((state) => ({
                commentsLoadingByLeaveId: {
                    ...state.commentsLoadingByLeaveId,
                    [leaveId]: false,
                },
            }));

            toast.error(error.message || "Failed to fetch comments");

            throw error;
        }
    },

    // =====================================
    // Send Leave Comment
    // =====================================
    sendLeaveComment: async (leaveId, message) => {
        const cleanMessage = message?.trim();

        if (!leaveId || !cleanMessage) {
            return false;
        }

        try {
            set({ commentActionLoading: true });

            const res = await fetch(`/api/v1/leaves/${leaveId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    message: cleanMessage,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to send comment");
            }

            const newComment = data.data;

            set((state) => ({
                commentsByLeaveId: {
                    ...state.commentsByLeaveId,
                    [leaveId]: [...(state.commentsByLeaveId[leaveId] || []), newComment],
                },

                hasFetchedCommentsByLeaveId: {
                    ...state.hasFetchedCommentsByLeaveId,
                    [leaveId]: true,
                },

                commentActionLoading: false,
            }));

            return true;
        } catch (error) {
            set({ commentActionLoading: false });

            toast.error(error.message || "Failed to send comment");

            return false;
        }
    },

    // =====================================
    // Clear Leave Store
    // =====================================
    clearLeaveStore: () =>
        set({
            leaveBalances: [],
            myLeaves: [],
            allEmployeeLeaves: [],

            commentsByLeaveId: {},
            commentsLoadingByLeaveId: {},
            hasFetchedCommentsByLeaveId: {},
            leaveStatusLoadingById: {},

            leaveBalancesLoading: false,
            myLeavesLoading: false,
            allEmployeeLeavesLoading: false,
            leaveActionLoading: false,
            commentActionLoading: false,

            hasFetchedLeaveBalances: false,
            hasFetchedMyLeaves: false,
            hasFetchedAllEmployeeLeaves: false,
        }),
}));
