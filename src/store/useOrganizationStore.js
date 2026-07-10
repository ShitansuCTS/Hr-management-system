import { create } from "zustand";
import toast from "react-hot-toast";

export const useOrganizationStore = create((set, get) => ({
    // =====================================
    // Departments
    // =====================================
    departments: [],
    departmentsLoading: false,
    departmentActionLoading: false,
    hasFetchedDepartments: false,

    // =====================================
    // Designations
    // =====================================
    designations: [],
    designationsLoading: false,
    designationActionLoading: false,
    hasFetchedDesignations: false,

    // =====================================
    // Fetch Departments
    // =====================================
    fetchDepartments: async (force = false) => {
        if (get().hasFetchedDepartments && !force) return;

        try {
            set({ departmentsLoading: true });

            const res = await fetch("/api/v1/departments", {
                cache: "no-store",
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to fetch departments");
            }

            set({
                departments: data.data || [],
                departmentsLoading: false,
                hasFetchedDepartments: true,
            });
        } catch (error) {
            console.error("Error fetching departments:", error);

            set({
                departmentsLoading: false,
            });

            throw error;
        }
    },

    // =====================================
    // Create Department
    // =====================================
    createDepartment: async (name) => {
        try {
            set({ departmentActionLoading: true });

            const res = await fetch("/api/v1/departments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                const firstError = Object.values(data.errors || {})[0];

                throw new Error(
                    firstError || data.message || "Failed to create department"
                );
            }

            set((state) => ({
                departments: [...state.departments, data.data],
                departmentActionLoading: false,
                hasFetchedDepartments: true,
            }));
            toast.success(data.message || "Department created successfully");
            return data;
        } catch (error) {
            set({ departmentActionLoading: false });
            toast.error(error.message || "Failed to create department");
            throw error;
        }
    },

    // =====================================
    // Delete Department
    // =====================================
    deleteDepartment: async (id) => {
        try {
            set({ departmentActionLoading: true });

            const res = await fetch(`/api/v1/departments/${id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to delete department");
            }

            set((state) => ({
                departments: state.departments.filter(
                    (department) => department.id !== id
                ),

                // Also remove related designations from the local store
                designations: state.designations.filter(
                    (designation) => designation.departmentId !== id
                ),

                departmentActionLoading: false,
            }));
            toast.success(data.message || "Department deleted successfully");
            return data;
        } catch (error) {
            set({ departmentActionLoading: false });
            toast.error(error.message || "Failed to delete department");
            throw error;
        }
    },





    
    // =====================================
    // Fetch Designations
    // =====================================
    fetchDesignations: async (force = false) => {
        if (get().hasFetchedDesignations && !force) return;

        try {
            set({ designationsLoading: true });

            const res = await fetch("/api/v1/designations", {
                cache: "no-store",
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to fetch designations");
            }

            set({
                designations: data.data || [],
                designationsLoading: false,
                hasFetchedDesignations: true,
            });
        } catch (error) {
            console.error("Error fetching designations:", error);

            set({
                designationsLoading: false,
            });

            throw error;
        }
    },

    // =====================================
    // Create Designation
    // =====================================
    createDesignation: async ({ name, title, departmentId }) => {
        try {
            set({ designationActionLoading: true });

            const res = await fetch("/api/v1/designations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    title,
                    departmentId,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                const firstError = Object.values(data.errors || {})[0];

                throw new Error(
                    firstError || data.message || "Failed to create designation"
                );
            }

            const department = get().departments.find(
                (item) => item.id === departmentId
            );

            const newDesignation = {
                ...data.data,
                department: data.data.department || department || null,
            };

            set((state) => ({
                designations: [newDesignation, ...state.designations],
                designationActionLoading: false,
                hasFetchedDesignations: true,
            }));

            toast.success(
                data.message || "Designation created successfully"
            );

            return data;
        } catch (error) {
            set({ designationActionLoading: false });

            toast.error(
                error.message || "Failed to create designation"
            );

            throw error;
        }
    },

    // =====================================
    // Delete Designation
    // =====================================
    deleteDesignation: async (id) => {
        try {
            set({ designationActionLoading: true });

            const res = await fetch(`/api/v1/designations/${id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to delete designation"
                );
            }

            set((state) => ({
                designations: state.designations.filter(
                    (designation) => designation.id !== id
                ),
                designationActionLoading: false,
            }));

            toast.success(
                data.message || "Designation deleted successfully"
            );

            return data;
        } catch (error) {
            set({ designationActionLoading: false });

            toast.error(
                error.message || "Failed to delete designation"
            );

            throw error;
        }
    },

    // =====================================
    // Clear Store
    // =====================================
    clearOrganizationStore: () =>
        set({
            departments: [],
            designations: [],

            departmentsLoading: false,
            designationsLoading: false,

            departmentActionLoading: false,
            designationActionLoading: false,

            hasFetchedDepartments: false,
            hasFetchedDesignations: false,
        }),
}));