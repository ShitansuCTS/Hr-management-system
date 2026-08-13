"use client";

import React, { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";

import CardHeader from "@/components/shared/CardHeader";
import CardLoader from "@/components/shared/CardLoader";
import useCardTitleActions from "@/hooks/useCardTitleActions";
import { usehrdashboardStore } from "@/store/usehrdashboardStore";

const ReactApexChart = dynamic(
    () => import("react-apexcharts"),
    { ssr: false }
);

const DepartmentOverview = () => {
    const {
        refreshKey,
        isRemoved,
        isExpanded,
        handleRefresh,
        handleExpand,
        handleDelete,
    } = useCardTitleActions();

    const {
        charts,
        fetchDashboard,
        loading,
    } = usehrdashboardStore();

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    /*
     * Normalize department names
     */
    const normalizeDept = (name) => {
        if (!name) return "Unknown";

        const n = name.toLowerCase();

        if (n.includes("dev")) return "Development";
        if (n.includes("tech")) return "Technology";

        return name;
    };

    /*
     * Clean + merge departments
     */
    const cleanedDept = useMemo(() => {
        const departments = charts?.department || [];

        return departments.reduce((acc, item) => {
            const key = normalizeDept(item.name);

            const existing = acc.find(
                (d) => d.name === key
            );

            if (existing) {
                existing.value += Number(item.value) || 0;
            } else {
                acc.push({
                    name: key,
                    value: Number(item.value) || 0,
                });
            }

            return acc;
        }, []);
    }, [charts?.department]);

    /*
     * Theme-compatible colors
     *
     * Different color for every department
     */
    const colors = [
        "#4F46E5", // Indigo
        "#16A34A", // Green
        "#F59E0B", // Amber
        "#DC2626", // Red
        "#7C3AED", // Purple
        "#0891B2", // Cyan
        "#DB2777", // Pink
        "#475569", // Slate
    ];

    const departmentColors = cleanedDept.map(
        (_, index) =>
            colors[index % colors.length]
    );

    /*
     * Chart series
     */
    const series = [
        {
            name: "Employees",
            data: cleanedDept.map(
                (department) => department.value
            ),
        },
    ];

    /*
     * ApexChart options
     */
    const chartOptions = {
        chart: {
            toolbar: {
                show: false,
            },
            animations: {
                enabled: true,
            },
        },

        colors: departmentColors,

        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "18%",
                distributed: true,
                borderRadius: 6,
                borderRadiusApplication: "end",
            },
        },

        dataLabels: {
            enabled: true,

            formatter: function (val) {
                return val;
            },

            style: {
                fontSize: "11px",
                fontWeight: 600,
            },

            offsetY: -20,
        },

        stroke: {
            show: true,
            width: 2,
            colors: ["transparent"],
        },
        xaxis: {
            categories: cleanedDept.map(
                (department) => department.name
            ),

            labels: {
                show: true,
                rotate: -15,
                rotateAlways: false,
                hideOverlappingLabels: false,
                trim: false,

                style: {
                    fontSize: "11px",
                    fontWeight: 500,
                },
            },

            axisBorder: {
                show: false,
            },

            axisTicks: {
                show: false,
            },
        },

        yaxis: {
            min: 0,
            max: Math.max(...cleanedDept.map((d) => d.value), 1),
            tickAmount: Math.max(
                ...cleanedDept.map((d) => d.value),
                1
            ),

            labels: {
                formatter: function (val) {
                    return Math.round(val);
                },

                style: {
                    fontSize: "11px",
                },
            },
        },

        grid: {
            borderColor: "#e9ecef",
            strokeDashArray: 4,
            xaxis: {
                lines: {
                    show: false,
                },
            },
        },

        legend: {
            show: false,
        },

        tooltip: {
            y: {
                formatter: function (val) {
                    return `${val} Employees`;
                },
            },
        },
    };

    /*
     * Footer statistics
     */
    const totalEmployees = cleanedDept.reduce(
        (sum, department) =>
            sum + department.value,
        0
    );

    const maxDept = cleanedDept.reduce(
        (max, department) =>
            department.value > max.value
                ? department
                : max,
        {
            name: "-",
            value: 0,
        }
    );

    const averageEmployees = Math.round(
        totalEmployees /
        (cleanedDept.length || 1)
    );

    if (isRemoved) return null;

    return (
        <div className="col-xxl-8">
            <div
                className={`card stretch stretch-full ${isExpanded ? "card-expand" : ""
                    } ${refreshKey ? "card-loading" : ""
                    }`}
            >
                <CardHeader
                    title="Department Overview"
                    refresh={handleRefresh}
                    remove={handleDelete}
                    expanded={handleExpand}
                />

                <div className="card-body custom-card-action">

                    {loading ? (
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{ height: 350 }}
                        >
                            <div
                                className="spinner-border text-primary"
                                role="status"
                            />
                        </div>
                    ) : !cleanedDept.length ? (
                        <div
                            className="d-flex justify-content-center align-items-center text-muted"
                            style={{ height: 350 }}
                        >
                            No department data available
                        </div>
                    ) : (
                        <ReactApexChart
                            type="bar"
                            options={chartOptions}
                            series={series}
                            height={350}
                        />
                    )}

                </div>

                {/* Department Summary */}
                {!loading && cleanedDept.length > 0 && (
                    <div className="card-footer px-4 py-3">
                        <div className="d-flex align-items-center">

                            {/* Total Employees */}
                            <div className="flex-fill d-flex align-items-center gap-3">
                                <span
                                    className="rounded-circle flex-shrink-0"
                                    style={{
                                        width: "9px",
                                        height: "9px",
                                        backgroundColor: "#4F46E5",
                                    }}
                                />

                                <div className="d-flex align-items-center gap-2">
                                    <span className="fs-11 text-muted">
                                        Total Employees
                                    </span>

                                    <span className="fs-13 fw-bold text-dark">
                                        {totalEmployees}
                                    </span>
                                </div>
                            </div>

                            {/* Divider */}
                            <div
                                className="vr mx-4"
                                style={{
                                    height: "28px",
                                    opacity: 0.12,
                                }}
                            />

                            {/* Top Department */}
                            <div className="flex-fill d-flex align-items-center gap-3">
                                <span
                                    className="rounded-circle flex-shrink-0"
                                    style={{
                                        width: "9px",
                                        height: "9px",
                                        backgroundColor: "#16A34A",
                                    }}
                                />

                                <div className="d-flex align-items-center gap-2">
                                    <span className="fs-11 text-muted">
                                        Top Department
                                    </span>

                                    <span
                                        className="fs-13 fw-semibold text-dark text-truncate"
                                        style={{ maxWidth: "150px" }}
                                    >
                                        {maxDept.name}
                                    </span>

                                    <span className="fs-11 text-muted">
                                        ({maxDept.value})
                                    </span>
                                </div>
                            </div>

                            {/* Divider */}
                            <div
                                className="vr mx-4"
                                style={{
                                    height: "28px",
                                    opacity: 0.12,
                                }}
                            />

                            {/* Average */}
                            <div className="flex-fill d-flex align-items-center gap-3">
                                <span
                                    className="rounded-circle flex-shrink-0"
                                    style={{
                                        width: "9px",
                                        height: "9px",
                                        backgroundColor: "#F59E0B",
                                    }}
                                />

                                <div className="d-flex align-items-center gap-2">
                                    <span className="fs-11 text-muted">
                                        Avg / Department
                                    </span>

                                    <span className="fs-13 fw-bold text-dark">
                                        {averageEmployees}
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                <CardLoader refreshKey={refreshKey} />
            </div>
        </div>
    );
};

export default DepartmentOverview;