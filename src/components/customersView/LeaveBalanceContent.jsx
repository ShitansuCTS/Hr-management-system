
"use client";

import React from "react";
import {
    CalendarDays,
    HeartPulse,
    Palmtree,
    Clock,
    CheckCircle2,
    CalendarPlus,
} from "lucide-react";
import CircleProgress from "../shared/CircleProgress";
import Link from "next/link";


const LeaveBalanceContent = ({
    leaveBalances = [],
    leaves = [],
    loading = false,
    error = "",
}) => {
    const currentYear = new Date().getFullYear();

    const currentYearBalances = leaveBalances.filter(
        (leave) => leave.year === currentYear
    );

    const balancesToShow = currentYearBalances.length
        ? currentYearBalances
        : leaveBalances;

    const totalAllocated = balancesToShow.reduce(
        (sum, leave) => sum + (leave.allocated || 0),
        0
    );

    const totalUsed = balancesToShow.reduce(
        (sum, leave) => sum + (leave.used || 0),
        0
    );

    const totalRemaining = balancesToShow.reduce(
        (sum, leave) => sum + (leave.remaining || 0),
        0
    );

    if (loading) {
        return (
            <div className="p-4 text-center py-5">
                <span className="spinner-border spinner-border-sm me-2" />
                <span className="text-muted">Loading leave information...</span>
            </div>
        );
    }
    const getLeaveBalance = (leaveType) =>
        balancesToShow.find((leave) => leave.leaveType === leaveType) || {
            allocated: 0,
            used: 0,
            remaining: 0,
        };

    const paidLeave = getLeaveBalance("PAID_LEAVE");
    const sickLeave = getLeaveBalance("SICK_LEAVE");
    const casualLeave = getLeaveBalance("CASUAL_LEAVE");

    const leaveCategories = [
        {
            label: "Paid Leave",
            allocated: paidLeave.allocated,
            used: paidLeave.used,
            remaining: paidLeave.remaining,
            progressColor: "#3454d1",
        },
        {
            label: "Sick Leave",
            allocated: sickLeave.allocated,
            used: sickLeave.used,
            remaining: sickLeave.remaining,
            progressColor: "#17c666",
        },
        {
            label: "Casual Leave",
            allocated: casualLeave.allocated,
            used: casualLeave.used,
            remaining: casualLeave.remaining,
            progressColor: "#ffa21d",
        },
    ];
    return (
        <div className="p-3 p-md-4">
            {error && (
                <div className="alert alert-danger py-2 small" role="alert">
                    {error}
                </div>
            )}

            {/* Leave Balance Summary */}
            {balancesToShow.length > 0 ? (
                <>



                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <div>
                            <h5 className="fw-semibold mb-1">Leave Categories</h5>
                            <p className="text-muted mb-0">
                                Employee leave allocation and usage

                            </p>
                        </div>

                        <Link href="/leaves/create" className="btn btn-primary px-4 d-inline-flex align-items-center gap-2">
                            <CalendarPlus size={16} />
                            Apply for Leave
                        </Link>
                    </div>
                    <div className="row g-3 mb-4">
                        {leaveCategories.map((leave, index) => {
                            const percentage =
                                leave.allocated > 0
                                    ? Math.round((leave.used / leave.allocated) * 100)
                                    : 0;

                            return (
                                <div key={index} className="col-xxl-4 col-md-6">
                                    <div className="card-body border border-dashed border-gray-5 rounded-3 position-relative">
                                        <div className="hstack justify-content-between gap-1">
                                            <div>
                                                <h6 className="fs-14 ">
                                                    {leave.label}
                                                </h6>

                                                <div className="fs-12 text-muted mb-1">
                                                    {/* <span className="text-dark fw-medium">Allocated:</span>{" "} */}
                                                    {leave.allocated} days
                                                </div>

                                                {/* <div className="fs-12 text-muted mb-1">
                                                                <span className="text-dark fw-medium">Used:</span>{" "}
                                                                {leave.used} days
                                                            </div> */}

                                                {/* <div className="fs-12 text-muted">
                                                                <span className="text-dark fw-medium">Remaining:</span>{" "}
                                                                {leave.remaining} days
                                                            </div> */}
                                            </div>

                                            <div className="project-progress-1">
                                                <CircleProgress
                                                    value={percentage}
                                                    text_sym={"%"}
                                                    path_width="8px"
                                                    path_color={leave.progressColor}
                                                />
                                            </div>
                                        </div>

                                        <div className="badge bg-gray-200 text-dark project-mini-card-badge">
                                            {leave.remaining} Days Left
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>








                    {/* Leave Information */}
                    <div className="mb-4">

                        <ul className="list-unstyled mb-0">
                            {[
                                {
                                    id: "allocated",
                                    title: "Total Allocated",
                                    value: `${totalAllocated} Days`,
                                    description: "Total leave days assigned for this year.",
                                    icon: CalendarDays,
                                    color: "primary",
                                },
                                {
                                    id: "used",
                                    title: "Total Used",
                                    value: `${totalUsed} Days`,
                                    description: "Total leave days utilized.",
                                    icon: Clock,
                                    color: "warning",
                                },
                                {
                                    id: "remaining",
                                    title: "Remaining Leave",
                                    value: `${totalRemaining} Days`,
                                    description: "Total leave days currently available.",
                                    icon: CheckCircle2,
                                    color: "success",
                                },
                            ].map((item) => {
                                const Icon = item.icon;

                                return (
                                    <li
                                        key={item.id}
                                        className="single-task-list p-3 mb-3 border border-dashed rounded-3"
                                    >
                                        <div className="d-flex align-items-center justify-content-between gap-3">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className={`avatar-text avatar-md bg-soft-${item.color} text-${item.color}`}>
                                                    <Icon size={19} />
                                                </div>

                                                <div className="lh-base">
                                                    <div className="fs-13 fw-bold mb-1">
                                                        {item.title}
                                                    </div>

                                                    <div className="fs-12 fw-normal text-muted">
                                                        {item.description}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="d-flex flex-shrink-0 align-items-center">
                                                <span className={`badge bg-soft-${item.color} text-${item.color} fs-12 px-3 py-2`}>
                                                    {item.value}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </>
            ) : (
                <div className="text-center py-4 border rounded-3 mb-4">
                    <p className="fw-semibold mb-1">
                        No leave balances found
                    </p>
                    <p className="text-muted small mb-0">
                        No leave balance has been assigned for the current year.
                    </p>
                </div>
            )}

        </div>
    );
};

export default LeaveBalanceContent;
