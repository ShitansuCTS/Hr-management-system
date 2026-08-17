"use client";

import React, { useEffect } from "react";
import {
    FiUsers,
    FiCheckCircle,
    FiBell,
    FiClock,
    FiTrendingDown,
    FiTrendingUp,
} from "react-icons/fi";

import { usehrdashboardStore } from "@/store/usehrdashboardStore";

const OrdersStatistics = () => {
    const { cardsinfo, fetchDashboard } = usehrdashboardStore();

    const data = cardsinfo || {};

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    const statisticsData = [
        {
            value: data.totalEmployees || 0,
            description: "Total Employees",
            footer: "Total Employees",
            icon: FiUsers,
            trend: "up",
            color: "primary",
        },
        {
            value: data.approvedLeavesThisMonth || 0,
            description: "Approved Leaves",
            footer: "This Month",
            icon: FiCheckCircle,
            trend: "up",
            color: "success",
        },
        {
            value: data.notificationsThisMonth || 0,
            description: "Notifications",
            footer: "This Month",
            icon: FiBell,
            trend: "up",
            color: "warning",
        },
        {
            value: data.pendingLeaves || 0,
            description: "Pending Leaves",
            footer: "Pending",
            icon: FiClock,
            trend: "down",
            color: "danger",
        },
    ];

    return (
        <>
            {statisticsData.map(
                (
                    {
                        value,
                        description,
                        footer,
                        icon: Icon,
                        trend,
                        color,
                    },
                    index
                ) => (
                    <div key={index} className="col-xxl-3 col-md-6">
                        <div
                            className="card stretch stretch-full"
                            style={{
                                boxShadow: "none",
                                overflow: "hidden",
                            }}
                        >
                            {/* Main content */}
                            <div className="card-body">
                                <div className="hstack justify-content-between">
                                    <div>
                                        <h4 className={`text-${color} mb-1`}>
                                            {value}
                                        </h4>

                                        <div className="text-muted">
                                            {description}
                                        </div>
                                    </div>

                                    {/* Metric Icon */}
                                    <div
                                        className={`d-flex align-items-center justify-content-center rounded-circle bg-${color}-subtle`}
                                        style={{
                                            width: "48px",
                                            height: "48px",
                                        }}
                                    >
                                        <Icon
                                            size={26}
                                            strokeWidth={1.8}
                                            className={`text-${color}`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className={`card-footer bg-${color} py-3`}>
                                <div className="hstack justify-content-between">
                                    <p className="text-white mb-0 fw-medium">
                                        {footer}
                                    </p>

                                    <div className="text-white">
                                        {trend === "up" ? (
                                            <FiTrendingUp
                                                size={18}
                                                strokeWidth={2}
                                            />
                                        ) : (
                                            <FiTrendingDown
                                                size={18}
                                                strokeWidth={2}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            )}
        </>
    );
};

export default OrdersStatistics;