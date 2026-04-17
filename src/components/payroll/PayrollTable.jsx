"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";

const monthsList = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatCurrency = (num = 0) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(num);

const PayrollTable = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [previewData, setPreviewData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);

  const [attendanceInput, setAttendanceInput] = useState({
    presentDays: 0,
    absentDays: 0,
  });

  const sidebarRef = useRef(null);

  // ================= FETCH USERS =================
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users/all-users-details", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setUsers(data.users);
    };
    fetchUsers();
  }, []);

  // ================= SYNC ATTENDANCE =================
  useEffect(() => {
    if (previewData?.attendance) {
      setAttendanceInput({
        presentDays: previewData.attendance.presentDays ?? 0,
        absentDays: previewData.attendance.absentDays ?? 0,
      });
    }
  }, [previewData]);

  // ================= CLOSE EVENTS =================
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpenSidebar(false);
    };

    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpenSidebar(false);
      }
    };

    document.addEventListener("keydown", handleEsc);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ================= FETCH PREVIEW =================
  const fetchPreview = async (attendanceOverride = null) => {
    if (!selectedUser) return alert("Select user");

    setLoading(true);

    try {
      const res = await fetch("/api/payroll/preview", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser,
          month,
          year,
          attendance: attendanceOverride,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setPreviewData(data.data);
        setOpenSidebar(true);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ================= SAVE PAYROLL =================
  const handleSave = async () => {
    try {
      if (!previewData) return;

      const payload = {
        userId: selectedUser,
        month,
        year,
        salary: previewData.salary,
        deductions: previewData.deductions,
        attendance: previewData.attendance,
        grossSalary: previewData.summary.grossSalary,
        totalDeductions: previewData.summary.totalDeductions,
        netSalary: previewData.summary.netSalary,
      };

      const res = await fetch("/api/payroll/generate", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Payroll Saved Successfully");
        setOpenSidebar(false);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  // ================= PAYSLIP =================
  const handlePayslip = async () => {
    try {
      const res = await fetch("/api/payroll/payslip", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser,
          month,
          year,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("📄 Payslip Generated");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ================= UI =================
  return (
    <>
      {/* TOP BAR */}
      <div className="card p-3">
        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.fullName}
              </option>
            ))}
          </select>

          <select
            className="form-select"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {monthsList.map((m, i) => (
              <option key={i} value={i + 1}>
                {m}
              </option>
            ))}
          </select>

          <input
            type="number"
            className="form-control"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />

          <button className="btn btn-primary" onClick={() => fetchPreview()}>
            {loading ? "Loading..." : "Generate"}
          </button>
        </div>
      </div>

      {/* SIDEBAR */}
      {openSidebar && (
        <>
          <div className="sidebar-overlay" />

          <div
            ref={sidebarRef}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              width: "420px",
              height: "100%",
              background: "var(--bs-body-bg)",
              zIndex: 1000,
              overflowY: "auto",
            }}
          >
            <div className="d-flex flex-column h-100">
              {/* HEADER */}
              <div className="p-3 border-bottom d-flex justify-content-between">
                <h5>Payroll Preview</h5>
                <button className="btn btn-light" onClick={() => setOpenSidebar(false)}>
                  <FiX />
                </button>
              </div>

              <div className="p-3 flex-grow-1">
                <h6>{previewData?.user?.fullName}</h6>

                {/* SALARY */}
                <h6>Salary</h6>
                {Object.entries(previewData?.salary || {}).map(([k, v]) => (
                  <div key={k} className="mb-2">
                    <label className="text-capitalize small">{k}</label>
                    <div className="form-control bg-light">₹{formatCurrency(v)}</div>
                  </div>
                ))}

                {/* ATTENDANCE */}
                <h6 className="mt-3">Attendance</h6>

                <label>Present Days</label>
                <input
                  type="number"
                  className="form-control mb-2"
                  value={attendanceInput.presentDays}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setAttendanceInput({
                      presentDays: val,
                      absentDays: (previewData?.attendance?.totalWorkingDays || 0) - val,
                    });
                  }}
                />

                <label>Absent Days</label>
                <input
                  type="number"
                  className="form-control mb-2"
                  value={attendanceInput.absentDays}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setAttendanceInput({
                      absentDays: val,
                      presentDays: (previewData?.attendance?.totalWorkingDays || 0) - val,
                    });
                  }}
                />

                <p>
                  Total Working Days: <strong>{previewData?.attendance?.totalWorkingDays}</strong>
                </p>

                {/* SUMMARY */}
                <h6 className="mt-3">Summary</h6>

                <p>Gross: ₹{formatCurrency(previewData?.summary?.grossSalary)}</p>
                <p>Deductions: ₹{formatCurrency(previewData?.summary?.totalDeductions)}</p>

                <h5 className="text-success">
                  Net: ₹{formatCurrency(previewData?.summary?.netSalary)}
                </h5>
              </div>

              {/* FOOTER */}
              <div className="p-3 border-top d-flex gap-2">
                <button className="btn btn-success w-50" onClick={handleSave}>
                  Save Payroll
                </button>

                <button className="btn btn-primary w-50" onClick={handlePayslip}>
                  Payslip
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PayrollTable;
