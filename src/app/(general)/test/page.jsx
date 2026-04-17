"use client";

import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PayslipTemplate from "@/components/payslip/PayslipTemplate";

const PayrollTable = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ ADD THESE (MISSING)
  const [userId, setUserId] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const fetchPayrolls = async () => {
    setLoading(true);

    try {
      let url = "/api/payroll/list?";

      if (userId) url += `userId=${userId}&`;
      if (month) url += `month=${month}&`;
      if (year) url += `year=${year}&`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setPayrolls(data.data);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };
  useEffect(() => {
    fetchPayrolls();
  }, []);

  const resetFilters = () => {
    setUserId("");
    setMonth("");
    setYear("");
    fetchPayrolls();
  };

  const downloadPDF = async () => {
    const element = document.getElementById("payslip-area");

    if (!element) return;

    await new Promise((r) => setTimeout(r, 300)); // ⬅️ IMPORTANT FIX

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`payslip-${selectedPayroll.user.employeeId}.pdf`);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Payroll History</h2>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-3 mb-5 items-end">
        {/* MONTH DROPDOWN */}
        <div>
          <label className="text-xs">Month</label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border p-2 rounded block"
          >
            <option value="">All Months</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>

        {/* YEAR DROPDOWN */}
        <div>
          <label className="text-xs">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border p-2 rounded block"
          >
            <option value="">All Years</option>

            {Array.from({ length: 5 }, (_, i) => {
              const y = new Date().getFullYear() - i;
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </select>
        </div>

        {/* EMPLOYEE FILTER (OPTIONAL but kept) */}
        <input
          type="text"
          placeholder="Employee ID / Name"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border p-2 rounded"
        />

        {/* BUTTONS */}
        <button onClick={fetchPayrolls} className="bg-blue-600 text-white px-4 py-2 rounded">
          Search
        </button>

        <button onClick={resetFilters} className="bg-gray-300 px-4 py-2 rounded">
          Reset
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Employee</th>
              <th className="p-2 border">Emp ID</th>
              <th className="p-2 border">Month</th>
              <th className="p-2 border">Year</th>
              <th className="p-2 border">Gross</th>
              <th className="p-2 border">Deductions</th>
              <th className="p-2 border">Net</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : payrolls.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-4">
                  No payroll found
                </td>
              </tr>
            ) : (
              payrolls.map((p) => (
                <tr key={p.id} className="text-center">
                  <td className="border p-2">{p.user.fullName}</td>
                  <td className="border p-2">{p.user.employeeId}</td>
                  <td className="border p-2">{p.month}</td>
                  <td className="border p-2">{p.year}</td>
                  <td className="border p-2">{p.grossSalary}</td>
                  <td className="border p-2">{p.totalDeductions}</td>
                  <td className="border p-2 font-bold">{p.netSalary}</td>
                  <td className="border p-2">{new Date(p.createdAt).toLocaleDateString()}</td>

                  <td className="border p-2">
                    <button
                      onClick={() => {
                        setSelectedPayroll(p);
                        setShowPreview(true);
                      }}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPreview && selectedPayroll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          {/* MODAL BOX */}
          <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl overflow-hidden">
            {/* HEADER */}
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h2 className="font-semibold">Payslip Preview</h2>

              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-4 max-h-[80vh] overflow-auto bg-gray-50">
              <div id="payslip-area" className="bg-white p-6 shadow-md">
                <PayslipTemplate payroll={selectedPayroll} />
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 px-4 py-3 border-t">
              <button onClick={() => setShowPreview(false)} className="px-4 py-2 border rounded">
                Close
              </button>

              <button onClick={downloadPDF} className="px-4 py-2 bg-green-600 text-white rounded">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollTable;
