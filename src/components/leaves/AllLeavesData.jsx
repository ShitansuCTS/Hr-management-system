"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FiEye } from "react-icons/fi";
import dayjs from "dayjs";

import SelectDropdown from "@/components/shared/SelectDropdown";
import Table from "@/components/shared/table/Table";
import LeavesSidebar from "./LeavesSidebar";
import { useLeaveStore } from "@/store/useLeaveStore";

const STATUS_OPTIONS = [
  {
    label: "Pending",
    value: "PENDING",
    color: "#f59e0b",
  },
  {
    label: "Approved",
    value: "APPROVED",
    color: "#22c55e",
  },
  {
    label: "Rejected",
    value: "REJECTED",
    color: "#ef4444",
  },
];

const toTitleCase = (text = "") =>
  text
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const leaveTypeBadgeClass = (leaveType) => {
  switch (leaveType) {
    case "CASUAL_LEAVE":
      return "text-primary border-primary";

    case "PAID_LEAVE":
      return "text-success border-success";

    case "SICK_LEAVE":
      return "text-danger border-danger";

    case "MATERNITY_LEAVE":
      return "text-warning border-warning";

    case "PATERNITY_LEAVE":
      return "text-info border-info";

    case "BEREAVEMENT_LEAVE":
      return "text-dark border-dark";

    case "OPTIONAL_LEAVE":
      return "text-danger border-danger";

    default:
      return "text-secondary border-secondary";
  }
};

const AllLeavesData = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const {
    allEmployeeLeaves,
    allEmployeeLeavesLoading,
    leaveStatusLoadingById,
    fetchAllEmployeeLeaves,
    updateLeaveStatus: updateLeaveStatusFromStore,
  } = useLeaveStore();

  // Fetch once. Zustand prevents duplicate calls.
  useEffect(() => {
    fetchAllEmployeeLeaves().catch((error) => {
      console.error("Failed to fetch employee leaves:", error);
    });
  }, [fetchAllEmployeeLeaves]);

  const handleStatusUpdate = useCallback(
    async (leaveId, newStatus) => {
      const currentLeave = allEmployeeLeaves.find((leave) => leave.id === leaveId);

      if (!currentLeave) return false;

      // Do nothing if the same status is selected
      if (currentLeave.status === newStatus) {
        return false;
      }

      const confirmed = window.confirm(
        `Are you sure you want to mark this leave as ${toTitleCase(newStatus)}?`
      );

      if (!confirmed) {
        return false;
      }

      const result = await updateLeaveStatusFromStore(leaveId, newStatus);

      if (!result.success) {
        return false;
      }

      // Synchronize sidebar using backend response
      setSelectedLeave((openedLeave) => {
        if (!openedLeave || openedLeave.id !== leaveId) {
          return openedLeave;
        }

        return {
          ...openedLeave,
          ...result.leave,
        };
      });

      return true;
    },
    [allEmployeeLeaves, updateLeaveStatusFromStore]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "user.fullName",
        id: "employee",
        header: "Employee Name",

        cell: ({ row }) => {
          const user = row.original.user;

          return (
            <div className="hstack gap-3">
              <div className="avatar-image avatar-md">
                <img
                  src={user?.profileImageUrl || "/images/avatar/default-avatar.png"}
                  alt={user?.fullName || "Employee"}
                  className="img-fluid"
                  style={{
                    width: 40,
                    height: 40,
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              </div>

              <div>
                <span className="text-truncate-1-line fw-bold">
                  {user?.fullName || "Unknown Employee"}
                </span>

                <small className="fs-12 fw-normal text-muted d-block">
                  {user?.email || "No email"}
                </small>
              </div>
            </div>
          );
        },
      },

      {
        accessorKey: "leaveType",
        header: "Leave Type",

        meta: {
          className: "fw-bold text-dark",
        },

        cell: ({ row }) => {
          const leaveType = row.original.leaveType;

          return (
            <span className={`badge border border-dashed ${leaveTypeBadgeClass(leaveType)}`}>
              {toTitleCase(leaveType)}
            </span>
          );
        },
      },

      {
        accessorKey: "startDate",
        header: "Start Date",

        cell: ({ row }) => dayjs(row.original.startDate).format("DD MMM, YYYY"),
      },

      {
        accessorKey: "endDate",
        header: "End Date",

        cell: ({ row }) => dayjs(row.original.endDate).format("DD MMM, YYYY"),
      },

      {
        accessorKey: "status",
        header: "Status",

        cell: ({ row }) => {
          const leave = row.original;
          const isUpdating = leaveStatusLoadingById?.[leave.id] || false;

          return (
            <div
              style={{
                minWidth: "150px",
                position: "relative",
                opacity: isUpdating ? 0.65 : 1,
                pointerEvents: isUpdating ? "none" : "auto",
              }}
            >
              <SelectDropdown
                key={`${leave.id}-${leave.status}`}
                options={STATUS_OPTIONS}
                defaultSelect={leave.status}
                onSelectOption={(option) => handleStatusUpdate(leave.id, option.value)}
                disabled={isUpdating}
              />

              {isUpdating && (
                <div
                  className="spinner-border spinner-border-sm text-primary"
                  role="status"
                  style={{
                    position: "absolute",
                    right: "-25px",
                    top: "10px",
                  }}
                >
                  <span className="visually-hidden">Updating...</span>
                </div>
              )}
            </div>
          );
        },
      },

      {
        accessorKey: "createdAt",
        header: "Created At",

        cell: ({ row }) => dayjs(row.original.createdAt).format("DD MMM, YYYY"),
      },

      {
        id: "actions",
        header: "Actions",

        cell: ({ row }) => (
          <div className="hstack gap-2 justify-content-end">
            <button
              type="button"
              className="avatar-text avatar-md"
              aria-label="View leave details"
              onClick={() => {
                setSelectedLeave(row.original);
                setSidebarOpen(true);
              }}
            >
              <FiEye />
            </button>
          </div>
        ),
      },
    ],
    [handleStatusUpdate, leaveStatusLoadingById]
  );

  return (
    <>
      <Table
        data={allEmployeeLeaves}
        columns={columns}
        loading={allEmployeeLeavesLoading}
        searchPlaceholder="Search employees..."
      />

      {sidebarOpen && selectedLeave && (
        <LeavesSidebar
          data={selectedLeave}
          onClose={() => {
            setSidebarOpen(false);
            setSelectedLeave(null);
          }}
          onStatusUpdated={(newStatus) => {
            handleStatusUpdate(selectedLeave.id, newStatus);
          }}
        />
      )}
    </>
  );
};

export default AllLeavesData;
