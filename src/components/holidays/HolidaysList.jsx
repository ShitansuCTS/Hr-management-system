"use client";
import React, { useEffect, useState } from "react";

import CardHeader from "@/components/shared/CardHeader";
import Pagination from "@/components/shared/Pagination";
import HorizontalProgress from "@/components/shared/HorizontalProgress";
import { projectsData } from "@/utils/fackData/projectsData";
import {
  FiBell,
  FiClock,
  FiGlobe,
  FiPrinter,
  FiSun,
  FiCalendar,
  FiBriefcase,
} from "react-icons/fi";
import HolidayTableSkeleton from "@/components/loaders/HolidayTableSkeleton";

const HolidaysList = () => {
  const data = projectsData.trackerProjects;
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch holidays from API
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/v1/holidays");
        const result = await res.json();

        console.log("Received holidays:", result.data);
        setHolidays(result.data || []); // assuming API returns an array of holidays
      } catch (err) {
        console.error("Error fetching holidays:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, []);

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
        <CardHeader title={"Holidays Tracker"} />

        <div className="card-body custom-card-action p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th scope="col">Holiday Name</th>
                  <th scope="col" className="w-25">
                    Status
                  </th>
                  <th scope="col">Date</th>
                  <th scope="col">Holiday Day</th>
                  <th scope="col">Holiday Type</th>
                  {/* <th scope="col" className="text-end">Action</th> */}
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
                  holidays.map((holiday) => (
                    <tr key={holiday.id}>
                      {/* Holiday Name */}
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          {/* ✅ Vertical Bar */}
                          <div
                            style={{
                              width: "4px",
                              height: "40px",
                              borderRadius: "4px",
                              backgroundColor: "#3454d1",
                            }}
                          />
                          {/* ✅ Content */}
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
                        {/* <div className="d-flex align-items-center gap-2">
                                                    <span
                                                        className="rounded-circle bg-success"
                                                        style={{ width: 10, height: 10 }}
                                                    />
                                                    <span className="fs-12 fw-medium">Holiday</span>
                                                </div> */}
                        {(() => {
                          const status = getHolidayStatus(holiday.date);
                          return (
                            <span className={`badge ${status.className}`}>{status.label}</span>
                          );
                        })()}
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
                        {/* <span
                                                    className="badge"
                                                    style={{
                                                        backgroundColor: "#3454d1",
                                                        color: "#fff",
                                                        padding: "0.4em 0.8em",
                                                        borderRadius: "9999px",
                                                        fontSize: "0.85em",
                                                        boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                                                    }}
                                                >
                                                    {holiday.date
                                                        ? new Date(holiday.date).toLocaleDateString()
                                                        : ""}
                                                </span> */}
                      </td>

                      {/* Day */}
                      {/* <td className="fw-bold">{holiday.day}</td> */}
                      {/* <td className="text-end"><span className={`badge bg-soft-primary text-primary`}>{holiday.day}</span></td> */}
                      <td className="text-end">
                        {" "}
                        <a
                          href="#"
                          className="btn btn-md btn-light-brand"
                          ref={(el) =>
                            el && el.style.setProperty("padding", "6px 0px", "important")
                          }
                        >
                          <FiCalendar className="me-2" size={16} />
                          <span>{holiday.day}</span>
                        </a>
                      </td>
                      {/* Add this line */}

                      {/* Holiday Type */}
                      <td>
                        {/* {holiday.type && (
                                                    <span
                                                        className="badge"
                                                        style={{
                                                            backgroundColor:
                                                                holiday.type === "NATIONAL"
                                                                    ? "#f59e0b"
                                                                    : holiday.type === "FESTIVAL"
                                                                        ? "#60a5fa"
                                                                        : holiday.type === "COMPANY"
                                                                            ? "#ef4444"
                                                                            : "#3454d1",
                                                            color: "#fff",
                                                            padding: "0.4em 0.8em",
                                                            borderRadius: "0.5rem",
                                                            fontSize: "0.85em",
                                                            textTransform: "capitalize",
                                                        }}
                                                    >
                                                        {holiday.type}
                                                    </span>
                                                )} */}
                        {holiday.type && (
                          <span
                            className={`badge border border-dashed px-2 py-1 text-capitalize
                ${holiday.type === "NATIONAL"
                                ? "text-warning border-warning"
                                : holiday.type === "FESTIVAL"
                                  ? "text-primary border-primary"
                                  : holiday.type === "COMPANY"
                                    ? "text-danger border-danger"
                                    : "text-secondary border-secondary"
                              }
            `}
                          >
                            {holiday.type}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
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
