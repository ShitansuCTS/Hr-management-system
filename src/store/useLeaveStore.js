import { create } from "zustand";
import { toast } from "react-hot-toast";

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

            const res = await fetch("/api/leaves/myleaves-balance", {
                credentials: "include",
                cache: "no-store",
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to fetch leave balances");
            }

            set({
                leaveBalances: data.leaveBalances || [],
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

            const res = await fetch("/api/leaves/myleaves", {
                credentials: "include",
                cache: "no-store",
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to fetch your leaves");
            }

            set({
                myLeaves: data.leaveApplications || data.data || [],
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

            const res = await fetch("/api/leaves/all-employee-leaves", {
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

            const res = await fetch("/api/leaves/myleaves", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to apply leave");
            }

            const newLeave =
                data.leaveApplication || data.data || null;

            set((state) => ({
                myLeaves: newLeave
                    ? [newLeave, ...state.myLeaves]
                    : state.myLeaves,
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
        try {
            set({ leaveActionLoading: true });

            const res = await fetch(`/api/leaves/${leaveId}/status`, {
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

            if (!res.ok) {
                throw new Error(data.message || "Failed to update leave status");
            }

            const updatedLeave = data.leaveApplication || data.data;

            set((state) => ({
                allEmployeeLeaves: state.allEmployeeLeaves.map((leave) =>
                    leave.id === leaveId
                        ? {
                            ...leave,
                            ...(updatedLeave || {}),
                            status: newStatus,
                        }
                        : leave
                ),

                leaveActionLoading: false,
            }));

            toast.success(
                data.message || `Leave marked as ${newStatus.toLowerCase()}`
            );

            return true;
        } catch (error) {
            set({ leaveActionLoading: false });

            toast.error(error.message || "Failed to update leave status");

            return false;
        }
    },

    // =====================================
    // Update One Leave Locally
    // =====================================
    updateLeaveInStore: (updatedLeave) =>
        set((state) => ({
            allEmployeeLeaves: state.allEmployeeLeaves.map((leave) =>
                leave.id === updatedLeave.id
                    ? { ...leave, ...updatedLeave }
                    : leave
            ),

            myLeaves: state.myLeaves.map((leave) =>
                leave.id === updatedLeave.id
                    ? { ...leave, ...updatedLeave }
                    : leave
            ),
        })),







    // =====================================
    // Fetch Leave Comments
    // =====================================
    fetchLeaveComments: async (leaveId, force = false) => {
        if (!leaveId) return;

        const hasFetched =
            get().hasFetchedCommentsByLeaveId[leaveId];

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

            const res = await fetch(
                `/api/leaves/${leaveId}/comments`,
                {
                    credentials: "include",
                    cache: "no-store",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Failed to fetch comments"
                );
            }

            const comments = data.comments || [];

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

            toast.error(
                error.message || "Failed to fetch comments"
            );

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

            const res = await fetch(
                `/api/leaves/${leaveId}/comments`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        message: cleanMessage,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Failed to send comment"
                );
            }

            const newComment = data.comment;

            set((state) => ({
                commentsByLeaveId: {
                    ...state.commentsByLeaveId,
                    [leaveId]: [
                        ...(state.commentsByLeaveId[leaveId] || []),
                        newComment,
                    ],
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

            toast.error(
                error.message || "Failed to send comment"
            );

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
