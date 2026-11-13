import React from "react";
import { FiCalendar, FiX } from "react-icons/fi";
import PerfectScrollbar from "react-perfect-scrollbar";
import { upcomingScheduleList } from "@/utils/fackData/upcomingScheduleList";
import ImageGroup from "@/components/shared/ImageGroup";
import { CalendarDays } from "lucide-react";

const CalenderSidebar = ({
  selectedCategories,
  handleCategoryChange,
  handleAllCategory,
  selectAll,
  sidebarOpen,
  setSidebarOpen,
  handleEventBtnClick,
  eventCategoryOptions,
}) => {
  return (
    <div className={`content-sidebar content-sidebar-xl ${sidebarOpen ? "app-sidebar-open" : ""}`}>
      <PerfectScrollbar>
        <div className="content-sidebar-header bg-white sticky-top hstack justify-content-between">
          <h4 className="fw-bolder mb-0">Calendar</h4>
          <a
            href="#"
            className="app-sidebar-close-trigger d-flex"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX />
          </a>
        </div>
        <div className="content-sidebar-header" onClick={(e) => handleEventBtnClick(e)}>
          <a href="#" id="btn-new-schedule" className="btn btn-primary w-100" data-toggle="modal">
            <FiCalendar size={16} className="me-2" />
            <span>New Event</span>
          </a>
        </div>

        <div className="content-sidebar-body">
          <div id="lnb-calendars" className="lnb-calendars">
            <div className="lnb-calendars-item">
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="viewAllSchedules"
                  value="all"
                  checked={selectAll}
                  onChange={(e) => handleAllCategory(e)}
                />
                <label className="custom-control-label c-pointer" htmlFor="viewAllSchedules">
                  <span
                    className="fs-13 fw-semibold lh-lg d-inline-block"
                    style={{ marginTop: "-3px" }}
                  >
                    View All Schedules
                  </span>
                </label>
              </div>
            </div>
            <div id="calendarList" className="lnb-calendars-d1">
              {eventCategoryOptions.map((category) => (
                <div key={category.value} className="filter-item">
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id={category.value}
                      checked={selectedCategories[category.value]}
                      onChange={() => handleCategoryChange(category.value)}
                    />

                    <label
                      className="custom-control-label c-pointer d-flex align-items-center"
                      htmlFor={category.value}
                    >
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: category.color,
                          display: "inline-block",
                          marginRight: 10,
                        }}
                      />

                      <span className="fs-13 fw-semibold">{category.label}</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <h2 className="px-4 fs-10 fw-bold text-uppercase my-4 text-muted text-spacing-1 text-truncate-1-line">
              Events &amp; Schedules
            </h2>
          </div>
          <div className="p-4 border-top c-pointer single-item schedule-item">
            <div className="d-flex align-items-start">
              <div
                className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                style={{
                  width: "42px",
                  height: "42px",
                  background: "#eef2ff",
                  color: "#3156d3",
                }}
              >
                <CalendarDays size={20} />
              </div>

              <div className="ms-3 schedule-body flex-grow-1">
                <div className="text-dark">
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <h6 className="fw-bold my-1 text-truncate-1-line">
                      Monthly Team Meeting
                    </h6>
                    <span className="badge bg-soft-primary text-primary fs-10">
                      Meeting
                    </span>
                  </div>

                  <span className="fs-11 fw-normal text-muted">
                    10:00 AM - 11:00 AM, Conference Room
                  </span>

                  <p className="fs-12 fw-normal text-muted my-3 text-truncate-2-line">
                    Discuss project updates, team performance, upcoming deadlines,
                    and important organizational announcements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PerfectScrollbar>
    </div>
  );
};

export default CalenderSidebar;
