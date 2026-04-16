"use client";

import React, { useEffect, useState, useMemo } from "react";
import Table from "@/components/shared/table/Table";
import dayjs from "dayjs";
import { FiEye } from "react-icons/fi";

const AttendanceHistory = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH HISTORY
  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/attendance/history", {
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        setAttendanceData(data.data);
      }
    } catch (error) {
      console.error("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // ✅ BADGE STYLE (same as holidays)
  const getStatusBadge = (status) => {
    return `
      badge border border-dashed px-2 py-1 text-capitalize
      ${
        status === "PRESENT"
          ? "text-success border-success"
          : status === "INCOMPLETE"
            ? "text-warning border-warning"
            : "text-danger border-danger"
      }
    `;
  };

  // ✅ TABLE COLUMNS (USING YOUR TABLE COMPONENT)
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
        cell: ({ row }) => (
          <span className="badge text-success border border-success border-dashed">
            {dayjs(row.original.date).format("DD MMM YYYY")}
          </span>
        ),
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
          return `${(mins / 60).toFixed(2)} hrs`;
        },
      },

      {
        header: "Status",
        cell: ({ row }) => (
          <span className={getStatusBadge(row.original.status)}>{row.original.status}</span>
        ),
      },

      {
        header: "Actions",
        cell: ({ row }) => (
          <button
            className="avatar-text avatar-md"
            // onClick={() => {
            //   setSelectedAttendance(row.original);
            //   setSidebarOpen(true);
            // }}
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
      {loading ? (
        <Table
          data={[]}
          columns={columns}
          loading={true}
          searchPlaceholder="Search Attendance..."
        />
      ) : attendanceData.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <h6 className="text-muted">Oops! No records found</h6>
          </div>
        </div>
      ) : (
        <Table
          data={attendanceData}
          columns={columns}
          loading={false}
          searchPlaceholder="Search Attendance..."
        />
      )}
    </>
  );
};

export default AttendanceHistory;
