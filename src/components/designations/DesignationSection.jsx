"use client";

import { useEffect, useState } from "react";
import { BriefcaseBusiness, Plus, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

import { useOrganizationStore } from "@/store/useOrganizationStore";
import DesignationCardSkeleton from "@/components/loaders/organization/DesignationCardSkeleton";

export default function DesignationPage() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  const {
    departments,
    designations,
    departmentsLoading,
    designationsLoading,
    designationActionLoading,
    fetchDepartments,
    fetchDesignations,
    createDesignation,
    deleteDesignation,
  } = useOrganizationStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchDepartments(), fetchDesignations()]);
      } catch (error) {
        console.error("Failed to load organization data:", error);
      }
    };

    loadData();
  }, [fetchDepartments, fetchDesignations]);

  const handleCreate = async () => {
    const designationName = name.trim();
    const designationTitle = title.trim();

    if (!designationName || !designationTitle || !departmentId) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await createDesignation({
        name: designationName,
        title: designationTitle,
        departmentId,
      });

      setName("");
      setTitle("");
      setDepartmentId("");
    } catch (error) {
      console.error("Designation creation failed:", error);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Designation?",
      text: "This action cannot be undone.",
      icon: "warning",
      width: 340,
      padding: "1rem",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
      confirmButtonColor: "#3156d3",
      cancelButtonColor: "#eef2ff",
      iconColor: "#3156d3",
      backdrop: "rgba(15,23,42,0.45)",

      didOpen: () => {
        const popup = Swal.getPopup();

        if (popup) {
          popup.style.borderRadius = "12px";
          popup.style.fontFamily = "inherit";
        }

        const titleElement = Swal.getTitle();

        if (titleElement) {
          titleElement.style.fontSize = "18px";
          titleElement.style.fontWeight = "600";
          titleElement.style.color = "#1f2937";
        }

        const textElement = Swal.getHtmlContainer();

        if (textElement) {
          textElement.style.fontSize = "12px";
          textElement.style.color = "#6b7280";
        }

        const icon = popup?.querySelector(".swal2-icon");

        if (icon) {
          icon.style.width = "48px";
          icon.style.height = "48px";
          icon.style.margin = "10px auto";
        }

        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        if (confirmButton) {
          confirmButton.style.borderRadius = "7px";
          confirmButton.style.padding = "7px 18px";
          confirmButton.style.fontSize = "12px";
          confirmButton.style.fontWeight = "600";
        }

        if (cancelButton) {
          cancelButton.style.borderRadius = "7px";
          cancelButton.style.padding = "7px 18px";
          cancelButton.style.fontSize = "12px";
          cancelButton.style.fontWeight = "600";
          cancelButton.style.color = "#3156d3";
        }
      },
    });

    if (!result.isConfirmed) return;

    try {
      await deleteDesignation(id);
    } catch (error) {
      console.error("Designation delete failed:", error);
    }
  };

  const isInitialLoading = departmentsLoading || designationsLoading;

  return (
    <div className="container-fluid py-4">
      {/* Add Designation */}
      <div
        className="card border-0 mb-4"
        style={{
          borderRadius: "12px",
          boxShadow: "0 6px 22px rgba(31, 61, 136, 0.08)",
        }}
      >
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-xl-row justify-content-between align-items-xl-center gap-4">
            {/* Left */}
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
                <BriefcaseBusiness
                  size={20}
                  style={{
                    color: "#3156d3",
                    stroke: "#3156d3",
                  }}
                />
              </div>

              <div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <h5 className="fw-bold mb-0">Add Designation</h5>

                  <span
                    className="badge"
                    style={{
                      background: "#eef2ff",
                      color: "#3156d3",
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "5px 10px",
                      borderRadius: "20px",
                    }}
                  >
                    {designations.length} Designations
                  </span>
                </div>

                <p className="text-muted mb-0 small mt-1">
                  Create and assign job titles to departments.
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="d-flex align-items-center justify-content-xl-end gap-2 flex-wrap">
              <select
                className="form-select"
                value={departmentId}
                onChange={(event) => setDepartmentId(event.target.value)}
                disabled={departmentsLoading || designationActionLoading}
                style={{
                  width: "210px",
                  minHeight: "42px",
                  borderRadius: "8px",
                }}
              >
                <option value="">Select department</option>

                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                className="form-control"
                placeholder="Unique name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={designationActionLoading}
                style={{
                  width: "190px",
                  minHeight: "42px",
                  borderRadius: "8px",
                }}
              />

              <input
                type="text"
                className="form-control"
                placeholder="Display title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleCreate();
                  }
                }}
                disabled={designationActionLoading}
                style={{
                  width: "190px",
                  minHeight: "42px",
                  borderRadius: "8px",
                }}
              />

              <button
                type="button"
                className="btn d-flex align-items-center justify-content-center gap-2"
                onClick={handleCreate}
                disabled={designationActionLoading || departmentsLoading}
                style={{
                  minHeight: "42px",
                  minWidth: "145px",
                  padding: "0 18px",
                  borderRadius: "8px",
                  background: "#3156d3",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: 600,
                }}
              >
                {designationActionLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" aria-hidden="true" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus
                      size={16}
                      style={{
                        color: "#ffffff",
                        stroke: "#ffffff",
                      }}
                    />
                    Add Designation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="row">
        {isInitialLoading ? (
          Array.from({ length: 8 }).map((_, index) => <DesignationCardSkeleton key={index} />)
        ) : designations.length === 0 ? (
          <div className="col-12">
            <div
              className="text-center py-5 px-3"
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
                }}
              >
                <BriefcaseBusiness
                  size={25}
                  style={{
                    color: "#3156d3",
                    stroke: "#3156d3",
                  }}
                />
              </div>

              <h6 className="fw-bold mb-1">No designations found</h6>

              <p className="text-muted fs-13 mb-0">Add your first designation to get started.</p>
            </div>
          </div>
        ) : (
          designations.map((item) => (
            <div key={item.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4">
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
                        <BriefcaseBusiness
                          size={19}
                          style={{
                            color: "#3156d3",
                            stroke: "#3156d3",
                          }}
                        />
                      </div>

                      <div>
                        <h6 className="fw-bold mb-1 text-body">{item.title}</h6>

                        <span className="text-muted fs-11">{item.name}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={designationActionLoading}
                      className="btn d-flex align-items-center justify-content-center p-0"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        background: "#fff1f2",
                        border: "none",
                        flexShrink: 0,
                      }}
                      aria-label={`Delete ${item.title}`}
                    >
                      <Trash2
                        size={15}
                        style={{
                          color: "#dc3545",
                          stroke: "#dc3545",
                        }}
                      />
                    </button>
                  </div>

                  <div
                    className="d-flex justify-content-between align-items-center mt-4 pt-3 gap-2"
                    style={{
                      borderTop: "1px solid #eef0f4",
                    }}
                  >
                    <span
                      className="badge text-truncate"
                      style={{
                        maxWidth: "150px",
                        background: "#eef2ff",
                        color: "#3156d3",
                        borderRadius: "20px",
                        padding: "6px 10px",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                      title={item.department?.name || "No Department"}
                    >
                      {item.department?.name || "No Department"}
                    </span>

                    <span
                      className="badge"
                      style={{
                        background: item.isActive ? "#ecfdf3" : "#fff1f2",
                        color: item.isActive ? "#16803c" : "#dc3545",
                        borderRadius: "20px",
                        padding: "6px 10px",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
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
