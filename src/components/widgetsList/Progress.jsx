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
import LeavesBalance from "../loaders/LeavesBalanceLoaders";

const Progress = ({ footerShow, title, btnFooter }) => {
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
        className={`card stretch stretch-full ${isExpanded ? "card-expand" : ""} ${refreshKey ? "card-loading" : ""}`}
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
            <div className="text-center text-muted py-4">No upcoming anniversaries 🎉</div>
          ) : (
            data.map((emp) => (
              <div
                key={emp.id}
                className="hstack justify-content-between border border-dashed rounded-3 p-3 team-card"
              >
                {/* LEFT */}
                <div className="hstack gap-3">
                  {emp.profileImageUrl ? (
                    <div className="avatar-image">
                      <img src={emp.profileImageUrl} alt="img" className="img-fluid" />
                    </div>
                  ) : (
                    <div className="text-white avatar-text user-avatar-text">
                      {emp.fullName?.charAt(0)}
                    </div>
                  )}

                  <div>
                    <Link href={`/employees/${emp.employeeId}`}>
                      {truncateText(emp.fullName, 15)}
                    </Link>

                    <div className="fs-11 text-muted">{emp.yearsCompleted} Years +</div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="text-center position-relative">
                  <FaAward size={30} className="text-primary" />

                  <div
                    style={{
                      position: "absolute",
                      top: "40%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontWeight: "bold",
                      fontSize: "14px",
                      color: "#283c50",
                    }}
                  >
                    {/* {emp.yearsCompleted} */}
                  </div>

                  {/* <div className="fw-semibold mt-1">
                    + Years
                  </div> */}
                </div>
              </div>
            ))
          )}
        </div>
        {footerShow ? (
          <Link href="#" className="card-footer fs-11 fw-bold text-uppercase text-center">
            Update 30 Min Ago
          </Link>
        ) : (
          ""
        )}
        {btnFooter && (
          <div className="card-footer">
            <Link href="#" className="btn btn-primary">
              Generate Report
            </Link>
          </div>
        )}
        <CardLoader refreshKey={refreshKey} />
      </div>
    </div>
  );
};

export default Progress;
