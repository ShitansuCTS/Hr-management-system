"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FiEye } from "react-icons/fi";
import Table from "@/components/shared/table/Table";
import dayjs from "dayjs";
import getIcon from "@/utils/getIcon";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SelectDropdown from "@/components/shared/SelectDropdown";
import { useAllUsersStore } from "@/store/useAllUserStore";

const EmployeesTable = () => {
  const router = useRouter();

  const {
    users,
    loading,
    fetchUsers,
  } = useAllUsersStore();

  // Selected department id
  const [selectedDepartment, setSelectedDepartment] = useState({
    label: "All Departments",
    value: "",
  });

  // Dropdown options
  const [departments, setDepartments] = useState([
    {
      label: "All Departments",
      value: "",
    },
  ]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "fullName",
        id: "employee",
        header: "Employee Name",
        cell: ({ row }) => {
          const user = row.original;

          return (
            <div className="d-flex align-items-center gap-3">
              <div
                style={{
                  width: 4,
                  height: 40,
                  borderRadius: 4,
                  background: "#3454d1",
                }}
              />

              <div className="avatar-image avatar-md">
                <img
                  src={
                    user.profileImageUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.fullName || "User"
                    )}&background=3454d1&color=fff&size=128`
                  }
                  alt={user.fullName || "User"}
                  className="img-fluid"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </div>

              <div>
                <span className="fw-bold">{user.fullName}</span>
                <small className="text-muted d-block">{user.email}</small>
              </div>
            </div>
          );
        },
      },
      {
        header: "Employee ID",
        cell: ({ row }) => (
          <span className="badge border border-primary border-dashed text-primary">
            {row.original.employeeId}
          </span>
        ),
      },
      {
        header: "Contact",
        cell: ({ row }) => (
          <div className="hstack gap-2">
            <div className="avatar-text avatar-sm">{getIcon("feather-phone")}</div>

            {row.original.phone}
          </div>
        ),
      },
      {
        header: "Department",
        cell: ({ row }) => (
          <span className="badge border border-danger border-dashed text-danger">
            {row.original.department?.name || "—"}
          </span>
        ),
      },
      {
        header: "Last Login",
        cell: ({ row }) => (
          <span className="badge border border-success border-dashed text-success">
            {row.original.lastLoginAt
              ? dayjs(row.original.lastLoginAt).format("DD MMM YYYY, hh:mm A")
              : "Never"}
          </span>
        ),
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <button
            className="avatar-text avatar-md"
            onClick={() => router.push(`/employees/${row.original.employeeId}`)}
          >
            <FiEye />
          </button>
        ),
      },
    ],
    [router]
  );



  const fetchDepartments = async () => {
    try {
      const res = await fetch("/api/v1/departments");
      const json = await res.json();

      const formatted = [
        {
          label: "All Departments",
          value: "",
        },
        ...(json.data || []).map((dept) => ({
          label: dept.name,
          value: dept.id,
        })),
      ];

      setDepartments(formatted);

      // Always select first option
      setSelectedDepartment({
        label: "All Departments",
        value: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch departments");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchUsers(selectedDepartment.value);
  }, [selectedDepartment.value]);

  return (
    <>
      {/* Fixed Header */}
      <div
        className="d-flex justify-content-between align-items-center px-3 py-2 mb-3"
        style={{
          background: "#3454d1",
          borderRadius: 8,
          width: "98%",
          marginLeft: 10,
        }}
      >
        <div>
          <h6 className="text-white mb-0">Search Employees with Filters</h6>
          <small className="text-white opacity-75">
            Filter employees by department
          </small>
        </div>

        <div style={{ width: 260 }}>
          <SelectDropdown
            options={departments}
            selectedOption={selectedDepartment}
            onSelectOption={setSelectedDepartment}
          />
        </div>
      </div>

      {/* Only this section scrolls */}
      <div
        style={{
          height: "calc(100vh - 100px)", // adjust to your layout
          overflowY: "auto",
        }}
      >
        <Table
          data={users}
          columns={columns}
          loading={loading}
          searchPlaceholder="Search employees..."
        />
      </div>
    </>
  );
};

export default EmployeesTable;
