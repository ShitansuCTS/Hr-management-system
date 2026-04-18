"use client";

import React, { useEffect, useMemo, useState } from "react";
import SelectDropdown from "@/components/shared/SelectDropdown";

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
  const [usersLoading, setUsersLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    userId: "",
    ...emptySalary,
  });

  const [saving, setSaving] = useState(false);
  const [fetchingSalary, setFetchingSalary] = useState(false);

  // 🔹 Memoized dropdown options (performance)
  const userOptions = useMemo(
    () =>
      users.map((u) => ({
        label: `${u.fullName} (${u.employeeId})`,
        value: u.id,
      })),
    [users]
  );

  // 🔹 Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        const res = await fetch("/api/users/all-users-details");
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        console.error("User fetch error:", err);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 🔹 Fetch Salary
  const fetchSalary = async (userId) => {
    if (!userId) {
      setSelectedUser(null);
      setFormData({ userId: "", ...emptySalary });
      return;
    }

    try {
      setFetchingSalary(true);

      const res = await fetch(`/api/payroll/salary-structure?userId=${userId}`);
      const data = await res.json();

      if (data?.data) {
        setFormData({
          userId,
          basic: data.data.basic ?? "",
          hra: data.data.hra ?? "",
          medicalAllowance: data.data.medicalAllowance ?? "",
          specialAllowance: data.data.specialAllowance ?? "",
          incentive: data.data.incentive ?? "",
          providentFund: data.data.providentFund ?? "",
          professionTax: data.data.professionTax ?? "",
          esic: data.data.esic ?? "",
        });
      } else {
        setFormData({ userId, ...emptySalary });
      }
    } catch (err) {
      console.error("Salary fetch error:", err);
    } finally {
      setFetchingSalary(false);
    }
  };

  // 🔹 Handle Input
  const handleChange = (e) => {
    const { name, value } = e.target;

    // prevent negative values
    if (Number(value) < 0) return;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Submit
  const handleSubmit = async () => {
    if (!formData.userId) return alert("Select employee");

    if (Number(formData.basic) <= 0) {
      return alert("Basic salary must be greater than 0");
    }

    try {
      setSaving(true);

      const res = await fetch("/api/payroll/salary-structure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          basic: parseFloat(formData.basic) || 0,
          hra: parseFloat(formData.hra) || 0,
          medicalAllowance: parseFloat(formData.medicalAllowance) || 0,
          specialAllowance: parseFloat(formData.specialAllowance) || 0,
          incentive: parseFloat(formData.incentive) || 0,
          providentFund: parseFloat(formData.providentFund) || 0,
          professionTax: parseFloat(formData.professionTax) || 0,
          esic: parseFloat(formData.esic) || 0,
        }),
      });

      const data = await res.json();

      if (!data.success) throw new Error("Save failed");

      alert("Salary structure saved ✅");
    } catch (err) {
      console.error(err);
      alert("Something went wrong ❌");
    } finally {
      setSaving(false);
    }
  };

  // 🔥 Calculations
  const earnings = useMemo(() => {
    return (
      parseFloat(formData.basic || 0) +
      parseFloat(formData.hra || 0) +
      parseFloat(formData.medicalAllowance || 0) +
      parseFloat(formData.specialAllowance || 0) +
      parseFloat(formData.incentive || 0)
    );
  }, [formData]);

  const deductions = useMemo(() => {
    return (
      parseFloat(formData.providentFund || 0) +
      parseFloat(formData.professionTax || 0) +
      parseFloat(formData.esic || 0)
    );
  }, [formData]);

  const net = Math.max(0, earnings - deductions);

  const isFormValid = formData.userId && parseFloat(formData.basic || 0) > 0;

  return (
    <div className="row">
      {/* LEFT */}
      <div className="col-xl-8">
        <div className="card shadow-sm">
          <div className="card-header fw-bold">Salary Structure</div>

          <div className="card-body">
            {/* USER SELECT */}
            <div className="mb-4">
              <label className="form-label">Select Employee</label>

              {usersLoading ? (
                <p>Loading users...</p>
              ) : (
                <SelectDropdown
                  options={userOptions}
                  selectedOption={selectedUser}
                  placeholder="Select Employee"
                  onSelectOption={(option) => {
                    setSelectedUser(option);
                    setFormData((prev) => ({
                      ...prev,
                      userId: option.value,
                    }));
                    fetchSalary(option.value);
                  }}
                  searchable
                />
              )}
            </div>

            <hr />

            {/* EARNINGS */}
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
                  <input
                    type="number"
                    name={key}
                    placeholder={label}
                    value={formData[key]}
                    onChange={handleChange}
                    className="form-control mb-3"
                    disabled={!formData.userId || fetchingSalary}
                  />
                </div>
              ))}
            </div>

            <hr />

            {/* DEDUCTIONS */}
            <h6 className="fw-bold mb-3">Deductions</h6>

            <div className="row">
              {[
                ["providentFund", "Provident Fund"],
                ["professionTax", "Professional Tax"],
                ["esic", "ESIC"],
              ].map(([key, label]) => (
                <div className="col-md-6" key={key}>
                  <input
                    type="number"
                    name={key}
                    placeholder={label}
                    value={formData[key]}
                    onChange={handleChange}
                    className="form-control mb-3"
                    disabled={!formData.userId || fetchingSalary}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!isFormValid || saving}
              className="btn btn-primary mt-3"
            >
              {saving ? "Saving..." : "Save Salary"}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="col-xl-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h6 className="fw-bold mb-3">{selectedUser?.label || "Salary Summary"}</h6>

            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>Total Earnings</th>
                  <td>₹ {earnings.toFixed(2)}</td>
                </tr>
                <tr>
                  <th>Total Deductions</th>
                  <td>₹ {deductions.toFixed(2)}</td>
                </tr>
                <tr>
                  <th>Net Salary</th>
                  <td className="fw-bold text-success">₹ {net.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryStructurePage;
