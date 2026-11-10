"use client";

import React, { useEffect, useState } from "react";
import { FiClock } from "react-icons/fi";

function formatDuration(totalMinutes) {
  const hours = Math.floor((totalMinutes || 0) / 60);
  const minutes = (totalMinutes || 0) % 60;
  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

const AttendancePage = () => {
  const [records, setRecords] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [activeAttendance, setActiveAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAttendance() {
      try {
        const [historyResponse, todayResponse] = await Promise.all([
          fetch("/api/attendance/history", { credentials: "include", cache: "no-store" }),
          fetch("/api/attendance", { credentials: "include", cache: "no-store" }),
        ]);
        const [historyResult, todayResult] = await Promise.all([
          historyResponse.json(),
          todayResponse.json(),
        ]);

        if (!historyResponse.ok || !historyResult.success) {
          throw new Error(historyResult.message || "Unable to load attendance history.");
        }
        if (!todayResponse.ok || !todayResult.success) {
          throw new Error(todayResult.message || "Unable to load today's attendance.");
        }

        if (active) {
          setRecords(historyResult.data || []);
          setTodayAttendance(todayResult.attendance || null);
          setActiveAttendance(todayResult.activeAttendance || null);
        }
      } catch (loadError) {
        console.error("Load attendance page failed:", loadError);
        if (active) setError(loadError.message || "Unable to load attendance.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAttendance();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="main-content">
      <div className="row">
        <div className="col-12">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
            <div>
              <h2 className="fw-bold mb-1">My Attendance</h2>
              <p className="text-muted mb-0">Review your punch times and working duration.</p>
            </div>
            <div className="card border-0 shadow-sm">
              <div className="card-body d-flex align-items-center gap-3 px-4 py-3">
                <span className="rounded-circle bg-primary-subtle text-primary p-3 d-flex">
                  <FiClock size={20} />
                </span>
                <div>
                  <small className="text-muted d-block">Today’s status</small>
                  <strong className={activeAttendance ? "text-success" : "text-dark"}>
                    {activeAttendance
                      ? "Punched In"
                      : todayAttendance?.punchOut
                        ? "Completed"
                        : "Not Punched In"}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="fw-bold mb-0">Attendance history</h5>
            </div>
            {error ? (
              <div className="alert alert-danger m-3 mb-0" role="alert">
                {error}
              </div>
            ) : loading ? (
              <div className="text-center text-muted py-5">
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Loading attendance...
              </div>
            ) : records.length === 0 ? (
              <div className="text-center text-muted py-5">
                <FiClock size={28} className="mb-2" />
                <p className="mb-0">Not Punched In</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Date</th>
                      <th>Punch In</th>
                      <th>Punch Out</th>
                      <th>Working Duration</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr key={record.id}>
                        <td className="ps-4 fw-semibold">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td>
                          {record.punchIn ? new Date(record.punchIn).toLocaleTimeString() : "—"}
                        </td>
                        <td>
                          {record.punchOut ? new Date(record.punchOut).toLocaleTimeString() : "—"}
                        </td>
                        <td>
                          {record.totalMinutes === null
                            ? record.punchIn
                              ? "In progress"
                              : "—"
                            : formatDuration(record.totalMinutes)}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              record.punchOut
                                ? "bg-success-subtle text-success"
                                : "bg-warning-subtle text-warning"
                            }`}
                          >
                            {record.punchOut ? "Completed" : "In progress"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
