"use client";
import React, { useEffect, useState } from "react";

export default function SalaryStructurePage() {
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
      const res = await fetch("/api/users/all-users-details"); // make sure this exists
      const data = await res.json();

      console.log("The response is ,", data.users);
      setUsers(data.users || []);
    };
    fetchUsers();
  }, []);

  // 🔹 Fetch Salary when user changes
  const fetchSalary = async (userId) => {
    if (!userId) return;

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
      // reset if no salary exists
      setFormData((prev) => ({
        ...prev,
        userId,
        basic: "",
        hra: "",
        medicalAllowance: "",
        specialAllowance: "",
        incentive: "",
        providentFund: "",
        professionTax: "",
        esic: "",
      }));
    }
  };

  // 🔹 Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🔹 Submit
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

    if (data.success) {
      alert("Salary saved successfully ✅");
    } else {
      alert("Error saving salary ❌");
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Salary Structure
        </h2>

        {/* User Select */}
        <select
          className="w-full mb-4 p-2 border rounded bg-gray-50 dark:bg-gray-800 text-black dark:text-white"
          value={formData.userId}
          onChange={(e) => {
            handleChange(e);
            fetchSalary(e.target.value);
          }}
          name="userId"
        >
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.fullName}
            </option>
          ))}
        </select>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4">
          {[
            "basic",
            "hra",
            "medicalAllowance",
            "specialAllowance",
            "incentive",
            "providentFund",
            "professionTax",
            "esic",
          ].map((field) => (
            <input
              key={field}
              type="number"
              name={field}
              placeholder={field}
              value={formData[field]}
              onChange={handleChange}
              className="p-2 border rounded bg-gray-50 dark:bg-gray-800 text-black dark:text-white"
            />
          ))}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          {loading ? "Saving..." : "Save Salary"}
        </button>
      </div>
    </div>
  );
}
