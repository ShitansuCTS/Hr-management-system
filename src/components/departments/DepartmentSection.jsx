"use client";

import { useEffect, useState } from "react";
import { useOrganizationStore } from "@/store/useOrganizationStore";
import Swal from "sweetalert2";
import { Building2, Plus, Trash2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import DepartmentCardSkeleton from "@/components/loaders/organization/DepartmentCardSkeleton";

export default function DepartmentSection() {
  const [name, setName] = useState("");

  const {
    departments,
    departmentsLoading,
    departmentActionLoading,
    fetchDepartments,
    createDepartment,
    deleteDepartment,
  } = useOrganizationStore();

  useEffect(() => {
    fetchDepartments().catch((error) => {
      console.error(error);
    });
  }, [fetchDepartments]);

  const handleCreate = async () => {
    const departmentName = name.trim();

    if (!departmentName) {
      toast.error("Please enter a department name");
      return;
    }

    try {
      await createDepartment(departmentName);
      setName("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Department?",
      text: "This action cannot be undone.",
      icon: "warning",

      width: 340,
      padding: "1rem",

      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",

      reverseButtons: true,
      focusCancel: true,

      confirmButtonColor: "#3454d1 ",
      cancelButtonColor: "#eef2ff",

      iconColor: "#3454d1",

      buttonsStyling: true,

      backdrop: "rgba(15,23,42,0.45)",

      didOpen: () => {
        const popup = Swal.getPopup();

        popup.style.borderRadius = "8px";
        popup.style.fontFamily = "inherit";

        // Title
        Swal.getTitle().style.fontSize = "20px";
        Swal.getTitle().style.fontWeight = "600";
        Swal.getTitle().style.color = "#1f2937";
        Swal.getTitle().style.marginBottom = "8px";

        // Text
        Swal.getHtmlContainer().style.fontSize = "13px";
        Swal.getHtmlContainer().style.color = "#6b7280";
        Swal.getHtmlContainer().style.lineHeight = "1.5";

        // Icon
        const icon = popup.querySelector(".swal2-icon");
        if (icon) {
          icon.style.width = "55px";
          icon.style.height = "55px";
          icon.style.margin = "10px auto";
        }

        // Buttons
        Swal.getConfirmButton().style.borderRadius = "2px";
        Swal.getConfirmButton().style.padding = "8px 20px";
        Swal.getConfirmButton().style.fontSize = "13px";
        Swal.getConfirmButton().style.fontWeight = "600";

        Swal.getCancelButton().style.borderRadius = "2px";
        Swal.getCancelButton().style.padding = "8px 20px";
        Swal.getCancelButton().style.fontSize = "13px";
        Swal.getCancelButton().style.fontWeight = "600";
        Swal.getCancelButton().style.color = "#3454d1 ";
      },
    });

    if (!result.isConfirmed) return;

    try {
      await deleteDepartment(id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Page Header */}
      {/* <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1 text-dark">Departments</h4>

          <p className="text-muted mb-0 fs-13">Manage your organization departments.</p>
        </div>

        <div
          className="d-flex align-items-center gap-2 px-3 py-2"
          style={{
            background: "#eef2ff",
            borderRadius: "8px",
            color: "#3156d3",
          }}
        >
          <Building2 size={17} />

          <span className="fw-semibold fs-13">{departments.length} Departments</span>
        </div>
      </div> */}

      {/* Add Department */}
      <div
        className="card border-0 mb-4"
        style={{
          borderRadius: "12px",
          boxShadow: "0 6px 22px rgba(31, 61, 136, 0.08)",
        }}
      >
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-4">
            {/* Left Section */}
            <div>
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "10px",
                    background: "#eef2ff",
                    flexShrink: 0,
                  }}
                >
                  <Plus
                    size={20}
                    style={{
                      color: "#3156d3",
                      stroke: "#3156d3",
                    }}
                  />
                </div>

                <div>
                  <div className="d-flex align-items-center gap-2">
                    <h5 className="fw-bold mb-0">Add Department</h5>

                    <span
                      className="badge"
                      style={{
                        background: "#eef2ff",
                        color: "#3156d3",
                        fontSize: "11px",
                        fontWeight: "600",
                        padding: "5px 10px",
                        borderRadius: "20px",
                      }}
                    >
                      {departments.length} Departments
                    </span>
                  </div>

                  <p className="text-muted mb-0 small mt-1">
                    Create and manage organization departments.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div
              className="d-flex align-items-center gap-2 flex-wrap justify-content-lg-end"
              style={{ minWidth: "420px" }}
            >
              <input
                type="text"
                className="form-control"
                placeholder="Department name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreate();
                  }
                }}
                disabled={departmentActionLoading}
                style={{
                  width: "280px",
                  height: "42px",
                  borderRadius: "8px",
                }}
              />

              <button
                type="button"
                className="btn d-flex align-items-center gap-2"
                onClick={handleCreate}
                disabled={departmentActionLoading}
                style={{
                  height: "42px",
                  padding: "0 18px",
                  background: "#3156d3",
                  color: "#fff",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: 600,
                }}
              >
                {departmentActionLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm"></span>
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Add Department
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Department Cards */}
      <div className="row">
        {departmentsLoading ? (
          Array.from({ length: 8 }).map((_, index) => <DepartmentCardSkeleton key={index} />)
        ) : departments.length === 0 ? (
          <div className="col-12">
            <div
              className="text-center bg-white py-5 px-3"
              style={{
                borderRadius: "12px",
                border: "1px dashed #cbd5e1",
              }}
            >
              <div
                className="d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{
                  width: "55px",
                  height: "55px",
                  borderRadius: "14px",
                  background: "#eef2ff",
                  color: "#3156d3",
                }}
              >
                <Building2 size={25} />
              </div>

              <h6 className="fw-bold mb-1">No departments found</h6>

              <p className="text-muted fs-13 mb-0">Add your first department to get started.</p>
            </div>
          </div>
        ) : (
          departments.map((department) => (
            <div key={department.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4">
              <div
                className="card h-100 border-0"
                style={{
                  borderRadius: "12px",
                  boxShadow: "0 6px 20px rgba(31, 61, 136, 0.08)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "4px",
                    background: "#3156d3",
                  }}
                />

                <div className="card-body p-4">
                  <div className="d-flex align-items-start justify-content-between gap-3">
                    <div className="d-flex align-items-center gap-3">
                      {/* <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "10px",
                          background: "#eef2ff",
                          color: "#3156d3",
                          flexShrink: 0,
                        }}
                      >
                        <Building2 size={20} />
                      </div> */}
                        <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "10px",
                          background: "#eef2ff",
                          flexShrink: 0,
                        }}
                      >
                        <Building2
                          size={19}
                          style={{
                            color: "#3156d3",
                            stroke: "#3156d3",
                          }}
                        />
                      </div>

                      <div>
                        <h6 className="fw-bold text-dark mb-1">{department.name}</h6>

                        {/* <span className="text-muted fs-11">Organization Department</span> */}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(department.id)}
                      disabled={departmentActionLoading}
                      className="btn d-flex align-items-center justify-content-center p-0"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        background: "#fff1f2",
                        border: "none",
                        flexShrink: 0,
                      }}
                      aria-label={`Delete ${department.name}`}
                    >
                      <Trash2
                        size={15}
                        strokeWidth={2}
                        style={{
                          color: "#dc3545",
                          stroke: "#dc3545",
                        }}
                      />
                    </button>
                  </div>

                  <div
                    className="d-flex align-items-center justify-content-between mt-4 pt-3"
                    style={{
                      borderTop: "1px solid #eef0f4",
                    }}
                  >
                    <span
                      className="badge"
                      style={{
                        background: department.isActive ? "#ecfdf3" : "#fff1f2",
                        color: department.isActive ? "#16803c" : "#dc3545",
                        borderRadius: "20px",
                        padding: "6px 10px",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      {department.isActive ? "Active" : "Inactive"}
                    </span>
                    <button
                      type="button"
                      className="btn btn-sm d-flex align-items-center gap-1"
                      style={{
                        background: "#eef2ff",
                        borderRadius: "7px",
                        border: "none",
                        padding: "7px 11px",
                      }}
                    >
                      <span
                        style={{
                          color: "#3156d3",
                          fontWeight: 600,
                          fontSize: "12px",
                        }}
                      >
                        View
                      </span>

                      <ArrowRight
                        size={14}
                        style={{
                          color: "#3156d3",
                          stroke: "#3156d3",
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
