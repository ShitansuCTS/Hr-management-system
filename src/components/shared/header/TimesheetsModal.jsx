'use client'
import Link from "next/link";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiClock } from "react-icons/fi";

const TimesheetsModal = () => {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);


  // 🔹 Fetch today's attendance
  const fetchAttendance = async () => {
    try {
      const res = await fetch("/api/attendance", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        setAttendance(data.attendance);
      }
    } catch (error) {
      console.error("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handlePunchIn = async () => {
    const res = await fetch("/api/attendance", {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();

    if (data.success) {
      setMessage("✅ You have successfully punched in.");
      fetchAttendance();
    } else {
      setMessage("⚠ " + data.message);
    }
  };

  const handlePunchOut = async () => {
    const res = await fetch("/api/attendance", {
      method: "PUT",
      credentials: "include",
    });

    const data = await res.json();

    if (data.success) {
      setMessage("🎉 Your shift is over for today!");
      fetchAttendance();
    } else {
      setMessage("⚠ " + data.message);
    }
  };

  // 🔹 Determine UI State
  const renderContent = () => {
    if (loading) return <p className="text-muted">Loading...</p>;

    if (!attendance) {
      return (
        <>
          <p className="text-muted">You have not punched in today.</p>
          <button className="btn btn-sm btn-primary" onClick={handlePunchIn}>
            Punch In
          </button>
        </>
      );
    }

    if (attendance.punchIn && !attendance.punchOut) {
      return (
        <>
          <p className="text-success">
            Punched In at {new Date(attendance.punchIn).toLocaleTimeString()}
          </p>
          <button className="btn btn-sm btn-warning" onClick={handlePunchOut}>
            Punch Out
          </button>
        </>
      );
    }

    if (attendance.punchOut) {
      return (
        <>
          <p className="text-success">
            Completed Today
          </p>
          <p className="text-muted small">
            Total Minutes: {attendance.totalMinutes}
          </p>
          <button className="btn btn-sm btn-secondary" disabled>
            Completed
          </button>
        </>
      );
    }
  };

  return (
    <div className="dropdown nxl-h-item">
      <div
        className="nxl-head-link me-0"
        data-bs-toggle="dropdown"
        role="button"
        data-bs-auto-close="outside"
      >
        <FiClock size={20} />
        <span className="badge bg-success nxl-h-badge">2</span>
      </div>

      <div className="dropdown-menu dropdown-menu-end nxl-h-dropdown nxl-timesheets-menu">
        <div className="d-flex justify-content-between align-items-center timesheets-head">
          <h6 className="fw-bold text-dark mb-0">Timesheets</h6>
        </div>

        <div className="d-flex justify-content-between align-items-center flex-column timesheets-body">
          <FiClock size={40} className="mb-3 text-muted" />
          {renderContent()}
        </div>

        <div className="text-center timesheets-footer">
          <Link href={"/holidays/my-attendance"} className="fs-13 fw-semibold text-dark">
            View Attendance
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TimesheetsModal;
