"use client";

import React, { useEffect, useMemo, useState } from "react";
import Table from "@/components/shared/table/Table";
import dayjs from "dayjs";
import { FiEye } from "react-icons/fi";
import PayslipTemplate from "@/components/payslip/PayslipTemplate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const PayrollTable = ({ refreshKey }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // ================= FETCH =================
  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/payroll/list");
      const result = await res.json();

      if (result.success) {
        setData(result.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, [refreshKey]); // 🔥 AUTO REFRESH

  // ================= PDF =================
  const downloadPDF = async () => {
    const element = document.getElementById("payslip-area");
    if (!element) return;

    await new Promise((r) => setTimeout(r, 300));

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

  // ================= COLUMNS =================
  const columns = useMemo(
    () => [
      {
        accessorKey: "user.fullName",
        header: "Employee",
        cell: ({ row }) => {
          const user = row.original.user;

          return (
            <div>
              <div className="fw-bold">{user.fullName}</div>
              <small className="text-muted">{user.employeeId}</small>
            </div>
          );
        },
      },
      {
        accessorKey: "month",
        header: "Month",
      },
      {
        accessorKey: "year",
        header: "Year",
      },
      {
        accessorKey: "grossSalary",
        header: "Gross",
      },
      {
        accessorKey: "totalDeductions",
        header: "Deductions",
      },
      {
        accessorKey: "netSalary",
        header: "Net Salary",
        meta: { className: "fw-bold text-success" },
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => dayjs(row.original.createdAt).format("DD MMM YYYY"),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            className="avatar-text avatar-md"
            onClick={() => {
              setSelectedPayroll(row.original);
              setShowPreview(true);
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
      <Table
        data={data}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search payroll..."
      />

      {/* ================= PREVIEW MODAL ================= */}
      {showPreview && selectedPayroll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white w-full max-w-4xl rounded shadow-lg">
            {/* HEADER */}
            <div className="flex justify-between p-3 border-b">
              <h5>Payslip Preview</h5>
              <button onClick={() => setShowPreview(false)}>✕</button>
            </div>

            {/* BODY */}
            <div className="p-4 max-h-[80vh] overflow-auto bg-gray-50">
              <div id="payslip-area" className="bg-white p-6">
                <PayslipTemplate payroll={selectedPayroll} />
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-2 p-3 border-t">
              <button onClick={() => setShowPreview(false)} className="btn btn-light">
                Close
              </button>

              <button onClick={downloadPDF} className="btn btn-success">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PayrollTable;
