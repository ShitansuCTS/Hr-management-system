export const menuList = [
  {
    id: 0,
    name: "dashboards",
    path: "/",
    roles: ["ADMIN"],
    icon: "feather-airplay",

  },

  {
    id: 1,
    name: "reports",
    path: "#",
    icon: "feather-cast",
    hidden: true,
    dropdownMenu: [
      {
        id: 1,
        name: "Sales Report",
        path: "/reports/sales",
        subdropdownMenu: false,
      },
      {
        id: 2,
        name: "Leads Report",
        path: "/reports/leads",
        subdropdownMenu: false,
      },
      {
        id: 3,
        name: "Project Report",
        path: "/reports/project",
        subdropdownMenu: false,
      },
      {
        id: 4,
        name: "Timesheets Report",
        path: "/reports/timesheets",
        subdropdownMenu: false,
      },
    ],
  },
  {
    id: 2,
    name: "applications",
    path: "#",
    icon: "feather-send",
    hidden: true,
    dropdownMenu: [
      {
        id: 1,
        name: "Chat",
        path: "/applications/chat",
        subdropdownMenu: false,
      },
      {
        id: 2,
        name: "Email",
        path: "/applications/email",
        subdropdownMenu: false,
      },
      {
        id: 3,
        name: "Tasks",
        path: "/applications/tasks",
        subdropdownMenu: false,
      },
      {
        id: 4,
        name: "Notes",
        path: "/applications/notes",
        subdropdownMenu: false,
      },
      {
        id: 5,
        name: "Storage",
        path: "/applications/storage",
        subdropdownMenu: false,
      },
      {
        id: 6,
        name: "Calendar",
        path: "/applications/calendar",
        subdropdownMenu: false,
      },
    ],
  },
  {
    id: 3,
    name: "proposal",
    path: "#",
    icon: "feather-at-sign",
    hidden: true,
    dropdownMenu: [
      {
        id: 1,
        name: "Proposal",
        path: "/proposal/list",
        subdropdownMenu: false,
      },
      {
        id: 2,
        name: "Proposal View",
        path: "/proposal/view",
        subdropdownMenu: false,
      },
      {
        id: 3,
        name: "Proposal Edit",
        path: "/proposal/edit",
        subdropdownMenu: false,
      },
      {
        id: 4,
        name: "Proposal Create",
        path: "/proposal/create",
        subdropdownMenu: false,
      },
    ],
  },
  {
    id: 4,
    name: "payment",
    path: "#",
    icon: "feather-dollar-sign",
    hidden: true,
    dropdownMenu: [
      {
        id: 1,
        name: "Payment",
        path: "/payment/list",
        subdropdownMenu: false,
      },
      {
        id: 2,
        name: "Invoice View",
        path: "/payment/view",
        subdropdownMenu: false,
      },
      {
        id: 4,
        name: "Invoice Create",
        path: "/payment/create",
        subdropdownMenu: false,
      },
    ],
  },
  {
    id: 5,
    name: "employees",
    path: "#",
    icon: "feather-users",
    dropdownMenu: [
      // {
      //     id: 1,
      //     name: "Customers",
      //     path: "/customers/list",
      //     subdropdownMenu: false
      // },
      // {
      //     id: 2,
      //     name: "Customers View",
      //     path: "/customers/view",
      //     subdropdownMenu: false
      // },
      // {
      //     id: 3,
      //     name: "Customers Create",
      //     path: "/customers/create",
      //     subdropdownMenu: false
      // },
      {
        id: 1,
        name: "All Employee",
        path: "/customers/list",
        subdropdownMenu: false,
        roles: ["ADMIN", "EMPLOYEE"],
      },
      {
        id: 2,
        name: "Add Employee",
        path: "/customers/create",
        subdropdownMenu: false,
        roles: ["ADMIN"],
      },
      {
        id: 3,
        name: "Update Employee",
        path: "/customers/view",
        subdropdownMenu: false,
        hidden: true,

      },
      {
        id: 4,
        name: " Employee List",
        path: "/customers/all",
        subdropdownMenu: false,
        roles: ["ADMIN"],
      },
    ],
  },
  {
    id: 6,
    name: "leads",
    path: "#",
    icon: "feather-alert-circle",
    hidden: true,

    dropdownMenu: [
      {
        id: 1,
        name: "Leads",
        path: "/leads/list",
        subdropdownMenu: false,
      },
      {
        id: 2,
        name: "Leads View",
        path: "/leads/view",
        subdropdownMenu: false,
      },
      {
        id: 3,
        name: "Leads Create",
        path: "/leads/create",
        subdropdownMenu: false,
      },
    ],
  },
  {
    id: 7,
    name: "projects",
    path: "#",
    icon: "feather-briefcase",
    hidden: true,
    dropdownMenu: [
      {
        id: 1,
        name: "Projects",
        path: "/projects/list",
        subdropdownMenu: false,
      },
      {
        id: 2,
        name: "Projects View",
        path: "/projects/view",
        subdropdownMenu: false,
      },
      {
        id: 3,
        name: "Projects Create",
        path: "/projects/create",
        subdropdownMenu: false,
      },
    ],
  },
  {
    id: 8,
    name: "widgets",
    path: "#",
    icon: "feather-layout",
    hidden: true,
    dropdownMenu: [
      {
        id: 1,
        name: "Lists",
        path: "/widgets/lists",
        subdropdownMenu: false,
      },
      {
        id: 2,
        name: "Tables",
        path: "/widgets/tables",
        subdropdownMenu: false,
      },
      {
        id: 3,
        name: "Charts",
        path: "/widgets/charts",
        subdropdownMenu: false,
      },
      {
        id: 4,
        name: "Statistics",
        path: "/widgets/statistics",
        subdropdownMenu: false,
      },
      {
        id: 5,
        name: "Miscellaneous",
        path: "/widgets/miscellaneous",
        subdropdownMenu: false,
      },
    ],
  },
  {
    id: 9,
    name: "settings",
    path: "#",
    icon: "feather-settings",
    hidden: true,
    dropdownMenu: [
      {
        id: 1,
        name: "Ganeral",
        path: "/settings/ganeral",
        subdropdownMenu: false,
      },
      {
        id: 2,
        name: "SEO",
        path: "/settings/seo",
        subdropdownMenu: false,
      },
      {
        id: 3,
        name: "Tags",
        path: "/settings/tags",
        subdropdownMenu: false,
      },
      {
        id: 4,
        name: "Email",
        path: "/settings/email",
        subdropdownMenu: false,
      },
      {
        id: 5,
        name: "Tasks",
        path: "/settings/tasks",
        subdropdownMenu: false,
      },
      {
        id: 6,
        name: "Leads",
        path: "/settings/leads",
        subdropdownMenu: false,
      },
      {
        id: 7,
        name: "Support",
        path: "/settings/Support",
        subdropdownMenu: false,
      },
      {
        id: 8,
        name: "Finance",
        path: "/settings/finance",
        subdropdownMenu: false,
      },
      {
        id: 9,
        name: "Gateways",
        path: "/settings/gateways",
        subdropdownMenu: false,
      },
      {
        id: 10,
        name: "Customers",
        path: "/settings/customers",
        subdropdownMenu: false,
      },
      {
        id: 11,
        name: "Localization",
        path: "/settings/localization",
        subdropdownMenu: false,
      },
      {
        id: 12,
        name: "reCAPTCHA",
        path: "/settings/recaptcha",
        subdropdownMenu: false,
      },
      {
        id: 13,
        name: "Miscellaneous",
        path: "/settings/miscellaneous",
        subdropdownMenu: false,
      },
    ],
  },


  {
    id: 11,
    name: "help center",
    path: "#",
    icon: "feather-life-buoy",
    hidden: true,
    dropdownMenu: [
      {
        id: 1,
        name: "Support",
        path: "https://wrapbootstrap.com/user/theme_ocean",
        target: "_blank",
        subdropdownMenu: false,
      },
      {
        id: 2,
        name: "KnowledgeBase",
        path: "/help/knowledgebase",
        subdropdownMenu: false,
      },
      {
        id: 3,
        name: "Documentations",
        path: "https://duralux-next-doc.vercel.app/",
        target: "_blank",
        subdropdownMenu: false,
      },
    ],
  },
  {
    id: 12,
    name: "Company Calendar",
    path: "#",
    icon: "feather-layout",
    dropdownMenu: [
      {
        id: 1,
        name: "Holidays",
        path: "/holidays/list",
        subdropdownMenu: false,
        roles: ["ADMIN", "EMPLOYEE"],
      },
      {
        id: 2,
        name: "Calender",
        // path: "/holidays/calender",
        path: "/applications/calendar",
        subdropdownMenu: false,
        roles: ["ADMIN", "EMPLOYEE"],
      },
      {
        id: 3,
        name: "Add Holidays",
        path: "/holidays/create",
        subdropdownMenu: false,
        roles: ["ADMIN"],
      },
    ],
  },
  {
    id: 13,
    name: "Leaves Management",
    path: "#",
    icon: "feather-send",
    dropdownMenu: [
      {
        id: 1,
        name: "Create Leave",
        path: "/leaves/create",
        subdropdownMenu: false,
        roles: ["EMPLOYEE"],
      },
      {
        id: 2,
        name: "Request Leaves",
        path: "/leaves/list",
        subdropdownMenu: false,
        roles: ["EMPLOYEE"],
      },
      {
        id: 3,
        name: "Leave Applications",
        path: "/leaves/all",
        subdropdownMenu: false,
        roles: ["ADMIN"],
      },
    ],
  },
  {
    id: 14,
    name: "Activity Management",
    path: "#",
    icon: "feather-activity",
    dropdownMenu: [
      {
        id: 1,
        name: "Share Update",
        path: "/announcements/create",
        subdropdownMenu: false,
        roles: ["ADMIN"],
      },
      {
        id: 2,
        name: "Announcements List",
        path: "/announcements/list",
        subdropdownMenu: false,
        roles: ["ADMIN", "EMPLOYEE"],
      },
    ],
  },
  {
    id: 15,
    name: "organization",
    path: "#",
    icon: "feather-grid", // clean & generic
    dropdownMenu: [
      {
        id: 1,
        name: "Departments",
        path: "/organization/departments",
        subdropdownMenu: false,
        roles: ["ADMIN"],
      },
      {
        id: 2,
        name: "Job Titles",
        path: "/organization/designations",
        subdropdownMenu: false,
        roles: ["ADMIN"],
      },
    ],
  },
 {
    id: 16,
    name: "Resume Bank",
    path: "#",
    icon: "feather-file-text",
    dropdownMenu: [
      {
        id: 1,
        name: "All Resumes",
        path: "/resumes",
        subdropdownMenu: false,
        roles: ["ADMIN"],
      }
    ],
  },
  {
    id: 10,
    name: "authentication",
    path: "#",
    icon: "feather-power",
    dropdownMenu: [
      // {
      //   id: 1,
      //   name: "User Login",
      //   path: "/authentication/login/minimal",
      //   subdropdownMenu: [
      //     {
      //       id: 1,
      //       name: "User Login",
      //       path: "/authentication/login/minimal",
      //     },
      //     {
      //       id: 1,
      //       name: "Cover",
      //       path: "/authentication/login/cover",
      //     },
      //     {
      //       id: 2,
      //       name: "Minimal",
      //       path: "/authentication/login/minimal",
      //     },
      //     {
      //       id: 3,
      //       name: "Creative",
      //       path: "/authentication/login/creative",
      //     },
      //   ],
      // },
      // {
      //   id: 2,
      //   name: "register",
      //   path: "#",
      //   subdropdownMenu: [
      //     {
      //       id: 1,
      //       name: "Cover",
      //       path: "/authentication/register/cover",
      //     },
      //     {
      //       id: 2,
      //       name: "Minimal",
      //       path: "/authentication/register/minimal",
      //     },
      //     {
      //       id: 3,
      //       name: "Creative",
      //       path: "/authentication/register/creative",
      //     },
      //   ],
      // },
      // {
      //   id: 3,
      //   name: "Error 404",
      //   path: "#",
      //   subdropdownMenu: [
      //     {
      //       id: 1,
      //       name: "Cover",
      //       path: "/authentication/404/cover",
      //     },
      //     {
      //       id: 2,
      //       name: "Minimal",
      //       path: "/authentication/404/minimal",
      //     },
      //     {
      //       id: 3,
      //       name: "Creative",
      //       path: "/authentication/404/creative",
      //     },
      //   ],
      // },
      {
        id: 4,
        name: "Reset Password",
        path: "/authentication/reset/forgot-password",
        subdropdownMenu: [
          // {
          //   id: 1,
          //   name: "Cover",
          //   path: "/authentication/reset/cover",
          // },
          // {
          //   id: 2,
          //   name: "Minimal",
          //   path: "/authentication/reset/minimal",
          // },
          // {
          //   id: 3,
          //   name: "Creative",
          //   path: "/authentication/reset/creative",
          // },
        ],
      },
      // {
      //   id: 5,
      //   name: "Verify OTP",
      //   path: "#",
      //   subdropdownMenu: [
      //     {
      //       id: 1,
      //       name: "Cover",
      //       path: "/authentication/verify/cover",
      //     },
      //     {
      //       id: 2,
      //       name: "Minimal",
      //       path: "/authentication/verify/minimal",
      //     },
      //     {
      //       id: 3,
      //       name: "Creative",
      //       path: "/authentication/verify/creative",
      //     },
      //   ],
      // },
      // {
      //   id: 6,
      //   name: "Maintenance",
      //   path: "#",
      //   subdropdownMenu: [
      //     {
      //       id: 1,
      //       name: "Cover",
      //       path: "/authentication/maintenance/cover",
      //     },
      //     {
      //       id: 2,
      //       name: "Minimal",
      //       path: "/authentication/maintenance/minimal",
      //     },
      //     {
      //       id: 3,
      //       name: "Creative",
      //       path: "/authentication/maintenance/creative",
      //     },
      //   ],
      // },
    ],
  }

];
