"use client";

import React, { useEffect } from "react";
import CardHeader from "@/components/shared/CardHeader";
import { FiCalendar, FiBriefcase } from "react-icons/fi";
import HolidayTableSkeleton from "@/components/loaders/HolidayTableSkeleton";
import { useCompanyCalendarStore } from "@/store/companyCalendarStore";

const HolidaysList = () => {
  const { holidays, loading, fetchHolidays } = useCompanyCalendarStore();

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
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <HolidayTableSkeleton rows={6} />
                ) : holidays.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-3">
                      No holidays found
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
