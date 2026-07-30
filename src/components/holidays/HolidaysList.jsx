"use client";

import React, { useEffect } from "react";
import CardHeader from "@/components/shared/CardHeader";
import { FiCalendar, FiBriefcase, FiEdit2, FiTrash2 } from "react-icons/fi";
import HolidayTableSkeleton from "@/components/loaders/HolidayTableSkeleton";
import { useCompanyCalendarStore } from "@/store/companyCalendarStore";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import EmptyState from "@/components/sharedUi/EmptyState";

const HolidaysList = () => {
  const { holidays, loading, fetchHolidays, removeHoliday } = useCompanyCalendarStore();
  useEffect(() => {
    fetchHolidays();
  }, [fetchHolidays]);

  const getHolidayStatus = (holidayDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const date = new Date(holidayDate);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return {
        label: "Today",
        className: "bg-soft-success text-success",
      };
    }

    if (date > today) {
      return {
        label: "Upcoming",
        className: "bg-soft-primary text-primary",
      };
    }

    return {
      label: "Expired",
      className: "bg-soft-danger text-danger",
    };
  };

  const handleDeleteHoliday = async (id) => {
    const result = await Swal.fire({
      title: "Delete Holiday?",
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
          popup.style.borderRadius = "5px";
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
          confirmButton.style.borderRadius = "3px";
          confirmButton.style.padding = "7px 18px";
          confirmButton.style.fontSize = "12px";
          confirmButton.style.fontWeight = "600";
        }

        if (cancelButton) {
          cancelButton.style.borderRadius = "3px";
          cancelButton.style.padding = "7px 18px";
          cancelButton.style.fontSize = "12px";
          cancelButton.style.fontWeight = "600";
          cancelButton.style.color = "#3156d3";
        }
      },
    });

    if (!result.isConfirmed) return;

    const response = await removeHoliday(id);

    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };
  return (
    <div className="col-lg-12">
      <div className="card stretch stretch-full">
        <CardHeader title="Holidays Tracker" />

        <div className="card-body custom-card-action p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Holiday Name</th>
                  <th className="w-25">Status</th>
                  <th>Date</th>
                  <th>Holiday Day</th>
                  <th>Holiday Type</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <HolidayTableSkeleton rows={6} />
                ) : holidays.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState
                        height="350px"
                        image="/illustrations/nodata.svg"
                        title="No holidays found"
                        description="No holidays have been added yet. Once created, they'll appear here."
                      />
                    </td>
                  </tr>
                ) : (
                  holidays.map((holiday) => {
                    const status = getHolidayStatus(holiday.date);

                    return (
                      <tr key={holiday.id}>
                        {/* Holiday Name */}
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <div
                              style={{
                                width: "4px",
                                height: "40px",
                                borderRadius: "4px",
                                backgroundColor: "#3454d1",
                              }}
                            />

                            <div className="hstack gap-3">
                              <div className="avatar-text bg-soft-primary text-primary">
                                <FiBriefcase size={16} />
                              </div>

                              <span className="fw-bold">{holiday.name}</span>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td>
                          <span className={`badge ${status.className}`}>{status.label}</span>
                        </td>

                        {/* Date */}
                        <td>
                          <span className="badge text-success border border-success border-dashed">
                            {holiday.date
                              ? new Date(holiday.date).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : ""}
                          </span>
                        </td>

                        {/* Day */}
                        <td className="text-end">
                          <button
                            className="btn btn-md btn-light-brand"
                            style={{ padding: "6px 12px" }}
                          >
                            <FiCalendar className="me-2" size={16} />
                            {holiday.day}
                          </button>
                        </td>

                        {/* Type */}
                        <td>
                          {holiday.type && (
                            <span
                              className={`badge border border-dashed text-capitalize
                                ${
                                  holiday.type === "NATIONAL"
                                    ? "text-warning border-warning"
                                    : holiday.type === "FESTIVAL"
                                      ? "text-primary border-primary"
                                      : holiday.type === "COMPANY"
                                        ? "text-danger border-danger"
                                        : "text-secondary border-secondary"
                                }`}
                            >
                              {holiday.type}
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              type="button"
                              className="avatar-text avatar-md text-danger"
                              aria-label="Delete Holiday"
                              title="Delete Holiday"
                              onClick={() => handleDeleteHoliday(holiday.id)}
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidaysList;
