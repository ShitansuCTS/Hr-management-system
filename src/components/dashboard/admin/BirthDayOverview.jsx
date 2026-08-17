
"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { FiMoreVertical, FiEye } from "react-icons/fi";
import CardHeader from "@/components/shared/CardHeader";
import Pagination from "@/components/shared/Pagination";
import { userList } from "@/utils/fackData/userList";
import CardLoader from "@/components/shared/CardLoader";
import useCardTitleActions from "@/hooks/useCardTitleActions";
import Image from "next/image";
import { usehrdashboardStore } from "@/store/usehrdashboardStore";
import { useRouter } from "next/navigation";
import "@/style/dashboard/admin/dashboard.css";
import HolidayTableSkeleton from "@/components/loaders/HolidayTableSkeleton";


const BirthDayOverview = ({ title }) => {
    const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } =
        useCardTitleActions();

    if (isRemoved) {
        return null;
    }


    const router = useRouter();


    const { birthdayinfo, fetchDashboard, loading } = usehrdashboardStore();

    const data = birthdayinfo || [];

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);



    // console.log("The birthday INFO ARE", data)

    return (
        <div className="col-xxl-8">
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

                <div className="card-body custom-card-action p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr className="border-b">
                                    <th scope="col">Employee</th>
                                    <th scope="col">Birthday</th>
                                    <th scope="col">Status</th>
                                    <th scope="col" className="text-end">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <HolidayTableSkeleton />
                                    </tr>
                                ) : data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="text-center py-5"
                                        >
                                            <div className="d-flex flex-column align-items-center">
                                                <div
                                                    className="d-flex align-items-center justify-content-center rounded-circle mb-3"
                                                    style={{
                                                        width: "48px",
                                                        height: "48px",
                                                        backgroundColor: "#f3f4f6",
                                                    }}
                                                >
                                                    🎂
                                                </div>

                                                <span className="fw-semibold text-dark">
                                                    No upcoming birthdays
                                                </span>

                                                <span className="fs-12 text-muted mt-1">
                                                    No birthdays are coming up soon.
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((emp) => {
                                        const isToday =
                                            emp.formattedDate === 0 ||
                                            emp.formattedDate === "Today 🎉";

                                        return (
                                            <tr
                                                key={emp.id}
                                                className={
                                                    isToday
                                                        ? "birthday-today-row"
                                                        : ""
                                                }
                                            >
                                                {/* Employee */}
                                                <td>
                                                    <div className="d-flex align-items-center gap-3">
                                                        {/* Avatar */}
                                                        <div
                                                            className="position-relative flex-shrink-0"
                                                            style={{
                                                                width: "42px",
                                                                height: "42px",
                                                            }}
                                                        >
                                                            <div className="avatar-image">
                                                                <img
                                                                    src={
                                                                        emp.profileImageUrl ||
                                                                        "https://duralux-next.vercel.app/_next/image?url=%2Fimages%2Favatar%2F1.png&w=96&q=75"
                                                                    }
                                                                    alt={
                                                                        emp.fullName ||
                                                                        "user-img"
                                                                    }
                                                                    className="img-fluid"
                                                                />
                                                            </div>

                                                            {/* Birthday indicator */}
                                                            {isToday && (
                                                                <span
                                                                    className="position-absolute d-flex align-items-center justify-content-center rounded-circle"
                                                                    style={{
                                                                        width: "19px",
                                                                        height: "19px",
                                                                        right: "-5px",
                                                                        bottom: "-3px",
                                                                        backgroundColor:
                                                                            "#fff",
                                                                        boxShadow:
                                                                            "0 2px 6px rgba(0,0,0,0.12)",
                                                                        fontSize:
                                                                            "11px",
                                                                    }}
                                                                >
                                                                    🎂
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Employee information */}
                                                        <div className="min-w-0">
                                                            <div className="d-flex align-items-center gap-2">
                                                                <span className="d-block fw-semibold text-dark text-truncate">
                                                                    {emp.fullName}
                                                                </span>

                                                                {isToday && (
                                                                    <span
                                                                        className="badge rounded-pill"
                                                                        style={{
                                                                            backgroundColor:
                                                                                "#FFF4E5",
                                                                            color: "#F59E0B",
                                                                            fontSize:
                                                                                "9px",
                                                                            fontWeight:
                                                                                600,
                                                                        }}
                                                                    >
                                                                        Birthday
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <span className="fs-12 text-muted">
                                                                {isToday
                                                                    ? "Wishing you a wonderful birthday!"
                                                                    : "Upcoming birthday"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Birthday */}
                                                <td>
                                                    {isToday ? (
                                                        <div className="d-flex align-items-center gap-2">
                                                            <span
                                                                className="d-flex align-items-center justify-content-center rounded-circle"
                                                                style={{
                                                                    width: "30px",
                                                                    height: "30px",
                                                                    backgroundColor:
                                                                        "#FFF4E5",
                                                                }}
                                                            >
                                                                🎉
                                                            </span>

                                                            <div>
                                                                <div className="fs-12 fw-semibold text-dark">
                                                                    Today
                                                                </div>

                                                                <div className="fs-10 text-muted">
                                                                    Celebrate today
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <span className="badge border border-dashed border-primary text-primary">
                                                                {emp.formattedDate}{" "}
                                                                days
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Status */}
                                                <td>
                                                    {isToday ? (
                                                        <span
                                                            className="badge rounded-pill d-inline-flex align-items-center gap-1"
                                                            style={{
                                                                backgroundColor:
                                                                    "#E8F8EF",
                                                                color: "#16A34A",
                                                            }}
                                                        >
                                                            <span
                                                                className="rounded-circle"
                                                                style={{
                                                                    width: "6px",
                                                                    height: "6px",
                                                                    backgroundColor:
                                                                        "#16A34A",
                                                                }}
                                                            />
                                                            Today
                                                        </span>
                                                    ) : (
                                                        <span
                                                            className="badge rounded-pill d-inline-flex align-items-center gap-1"
                                                            style={{
                                                                backgroundColor:
                                                                    "#EEF2FF",
                                                                color: "#4F46E5",
                                                            }}
                                                        >
                                                            <span
                                                                className="rounded-circle"
                                                                style={{
                                                                    width: "6px",
                                                                    height: "6px",
                                                                    backgroundColor:
                                                                        "#4F46E5",
                                                                }}
                                                            />
                                                            Upcoming
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Action */}
                                                <td className="text-end">
                                                    <Link
                                                        href={`/employees/${emp.employeeId}`}
                                                        className="avatar-text avatar-md"
                                                        title="View employee"
                                                    >
                                                        <FiEye size={15} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <CardLoader refreshKey={refreshKey} />
            </div>
        </div>
    );
};

export default BirthDayOverview;
