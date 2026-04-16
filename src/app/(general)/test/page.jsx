"use client";
import React, { useEffect, useState, useMemo } from "react";
import Table from "@/components/shared/table/Table";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { FiEye } from "react-icons/fi";

const AttendanceHistory = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);

  // ✅ Fetch Attendance History
  const fetchAttendanceHistory = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/attendance/history", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        setAttendanceData(data.data);
      } else {
        toast.error(data.message || "Failed to load attendance");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceHistory();
  }, []);

  // ✅ Table Columns
  const columns = useMemo(
    () => [
      {
        header: "Employee",
        cell: ({ row }) => {
          const user = row.original.user;

          return (
            <div className="hstack gap-3">
              <img
                src={user?.profileImageUrl || "https://i.pravatar.cc/150"}
                alt="profile"
                className="rounded-circle"
                width={40}
                height={40}
              />
              <div>
                <div className="fw-bold">{user?.fullName}</div>
                <small className="text-muted">{user?.email}</small>
              </div>
            </div>
          );
        },
      },

      {
        header: "Date",
        cell: ({ row }) => dayjs(row.original.date).format("DD MMM YYYY"),
      },

      {
        header: "Punch In",
        cell: ({ row }) =>
          row.original.punchIn ? dayjs(row.original.punchIn).format("hh:mm A") : "-",
      },

      {
        header: "Punch Out",
        cell: ({ row }) =>
          row.original.punchOut ? dayjs(row.original.punchOut).format("hh:mm A") : "-",
      },

      {
        header: "Worked Hours",
        cell: ({ row }) => {
          const mins = row.original.totalMinutes || 0;
          const hrs = (mins / 60).toFixed(2);

          return `${hrs} hrs`;
        },
      },

      {
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;

          let color = "text-muted";

          if (status === "PRESENT") color = "text-success";
          if (status === "INCOMPLETE") color = "text-warning";
          if (status === "ABSENT") color = "text-danger";

          return <span className={color}>{status}</span>;
        },
      },

      {
        header: "Actions",
        cell: ({ row }) => (
          <button
            className="avatar-text avatar-md"
            onClick={() => {
              setSelectedAttendance(row.original);
              setSidebarOpen(true);
            }}
          >
            <FiEye />
          </button>
        ),
      },
    ],
    []
  );

  return (
    <>
      {/* TABLE */}
      <Table
        data={attendanceData}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search Attendance..."
      />

      {/* SIDEBAR (optional detail view) */}
      {sidebarOpen && selectedAttendance && (
        <div className="sidebar">
          <div className="p-3">
            <h5>Attendance Details</h5>

            <p>
              <b>Name:</b> {selectedAttendance.user.fullName}
            </p>
            <p>
              <b>Email:</b> {selectedAttendance.user.email}
            </p>
            <p>
              <b>Date:</b> {dayjs(selectedAttendance.date).format("DD MMM YYYY")}
            </p>
            <p>
              <b>Punch In:</b> {selectedAttendance.punchIn}
            </p>
            <p>
              <b>Punch Out:</b> {selectedAttendance.punchOut}
            </p>
            <p>
              <b>Total Minutes:</b> {selectedAttendance.totalMinutes}
            </p>
            <p>
              <b>Status:</b> {selectedAttendance.status}
            </p>

            <button
              className="btn btn-sm btn-secondary mt-3"
              onClick={() => {
                setSidebarOpen(false);
                setSelectedAttendance(null);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AttendanceHistory;
