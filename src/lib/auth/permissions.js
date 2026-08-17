// src/lib/auth/permissions.js

// ==========================
// Public Routes
// ==========================
export const PUBLIC_ROUTES = [
    "/authentication/login/minimal",
    "/authentication/reset/forgot-password",
    "/authentication/reset/reset-password",
    "/403",
];

// ==========================
// Role Based Permissions
// ==========================
export const ROUTE_PERMISSIONS = {
    ADMIN: {
        DASHBOARD: [
            "/dashboard/admin",
        ],

        CUSTOMERS: [
            "/customers/list",
            "/customers/create",
            "/customers/all",
        ],

        HOLIDAYS: [
            "/holidays/list",
            "/holidays/create",
            "/applications/calendar",
        ],

        LEAVES: [
            "/leaves/all",
        ],

        ANNOUNCEMENTS: [
            "/announcements/list",
            "/announcements/create",
        ],

        ORGANIZATION: [
            "/organization/departments",
            "/organization/designations",
        ],

        EMPLOYEES: [
            "/employees",
        ],

        PROFILE: [
            "/customers/profile",
        ],
        RESUMES: [
            "/resumes/all",
        ],
    },

    EMPLOYEE: {
        DASHBOARD: [
            "/dashboard/user",
        ],

        CUSTOMERS: [
            "/customers/list",
        ],

        HOLIDAYS: [
            "/holidays/list",
            "/applications/calendar",
        ],

        LEAVES: [
            "/leaves/create",
            "/leaves/list",
        ],

        ANNOUNCEMENTS: [
            "/announcements/list",
        ],

        PROFILE: [
            "/customers/profile",
        ]
    },
};