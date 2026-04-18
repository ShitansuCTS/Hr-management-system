"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import SelectDropdown from "@/components/shared/SelectDropdown";
import PayrollTable from "@/app/(general)/test/page"
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
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(num);

const PayrollPage = () => {
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [attendanceInput, setAttendanceInput] = useState({
    presentDays: 0,
    absentDays: 0,
  });

  const drawerRef = useRef(null);

  // ================= USERS =================
  useEffect(() => {
    const fetchUsers = async () => {
      setUsersLoading(true);
      try {
        const res = await fetch("/api/users/all-users-details", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setUsers(data.users);
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const userOptions = useMemo(
    () =>
      users.map((u) => ({
        label: `${u.fullName} (${u.employeeId})`,
        value: u.id,
      })),
    [users]
  );

  // ================= PREVIEW =================
  const fetchPreview = async (override = null) => {
    if (!selectedUser) return alert("Select employee");

    setLoading(true);
    try {
      const res = await fetch("/api/payroll/preview", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.value,
          month,
          year,
          attendance: override,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setPreviewData(data.data);
        setDrawerOpen(true);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= SYNC ATTENDANCE =================
  useEffect(() => {
    if (previewData?.attendance) {
      setAttendanceInput(previewData.attendance);
    }
  }, [previewData]);

  // ================= SAVE =================
  const handleSave = async () => {
    try {
      const payload = {
        userId: selectedUser.value,
        month,
        year,
        salary: previewData.salary,
        deductions: previewData.deductions,
        attendance: attendanceInput,
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
        alert("✅ Payroll Saved");
        setDrawerOpen(false);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ================= UI =================

  // Create month options (same format as users)
  const monthOptions = monthsList.map((m, i) => ({
    label: m,
    value: i + 1,
  }));

  const [selectedMonth, setSelectedMonth] = useState({
    label: monthsList[new Date().getMonth()],
    value: new Date().getMonth() + 1,
  });
  return (
    <>
      {/* HEADER */}
      <div className="d-flex flex-column" style={{ height: "100vh", overflow: "hidden" }}>
        <div
          className="bg-white border-bottom px-3 py-2"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1020,
          }}
        >
          <div className="d-flex align-items-end gap-3 flex-wrap">
            {/* EMPLOYEE (BIG) */}
            <div className="flex-grow-1" style={{ minWidth: 320, maxWidth: 520 }}>
              <label className="form-label small text-muted">Employee</label>

              {usersLoading ? (
                <div className="form-control">Loading...</div>
              ) : (
                <div className="position-relative">
                  <SelectDropdown
                    options={userOptions}
                    selectedOption={selectedUser}
                    placeholder="Select Employee"
                    onSelectOption={setSelectedUser}
                    searchable
                  />
                </div>
              )}
            </div>

            {/* MONTH */}
            <div style={{ width: 240 }}>
              <label className="form-label small text-muted">Month</label>
              <div className="position-relative">
                <SelectDropdown
                  options={monthOptions}
                  selectedOption={selectedMonth}
                  placeholder="Select Month"
                  onSelectOption={(option) => {
                    setSelectedMonth(option);
                    setMonth(option.value); // 🔥 keep your existing logic
                  }}
                />
              </div>
            </div>

            {/* YEAR */}
            <div style={{ width: 240 }}>
              <label className="form-label small text-muted">Year</label>
              <input
                type="number"
                className="form-control"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </div>

            {/* BUTTON */}
            <div>
              <label className="form-label invisible">Action</label>

              <button
                className="btn btn-primary px-4 w-100 d-flex align-items-center justify-content-center"
                style={{ height: "43px", minWidth: 160 }}
                onClick={() => fetchPreview()}
                disabled={!selectedUser || loading}
              >
                {loading && <span className="spinner-border spinner-border-sm me-2" />}
                Generate
              </button>
            </div>
          </div>
        </div>
        {/* ================= SCROLLABLE CONTENT ================= */}

        {/* Your table / list goes here */}
        <div className=" p-3" style={{ overflowY: "auto" }}>
          <h5>Payroll Records</h5>
          <PayrollTable refreshKey={refreshKey} />
        </div>
      </div>

      {/* ================= DRAWER ================= */}
      {drawerOpen && (
        <>
          {/* OVERLAY */}
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 1040,
            }}
          />

          {/* SIDEBAR */}
          <div
            ref={drawerRef}
            className="bg-white shadow-lg d-flex flex-column"
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              width: "420px",
              height: "100%",
              zIndex: 1050,
              overflow: "hidden",
            }}
          >
            {/* HEADER */}
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0 fw-bold">Payroll Preview</h5>
                <small className="text-muted">{previewData?.user?.fullName}</small>
              </div>

              <button className="btn btn-light" onClick={() => setDrawerOpen(false)}>
                <FiX />
              </button>
            </div>

            {/* BODY */}
            <div className="flex-grow-1 p-3" style={{ overflowY: "auto" }}>
              {/* SALARY */}
              <h6 className="fw-bold mb-2">Salary Breakdown</h6>

              {Object.entries(previewData?.salary || {}).map(([key, value]) => (
                <div key={key} className="mb-2">
                  <label className="small text-muted text-capitalize">{key}</label>
                  <div className="form-control bg-light">₹ {formatCurrency(value)}</div>
                </div>
              ))}

              {/* ATTENDANCE */}
              <h6 className="fw-bold mt-4">Attendance</h6>

              <label className="small">Present Days</label>
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

              <label className="small">Absent Days</label>
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

              <p className="text-muted small">
                Total Working Days: <strong>{previewData?.attendance?.totalWorkingDays}</strong>
              </p>

              {/* SUMMARY */}
              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="fw-bold mb-2">Summary</h6>

                <div className="d-flex justify-content-between">
                  <span>Gross</span>
                  <span>₹ {formatCurrency(previewData?.summary?.grossSalary)}</span>
                </div>

                <div className="d-flex justify-content-between">
                  <span>Deductions</span>
                  <span>₹ {formatCurrency(previewData?.summary?.totalDeductions)}</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between fw-bold text-success">
                  <span>Net Salary</span>
                  <span>₹ {formatCurrency(previewData?.summary?.netSalary)}</span>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="p-3 border-top d-flex gap-2">
              <button className="btn btn-success w-100" onClick={handleSave}>
                Save Payroll
              </button>

              <button className="btn btn-primary w-100">Generate Payslip</button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PayrollPage;
