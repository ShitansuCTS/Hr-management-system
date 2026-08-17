"use client";

import React, { Fragment, useEffect, useMemo } from "react";
import CircleProgress from "@/components/shared/CircleProgress";
import CardLoader from "@/components/shared/CardLoader";
import LeavesBalance from "@/components/loaders/LeavesBalanceLoaders";
import useCardTitleActions from "@/hooks/useCardTitleActions";
import { useLeaveStore } from "@/store/useLeaveStore";

const LeaveSidebar = ({ footerShow, title, btnFooter }) => {
  const {
    refreshKey,
    isRemoved,
    isExpanded,
    handleRefresh,
    handleExpand,
    handleDelete,
  } = useCardTitleActions();

  const {
    leaveBalances,
    fetchLeaveBalances,
    loading,
  } = useLeaveStore();

  useEffect(() => {
    fetchLeaveBalances();
  }, [fetchLeaveBalances]);

  /*
   * Only the leave types currently supported
   */
  const LEAVE_CONFIG = {
    PAID_LEAVE: {
      label: "Paid Leave",
      color: "#3454d1",
      bgColor: "bg-primary",
      borderColor: "border-primary",
    },

    SICK_LEAVE: {
      label: "Sick Leave",
      color: "#ef4444",
      bgColor: "bg-danger",
      borderColor: "border-danger",
    },

    CASUAL_LEAVE: {
      label: "Casual Leave",
      color: "#16b364",
      bgColor: "bg-success",
      borderColor: "border-success",
    },
  };

  /*
   * Keep only supported leave types
   */
  const leaveData = useMemo(() => {
    return (leaveBalances || [])
      .filter((leave) => LEAVE_CONFIG[leave.leaveType])
      .map((leave) => {
        const config = LEAVE_CONFIG[leave.leaveType];

        const allocated = Number(leave.allocated) || 0;
        const used = Number(leave.used) || 0;
        const remaining =
          leave.remaining !== undefined
            ? Number(leave.remaining)
            : Math.max(allocated - used, 0);

        const percentage =
          allocated > 0
            ? Math.round((used / allocated) * 100)
            : 0;

        return {
          ...leave,
          label: config.label,
          color: config.color,
          bgColor: config.bgColor,
          borderColor: config.borderColor,
          allocated,
          used,
          remaining,
          percentage,
        };
      });
  }, [leaveBalances]);

  /*
   * Overall leave utilization
   */
  const totalAllocated = leaveData.reduce(
    (sum, leave) => sum + leave.allocated,
    0
  );

  const totalUsed = leaveData.reduce(
    (sum, leave) => sum + leave.used,
    0
  );

  const totalRemaining = leaveData.reduce(
    (sum, leave) => sum + leave.remaining,
    0
  );

  const overallProgress =
    totalAllocated > 0
      ? Math.round((totalUsed / totalAllocated) * 100)
      : 0;

  if (isRemoved) return null;

  return (
    <div className="col-xxl-4">
      <div
        className={`card stretch stretch-full ${isExpanded ? "card-expand" : ""
          } ${refreshKey ? "card-loading" : ""}`}
      >
        {loading ? (
          <LeavesBalance rows={3} />
        ) : (
          <>
            {/* =========================
                            CIRCLE PROGRESS
                        ========================== */}
            <div className="card-header justify-content-center">
              <div className="times-progress-chart" >
                <CircleProgress
                  value={overallProgress}
                  text_sym={"%"}
                  path_color="#3454d1"
                  path_width="6"
                />
              </div>
            </div>

            {/* =========================
                            LEAVE LIST
                        ========================== */}
            <div className="card-body">
              {leaveData.length === 0 ? (
                <div className="text-center text-muted py-4">
                  No leave balance available
                </div>
              ) : (
                leaveData.map((leave, index) => (
                  <Fragment key={leave.leaveType}>
                    <div className="hstack gap-3 justify-content-between">
                      {/* LEFT */}
                      <div className="hstack gap-3">
                        {/* Color Indicator */}
                        <div
                          className={`wd-7 ht-7 ${leave.bgColor} rounded-circle`}
                        />

                        {/* Leave Details */}
                        <div
                          className={`ps-3 border-start border-3 ${leave.borderColor} rounded`}
                        >
                          <div className="fw-bold text-truncate-1-line">
                            {leave.label}
                          </div>

                          <div className="fs-12 fw-medium text-muted">
                            {leave.used}/{leave.allocated}{" "}
                            Days Used
                          </div>
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div className="text-end">
                        <div
                          className="fw-bold"
                          style={{
                            color: leave.color,
                          }}
                        >
                          {leave.remaining}
                        </div>

                        <div className="fs-11 text-muted">
                          Days Left
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    {index !== leaveData.length - 1 && (
                      <hr className="border-dashed my-3" />
                    )}
                  </Fragment>
                ))
              )}
            </div>

            {/* =========================
                            FOOTER
                        ========================== */}
            <div className="card-footer hstack justify-content-around">
              <div className="text-center">
                <div className="fs-16 fw-bold text-primary">
                  {totalUsed}/{totalAllocated}
                </div>

                <div className="fs-11 text-muted">
                  Days Used
                </div>
              </div>

              <span className="vr"></span>

              <div className="text-center">
                <div className="fs-16 fw-bold text-success">
                  {totalRemaining}
                </div>

                <div className="fs-11 text-muted">
                  Days Remaining
                </div>
              </div>
            </div>
          </>
        )}

        {footerShow && (
          <div className="card-footer fs-11 fw-bold text-uppercase text-center">
            Updated recently
          </div>
        )}

        {btnFooter && (
          <div className="card-footer">
            <button
              type="button"
              className="btn btn-primary w-100"
            >
              View Leave Details
            </button>
          </div>
        )}

        <CardLoader refreshKey={refreshKey} />
      </div>
    </div>
  );
};

export default LeaveSidebar;