"use client";
import React, { useEffect, useState } from "react";

const emptySalary = {
  basic: "",
  hra: "",
  medicalAllowance: "",
  specialAllowance: "",
  incentive: "",
  providentFund: "",
  professionTax: "",
  esic: "",
};

const SalaryStructurePage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    userId: "",
    ...emptySalary,
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

  // 🔹 Fetch Salary (FIXED)
  const fetchSalary = async (userId) => {
    if (!userId) {
      setFormData({ userId: "", ...emptySalary });
      return;
    }

    try {
      const res = await fetch(`/api/payroll/salary-structure?userId=${userId}`);
      const data = await res.json();

      if (data.data) {
        setFormData({
          userId,
          basic: data.data.basic || "",
          hra: data.data.hra || "",
          medicalAllowance: data.data.medicalAllowance || "",
          specialAllowance: data.data.specialAllowance || "",
          incentive: data.data.incentive || "",
          providentFund: data.data.providentFund || "",
          professionTax: data.data.professionTax || "",
          esic: data.data.esic || "",
        });
      } else {
        setFormData({ userId, ...emptySalary });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Handle Input Change (SAFE)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Submit
  const handleSubmit = async () => {
    if (!formData.userId) {
      alert("Please select user");
      return;
    }

    setLoading(true);

    try {
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
      alert(data.success ? "Saved ✅" : "Error ❌");
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
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
      {/* LEFT */}
      <div className="col-xl-8">
        <div className="card">
          <div className="card-header">
            <h5>Salary Structure</h5>
          </div>

          {/* 🔥 KEY ADDED */}
          <div className="card-body" key={formData.userId}>
            {/* Select User */}
            <div className="form-group mb-4">
              <label className="form-label">Select Employee</label>
              <select
                className="form-control"
                value={formData.userId}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    userId: value,
                  }));
                  fetchSalary(value);
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

            <hr />

            {/* Earnings */}
            <h6 className="fw-bold mb-3">Earnings</h6>

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
                    <label>{label}</label>
                    <input
                      type="number"
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className="form-control"
                      disabled={!formData.userId}
                    />
                  </div>
                </div>
              ))}
            </div>

            <hr />

            {/* Deductions */}
            <h6 className="fw-bold mb-3">Deductions</h6>

            <div className="row">
              {[
                ["providentFund", "Provident Fund"],
                ["professionTax", "Professional Tax"],
                ["esic", "ESIC"],
              ].map(([key, label]) => (
                <div className="col-md-6" key={key}>
                  <div className="form-group mb-3">
                    <label>{label}</label>
                    <input
                      type="number"
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className="form-control"
                      disabled={!formData.userId}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !formData.userId}
              className="btn btn-primary mt-3"
            >
              {loading ? "Saving..." : "Save Salary"}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="col-xl-4">
        <div className="card">
          <div className="card-body">
            <h6 className="fw-bold mb-3">Salary Summary</h6>

            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>Total Earnings</th>
                  <td>₹ {earnings}</td>
                </tr>
                <tr>
                  <th>Total Deductions</th>
                  <td>₹ {deductions}</td>
                </tr>
                <tr>
                  <th>Net Salary</th>
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
