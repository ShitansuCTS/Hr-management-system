"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiClock } from "react-icons/fi";

function formatDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

const TimesheetsModal = () => {
  const [attendance, setAttendance] = useState(null);
  const [activeAttendance, setActiveAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestPending, setRequestPending] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [fetchError, setFetchError] = useState("");

  const fetchAttendance = useCallback(async (showError = false) => {
    try {
      setFetchError("");
      const response = await fetch("/api/attendance", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch attendance.");
      }

      setAttendance(data.attendance || null);
      setActiveAttendance(data.activeAttendance || null);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
      setFetchError(error.message || "Failed to fetch attendance.");
      if (showError) toast.error(error.message || "Failed to refresh attendance.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  useEffect(() => {
    if (!activeAttendance?.punchIn) return undefined;

    const timerId = window.setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => window.clearInterval(timerId);
  }, [activeAttendance?.punchIn]);

  const submitPunch = async (method) => {
    setRequestPending(true);

    try {
      const response = await fetch("/api/attendance", {
        method,
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Attendance update failed.");
      }

      if (method === "POST") {
        setAttendance(data.attendance);
        setActiveAttendance(data.attendance);
        toast.success("Punch-in recorded.");
      } else {
        setAttendance(data.attendance);
        setActiveAttendance(null);
        toast.success("Punch-out recorded.");
        await fetchAttendance();
      }
    } catch (error) {
      console.error("Attendance update failed:", error);
      toast.error(error.message || "Attendance update failed.");
      await fetchAttendance();
    } finally {
      setRequestPending(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <p className="text-muted mb-0">Loading attendance...</p>;
    }

    if (fetchError) {
      return <p className="text-danger small mb-0">{fetchError}</p>;
    }

    if (activeAttendance?.punchIn) {
      const elapsedSeconds = Math.max(
        0,
        Math.floor((currentTime - new Date(activeAttendance.punchIn).getTime()) / 1000)
      );

      return (
        <div className="w-100 text-center">
          <span className="badge bg-success-subtle text-success mb-2">Punched In</span>
          <p className="text-muted small mb-1">
            Since {new Date(activeAttendance.punchIn).toLocaleTimeString()}
          </p>
          <div
            className="fw-bold text-dark fs-4 mb-3"
            aria-live="polite"
            aria-label={`Working duration ${formatDuration(elapsedSeconds)}`}
          >
            {formatDuration(elapsedSeconds)}
          </div>
          <button
            type="button"
            className="btn btn-sm btn-warning"
            onClick={() => submitPunch("PUT")}
            disabled={requestPending}
          >
            {requestPending ? "Saving..." : "Punch Out"}
          </button>
        </div>
      );
    }

    if (attendance?.punchOut) {
      return (
        <div className="w-100 text-center">
          <span className="badge bg-primary-subtle text-primary mb-2">
            Completed Today
          </span>

          <p className="text-muted small mb-3">
            Total working time: {formatDuration((attendance.totalMinutes || 0) * 60)}
          </p>

          <div className="d-flex justify-content-center">
            <button type="button" className="btn btn-sm btn-secondary" disabled>
              Completed
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="w-100 text-center">
        <p className="text-muted mb-2">Not Punched In</p>

        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => submitPunch("POST")}
            disabled={requestPending}
          >
            {requestPending ? "Saving..." : "Punch In"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="dropdown nxl-h-item">
      <button
        type="button"
        className="nxl-head-link me-0 border-0 bg-transparent position-relative"
        data-bs-toggle="dropdown"
        aria-label="Open attendance timesheet"
        aria-expanded="false"
        onClick={() => fetchAttendance(true)}
      >
        <FiClock size={20} />
        <span
          className={`badge nxl-h-badge ${activeAttendance ? "bg-success" : "bg-secondary"
            }`}
          aria-label={activeAttendance ? "Punched in" : "Not punched in"}
        >
          {activeAttendance ? "IN" : "—"}
        </span>
      </button>

      <div
        className="dropdown-menu dropdown-menu-end nxl-h-dropdown nxl-timesheets-menu p-0 border-0 shadow-lg"
        style={{
          width: 340,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          className="d-flex justify-content-between align-items-center px-3 py-3"
          style={{
            background: "#fff",
            borderBottom: "1px solid #f1f1f1",
          }}
        >
          <div>
            <h6 className="fw-bold text-dark mb-1">
              Attendance
            </h6>
            <p className="text-muted mb-0" style={{ fontSize: 12 }}>
              Your daily attendance overview
            </p>
          </div>

          <div
            className="d-flex align-items-center justify-content-center rounded-0"
            style={{
              width: 38,
              height: 38,
              background: "#f1f5f9",
              color: "#475569",
            }}
          >
            <FiClock size={19} />
          </div>
        </div>

        {/* Status */}
        <div className="px-3 pt-3 pb-2">
          <div
            className="d-flex align-items-center justify-content-between p-3 rounded-0"
            style={{
              background: activeAttendance ? "#f0fdf4" : "#f8fafc",
              border: `1px solid ${activeAttendance ? "#dcfce7" : "#e9edf2"
                }`,
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <span
                className="rounded-circle"
                style={{
                  width: 9,
                  height: 9,
                  background: activeAttendance ? "#16a34a" : "#94a3b8",
                }}
              />

              <div>
                <div className="fw-semibold text-dark" style={{ fontSize: 13 }}>
                  {activeAttendance ? "You're punched in" : "Not punched in"}
                </div>
                <div className="text-muted" style={{ fontSize: 11 }}>
                  {activeAttendance
                    ? "Your attendance session is active"
                    : "Your attendance session hasn't started"}
                </div>
              </div>
            </div>

            <span
              className={`badge rounded-pill ${activeAttendance ? "bg-success" : "bg-secondary"
                }`}
              style={{ fontSize: 10, padding: "5px 9px" }}
            >
              {activeAttendance ? "ACTIVE" : "OFFLINE"}
            </span>
          </div>
        </div>

        {/* Attendance Content */}
        <div className="px-3 pb-3">
          {renderContent()}
        </div>

        {/* Footer */}
        {/* <div
          className="px-3 py-3"
          style={{
            background: "#fafafa",
            borderTop: "1px solid #f1f1f1",
          }}
        >
          <Link
            href="/attendance"
            className="d-flex align-items-center justify-content-center gap-2 text-decoration-none fw-semibold"
            style={{
              fontSize: 13,
              color: "#334155",
            }}
          >
            View Attendance History
            <span aria-hidden="true">→</span>
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default TimesheetsModal;
