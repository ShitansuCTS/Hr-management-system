"use client";
import React, { useEffect, useState, useMemo, memo } from "react";
import {
  FiAlertOctagon,
  FiArchive,
  FiClock,
  FiEdit3,
  FiEye,
  FiMoreHorizontal,
  FiPrinter,
  FiTrash2,
} from "react-icons/fi";
import Dropdown from "@/components/shared/Dropdown";
import SelectDropdown from "@/components/shared/SelectDropdown";
import { paymentTableData } from "@/utils/fackData/paymentTableData";
import Table from "@/components/shared/table/Table";
import Link from "next/link";
import dayjs from "dayjs";
import LeavesSidebar from "./LeavesSidebar";
import { toast } from "react-hot-toast";

const actions = [
  { label: "Edit", icon: <FiEdit3 /> },
  { label: "Print", icon: <FiPrinter /> },
  { label: "Remind", icon: <FiClock /> },
  { type: "divider" },
  { label: "Archive", icon: <FiArchive /> },
  { label: "Report Spam", icon: <FiAlertOctagon /> },
  { type: "divider" },
  { label: "Delete", icon: <FiTrash2 /> },
];

const AllLeavesData = () => {
  // helper functsions
  const toTitleCase = (text = "") =>
    text
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const STATUS_OPTIONS = [
    {
      label: "Pending",
      value: "PENDING",
      color: "#f59e0b", // yellow
    },
    {
      label: "Approved",
      value: "APPROVED",
      color: "#22c55e", // green
    },
    {
      label: "Rejected",
      value: "REJECTED",
      color: "#ef4444", // red
    },
  ];
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

  // helper functsions

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
                  src={user.profileImageUrl}
                  alt={user.profileImageUrl}
                  className="img-fluid"
                  style={{ width: 40, height: 40, objectFit: "cover", borderRadius: "50%" }}
                />
              </div>
              <div>
                <span className="text-truncate-1-line fw-bold">{user.fullName}</span>
                <small className="fs-12 fw-normal text-muted d-block">{user.email}</small>
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
              {toTitleCase(leaveType?.replaceAll("_", " "))}
            </span>
          );
        },
      },
      {
        accessorKey: "startDate",
        header: "Start Date",
        cell: ({ row }) => dayjs(row.original.startDate).format("DD MMM , YYYY"),
      },
      {
        accessorKey: "endDate",
        header: "End Date",
        cell: ({ row }) => dayjs(row.original.endDate).format("DD MMM , YYYY"),
      },
      {
        accessorKey: "status",
        header: () => "Status",
        cell: ({ row }) => {
          const leave = row.original;

          return (
            <SelectDropdown
              options={STATUS_OPTIONS}
              defaultSelect={leave.status} // ✅ STRING
              onSelectOption={(option) => updateLeaveStatus(leave.id, option.value)}
            />
          );
        },
      },
      {
        accessorKey: "CreatedAt",
        header: "Created At",
        cell: ({ row }) => dayjs(row.original.createdAt).format("DD MMM , YYYY"),
      },
      {
        accessorKey: "reason",
        header: "Actions",
        cell: ({ row }) => (
          <div className="hstack gap-2 justify-content-end">
            <button
              className="avatar-text avatar-md"
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
    []
  );

  // function to fetch and set the data to the tabel
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/leaves/all-employee-leaves");
      const data = await res.json();

      console.log("Received leaves:", data.data);
      setData(data.data || []);
    } catch (err) {
      console.error("Error fetching leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateLeaveStatus = async (leaveId, newStatus) => {
    const confirmed = window.confirm(`Are you sure you want to mark this leave as ${newStatus}?`);

    if (!confirmed) return;

    console.log("The requested Leave Id is :", leaveId);

    try {
      const res = await fetch(`/api/v1/leaves/${leaveId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update leave status");
      }

      // 🔥 Update Local State (No Refetch Needed)
      setData((prev) =>
        prev.map((item) => (item.id === leaveId ? { ...item, status: newStatus } : item))
      );

      toast.success(
        `Leave has been ${newStatus.toLowerCase()} successfully.` ||
          "Leave status updated successfully"
      );
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);
  // function to fetch and set the data to the tabel

  return (
    <>
      <Table
        data={data}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search employees..."
      />

      {sidebarOpen && selectedLeave && (
        <LeavesSidebar
          data={selectedLeave}
          onClose={() => {
            setSidebarOpen(false);
            setSelectedLeave(null);
          }}
          onStatusUpdated={fetchLeaves}
        />
      )}
    </>
  );
};

export default AllLeavesData;
