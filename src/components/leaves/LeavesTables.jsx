"use client";
import React, { useEffect, useState, useMemo } from "react";
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
import { paymentTableData } from "@/utils/fackData/paymentTableData";
import Table from "@/components/shared/table/Table";
import Link from "next/link";
import dayjs from "dayjs";
import LeaveApplicationLoaders from "@/components/loaders/LeaveApplicationLoaders";
import LeavesSidebar from "./LeavesSidebar";

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

const LeavesTables = () => {
  // helper functsions
  const toTitleCase = (text = "") =>
    text
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  const LEAVE_STATUS_MAP = {
    PENDING: {
      content: "Pending",
      color: "bg-soft-warning text-warning",
    },
    APPROVED: {
      content: "Approved",
      color: "bg-soft-success text-success",
    },
    REJECTED: {
      content: "Rejected",
      color: "bg-soft-danger text-danger",
    },
  };
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
        id: "employee",
        header: "Employee",
        cell: ({ row }) => {
          const user = row.original.user;

          return (
            <div className="hstack gap-3">
              <div className="avatar-image avatar-md">
                <img
                  src={row.original.user?.profileImageUrl || "/avatar.png"}
                  alt="profile"
                  style={{ width: 40, height: 40, objectFit: "cover", borderRadius: "50%" }}
                />{" "}
              </div>
              <div>
                <span className="text-truncate-1-line fw-bold">{row.original.user.fullName}</span>
                <small className="fs-12 fw-normal text-muted d-block">
                  {row.original.user.email}
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
              {toTitleCase(leaveType.replaceAll("_", " "))}
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
        id: "status",
        header: () => "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          const badge = LEAVE_STATUS_MAP[status];

          return <div className={`badge ${badge?.color}`}>{badge?.content}</div>;
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

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/v1/leaves/myleaves");
        const data = await res.json();

        console.log("Received leaves:", data.data);
        setData(data.data || []);
      } catch (err) {
        console.error("Error fetching leaves:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);
  // function to fetch and set the data to the tabel

  return (
    <>
      <Table data={data} columns={columns} loading={loading} />

      {sidebarOpen && selectedLeave && (
        <LeavesSidebar
          data={selectedLeave}
          currentUserId={selectedLeave?.user?.id}
          onClose={() => {
            setSidebarOpen(false);
            setSelectedLeave(null);
          }}
        />
      )}
    </>
  );
};

export default LeavesTables;
