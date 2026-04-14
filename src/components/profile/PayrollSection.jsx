"use client";
import React, { useEffect, useState } from "react";

const PayrollSection = ({ user }) => {
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchSalary = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/payroll/salary-structure?userId=${user.id}`
        );
        const data = await res.json();

        if (data.success) {
          setSalary(data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalary();
  }, [user?.id]);

  if (!user) return <div className="p-4">Loading user...</div>;
  if (loading) return <div className="p-4">Loading salary...</div>;
  if (!salary) return <div className="p-4 text-danger">No Salary Found</div>;

  const totalEarnings =
    salary.basic +
    salary.hra +
    salary.medicalAllowance +
    salary.specialAllowance +
    salary.incentive;

  const totalDeductions =
    salary.providentFund +
    salary.professionTax +
    salary.esic;

  const netSalary = totalEarnings - totalDeductions;

  return (
    <div className="p-4">
      <h5 className="mb-4">Salary Structure</h5>

      <div className="table-responsive">
        <table className="table table-bordered align-middle text-center">
          <thead className="table-light dark:bg-gray-800">
            <tr>
              <th>Earnings</th>
              <th>Amount (₹)</th>
              <th>Deductions</th>
              <th>Amount (₹)</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Basic</td>
              <td>{salary.basic}</td>
              <td>Provident Fund</td>
              <td>{salary.providentFund}</td>
            </tr>

            <tr>
              <td>HRA</td>
              <td>{salary.hra}</td>
              <td>Professional Tax</td>
              <td>{salary.professionTax}</td>
            </tr>

            <tr>
              <td>Medical</td>
              <td>{salary.medicalAllowance}</td>
              <td>ESIC</td>
              <td>{salary.esic}</td>
            </tr>

            <tr>
              <td>Special Allowance</td>
              <td>{salary.specialAllowance}</td>
              <td>-</td>
              <td>-</td>
            </tr>

            <tr>
              <td>Incentive</td>
              <td>{salary.incentive}</td>
              <td>-</td>
              <td>-</td>
            </tr>

            <tr className="fw-bold bg-light dark:bg-gray-700">
              <td>Total Earnings</td>
              <td>₹ {totalEarnings}</td>
              <td>Total Deductions</td>
              <td>₹ {totalDeductions}</td>
            </tr>

            <tr className="fw-bold text-success">
              <td colSpan="3">Net Salary</td>
              <td>₹ {netSalary}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollSection;