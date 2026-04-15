'use client';
import React, { useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { crmStatisticsData } from "@/utils/fackData/crmStatisticsData";
import getIcon from "@/utils/getIcon";
import Link from "next/link";
import { usehrdashboardStore } from "@/store/usehrdashboardStore";

const SiteOverviewStatistics = () => {
  const { cardsinfo, fetchDashboard } = usehrdashboardStore();

  const data = cardsinfo || {};


  // useEffect(() => {
  //   fetchDashboard();
  // }, []);

  // const employeesData = employees || {};
  // const leavesData = leaves || {};
  // const attendanceData = attendance || {};

  // console.log(" The employeesData : ", employeesData,);
  // console.log(" The LeaveData : ", leavesData);
  // console.log(" The AttandanceData : ", attendanceData);

  const totalLeaves =
    (data.approvedLeavesThisMonth || 0) +
    (data.pendingLeaves || 0);

  const approvedPercent = totalLeaves
    ? Math.round((data.approvedLeavesThisMonth / totalLeaves) * 100)
    : 0;

  const pendingPercent = totalLeaves
    ? Math.round((data.pendingLeaves / totalLeaves) * 100)
    : 0;

  const statsData = [
    {
      id: 1,
      title: "Total Employees",
      total_number: data.totalEmployees || 0,
      progress: "100%",
      progress_info: "Total ",
      icon: "feather-users",
    },
    {
      id: 2,
      title: "Approved Leaves (Month)",
      total_number: data.approvedLeavesThisMonth || 0,
      progress: `${approvedPercent}%`,
      progress_info: "Approved",
      icon: "feather-check-circle",
    },
    {
      id: 3,
      title: "Notifications (Month)",
      total_number: data.notificationsThisMonth || 0,
      progress: "100%",
      progress_info: " This Month",
      icon: "feather-bell",
    },
    {
      id: 4,
      title: "Pending Leaves",
      total_number: data.pendingLeaves || 0,
      progress: `${pendingPercent}%`,
      progress_info: "Pending",
      icon: "feather-clock",
    },
  ];

  return (
    <>
      {statsData.map(
        ({ id, completed_number, progress, progress_info, title, total_number, icon }) => (
          <div key={id} className="col-xxl-3 col-md-6">
            <div className="card stretch stretch-full short-info-card">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between mb-4">
                  <div className="d-flex gap-4 align-items-center">
                    <div className="avatar-text avatar-lg bg-gray-200 icon">
                      {React.cloneElement(getIcon(icon), { size: "16" })}
                    </div>
                    <div>
                      <div className="fs-4 fw-bold text-dark">
                        <span className="counter">
                          {completed_number ? completed_number + "/" : ""}
                        </span>
                        <span className="counter">{total_number}</span>
                      </div>
                      <h3 className="fs-13 fw-semibold text-truncate-1-line">{title}</h3>
                    </div>
                  </div>
                  <Link href="#" className="lh-1">
                    <FiMoreVertical className="fs-16" />
                  </Link>
                </div>
                <div className="pt-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <Link href="#" className="fs-12 fw-medium text-muted text-truncate-1-line">
                      {title}
                    </Link>
                    <div className="w-100 text-end">
                      <span className="fs-12 text-dark">{progress_info}</span>{" "}
                      <span className="fs-11 text-muted">({progress})</span>
                    </div>
                  </div>
                  <div className="progress mt-2 ht-3">
                    <div
                      className={`progress-bar progress-${id}`}
                      role="progressbar"
                      style={{ width: progress }}
                    ></div>
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

export default SiteOverviewStatistics;
