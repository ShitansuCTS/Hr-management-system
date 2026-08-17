"use client";
import React from "react";
import Link from "next/link";
import CardHeader from "@/components/shared/CardHeader";
import CircleProgress from "@/components/shared/CircleProgress";
import { teamMembersList } from "@/utils/fackData/teamMembersList";
import CardLoader from "@/components/shared/CardLoader";
import useCardTitleActions from "@/hooks/useCardTitleActions";
import Image from "next/image";
import { useEffect } from "react";
import { usehrdashboardStore } from "@/store/usehrdashboardStore";
import { FaAward } from "react-icons/fa";
import LeavesBalance from "@/components/loaders/LeavesBalanceLoaders";
import "@/style/dashboard/admin/dashboard.css";

const WorkAniversaryOverview = ({ footerShow, title, btnFooter }) => {
    const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } =
        useCardTitleActions();

    if (isRemoved) {
        return null;
    }

    const { anniversaryinfo, fetchDashboard, loading } = usehrdashboardStore();

    const data = anniversaryinfo || [];

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    const truncateText = (text, limit = 15) => {
        if (!text) return "";
        return text.length > limit ? text.substring(0, limit) + ".." : text;
    };

    return (
        <div className="col-xxl-4">
            <div
                className={`card stretch stretch-full ${isExpanded ? "card-expand" : ""
                    } ${refreshKey ? "card-loading" : ""}`}
            >
                <CardHeader
                    title={title}
                    refresh={handleRefresh}
                    remove={handleDelete}
                    expanded={handleExpand}
                />

                <div className="card-body custom-card-action">
                    {loading ? (
                        <LeavesBalance />
                    ) : data.length === 0 ? (
                        <div className="d-flex flex-column align-items-center justify-content-center py-5">
                            <div
                                className="d-flex align-items-center justify-content-center rounded-circle mb-3"
                                style={{
                                    width: "52px",
                                    height: "52px",
                                    backgroundColor: "#EEF2FF",
                                }}
                            >
                                <FaAward
                                    size={23}
                                    style={{ color: "#3454d1" }}
                                />
                            </div>

                            <div className="fw-semibold text-dark">
                                No upcoming anniversaries
                            </div>

                            <div className="fs-11 text-muted mt-1 text-center">
                                Work anniversaries will appear here.
                            </div>
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-2">
                            {data.map((emp, index) => (
                                <div
                                    key={emp.id}
                                    className="anniversary-item d-flex align-items-center justify-content-between"
                                >
                                    {/* Employee */}
                                    <div className="d-flex align-items-center gap-3 min-w-0">
                                        {/* Avatar */}
                                        <div className="position-relative flex-shrink-0">
                                            <div
                                                className="avatar-image"
                                                style={{
                                                    width: "42px",
                                                    height: "42px",
                                                }}
                                            >
                                                <img
                                                    src={
                                                        emp.profileImageUrl ||
                                                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                            emp.fullName || "User"
                                                        )}&background=3454d1&color=fff&size=128`
                                                    }
                                                    alt={
                                                        emp.fullName || "Employee"
                                                    }
                                                    className="img-fluid"
                                                />
                                            </div>

                                            {/* Award indicator */}
                                            <span
                                                className="position-absolute d-flex align-items-center justify-content-center rounded-circle"
                                                style={{
                                                    width: "18px",
                                                    height: "18px",
                                                    right: "-5px",
                                                    bottom: "-3px",
                                                    backgroundColor: "#fff",
                                                    boxShadow:
                                                        "0 2px 6px rgba(0,0,0,0.12)",
                                                }}
                                            >
                                                <FaAward
                                                    size={10}
                                                    style={{
                                                        color: "#F59E0B",
                                                    }}
                                                />
                                            </span>
                                        </div>

                                        {/* Employee info */}
                                        <div className="min-w-0">
                                            <Link
                                                href={`/employees/${emp.employeeId}`}
                                                className="d-block fw-semibold text-dark text-truncate"
                                                style={{
                                                    maxWidth: "150px",
                                                }}
                                            >
                                                {truncateText(
                                                    emp.fullName,
                                                    18
                                                )}
                                            </Link>

                                            <div className="d-flex align-items-center gap-1 mt-1">
                                                <span className="fs-11 text-muted">
                                                    Work Anniversary
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Anniversary */}
                                    <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                        <div className="text-end">
                                            <div
                                                className="fw-bold"
                                                style={{
                                                    fontSize: "18px",
                                                    lineHeight: "20px",
                                                    color: "#3454d1",
                                                }}
                                            >
                                                {emp.yearsCompleted}
                                            </div>

                                            <div className="fs-10 text-muted">
                                                {emp.yearsCompleted === 1
                                                    ? "Year"
                                                    : "Years"}
                                            </div>
                                        </div>

                                        <div
                                            className="d-flex align-items-center justify-content-center rounded-circle"
                                            style={{
                                                width: "38px",
                                                height: "38px",
                                                backgroundColor: "#FFF7E6",
                                            }}
                                        >
                                            <FaAward
                                                size={18}
                                                style={{
                                                    color: "#F59E0B",
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {footerShow && (
                    <Link
                        href="#"
                        className="card-footer d-flex align-items-center justify-content-center fs-11 fw-semibold text-muted text-uppercase"
                    >
                        Updated 30 min ago
                    </Link>
                )}

                {btnFooter && (
                    <div className="card-footer">
                        <Link
                            href="#"
                            className="btn btn-primary w-100"
                        >
                            Generate Report
                        </Link>
                    </div>
                )}

                <CardLoader refreshKey={refreshKey} />
            </div>
        </div>
    );
};

export default WorkAniversaryOverview;
