"use client";
import React, { useEffect, useState } from "react";

const SalaryStructurePage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    userId: "",
    basic: "",
    hra: "",
    medicalAllowance: "",
    specialAllowance: "",
    incentive: "",
    providentFund: "",
    professionTax: "",
    esic: "",
  });

  // 🔹 Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users/all-users-details");
      const data = await res.json();
      setUsers(data.users || []);
    };
    fetchUsers();
  }, []);

  // 🔹 Fetch Salary
  const fetchSalary = async (userId) => {
    if (!userId) return;

    const res = await fetch(`/api/payroll/salary-structure?userId=${userId}`);
    const data = await res.json();

    if (data.data) {
      setFormData({ userId, ...data.data });
    } else {
      setFormData((prev) => ({ ...prev, userId }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);

    const res = await fetch("/api/payroll/salary-structure", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        basic: Number(formData.basic),
        hra: Number(formData.hra),
        medicalAllowance: Number(formData.medicalAllowance),
        specialAllowance: Number(formData.specialAllowance),
        incentive: Number(formData.incentive),
        providentFund: Number(formData.providentFund),
        professionTax: Number(formData.professionTax),
        esic: Number(formData.esic),
      }),
    });

    const data = await res.json();
    setLoading(false);

    alert(data.success ? "Saved ✅" : "Error ❌");
  };

  // 🔥 Calculations
  const earnings =
    Number(formData.basic || 0) +
    Number(formData.hra || 0) +
    Number(formData.medicalAllowance || 0) +
    Number(formData.specialAllowance || 0) +
    Number(formData.incentive || 0);

  const deductions =
    Number(formData.providentFund || 0) +
    Number(formData.professionTax || 0) +
    Number(formData.esic || 0);

  const net = earnings - deductions;

  return (
    <>
      {/* LEFT SIDE */}
      <div className="col-xl-8">
        <div className="card">
          <div className="card-header">
            <h5>Salary Structure</h5>
          </div>

          <div className="card-body">
            {/* Employee Select */}
            <div className="form-group mb-4">
              <label className="form-label">Select Employee</label>
              <select
                className="form-control"
                name="userId"
                value={formData.userId}
                onChange={(e) => {
                  handleChange(e);
                  fetchSalary(e.target.value);
                }}
              >
                <option value="">Choose Employee</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.fullName} ({u.employeeId})
                  </option>
                ))}
              </select>
            </div>

            <hr className="border-dashed" />

            {/* Earnings */}
            <div className="mb-4">
              <h6 className="fw-bold">Earnings</h6>
            </div>

            <div className="row">
              {[
                ["basic", "Basic Salary"],
                ["hra", "HRA"],
                ["medicalAllowance", "Medical Allowance"],
                ["specialAllowance", "Special Allowance"],
                ["incentive", "Incentive"],
              ].map(([key, label]) => (
                <div className="col-md-6" key={key}>
                  <div className="form-group mb-3">
                    <label className="form-label">{label}</label>
                    <input
                      type="number"
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>
              ))}
            </div>

            <hr className="border-dashed" />

            {/* Deductions */}
            <div className="mb-4">
              <h6 className="fw-bold">Deductions</h6>
            </div>

            <div className="row">
              {[
                ["providentFund", "Provident Fund"],
                ["professionTax", "Professional Tax"],
                ["esic", "ESIC"],
              ].map(([key, label]) => (
                <div className="col-md-6" key={key}>
                  <div className="form-group mb-3">
                    <label className="form-label">{label}</label>
                    <input
                      type="number"
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Submit */}
            <button onClick={handleSubmit} disabled={loading} className="btn btn-primary mt-3">
              {loading ? "Saving..." : "Save Salary"}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE (LIKE INVOICE TOTAL CARD) */}
      <div className="col-xl-4">
        <div className="card stretch stretch-full">
          <div className="card-body">
            <div className="mb-4 d-flex justify-content-between">
              <div>
                <h6 className="fw-bold">Salary Summary</h6>
                <span className="fs-12 text-muted">Overview</span>
              </div>
            </div>

            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th className="fs-10 text-uppercase">Total Earnings</th>
                  <td>₹ {earnings}</td>
                </tr>
                <tr>
                  <th className="fs-10 text-uppercase">Total Deductions</th>
                  <td>₹ {deductions}</td>
                </tr>
                <tr className="bg-gray-100">
                  <th className="fs-10 text-uppercase">Net Salary</th>
                  <td className="fw-bold text-success">₹ {net}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalaryStructurePage;
