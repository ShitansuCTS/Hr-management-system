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
import HolidayTableSkeleton from "../loaders/HolidayTableSkeleton";


const LatestLeads = ({ title }) => {
  const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } =
    useCardTitleActions();

  if (isRemoved) {
    return null;
  }


  const router = useRouter();


  const { birthdayinfo, fetchDashboard, loading } = usehrdashboardStore();

  const data = birthdayinfo || [];

  // useEffect(() => {
  //   fetchDashboard();
  // }, []);



  console.log("The birthday INFO ARE", data)

  return (
    <div className="col-xxl-8">
      <div
        className={`card stretch stretch-full ${isExpanded ? "card-expand" : ""} ${refreshKey ? "card-loading" : ""}`}
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
                  <th scope="row">Users</th>
                  {/* <th>Proposal</th> */}
                  <th>Date</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody> {loading ? (
                <tr>
                  <HolidayTableSkeleton />
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No upcoming birthdays 🎉
                  </td>
                </tr>
              ) : (
                data.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">

                        {/* Profile Image */}
                        {emp.profileImageUrl ? (
                          <div className="avatar-image">
                            <img
                              src={emp.profileImageUrl}
                              alt="user-img"
                              className="img-fluid"
                            />
                          </div>
                        ) : (
                          <div className="text-white avatar-text user-avatar-text">
                            {emp.fullName?.charAt(0)}
                          </div>
                        )}

                        {/* Name */}
                        <div>
                          <span className="d-block">{emp.fullName}</span>
                          <span className="fs-12 text-muted">
                            Birthday
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Replace Proposal column */}
                    {/* <td>
                        <span className="badge bg-gray-200 text-dark">
                          🎂 Birthday
                        </span>
                      </td> */}

                    {/* Days Left */}
                    <td>
                      <span className="badge border border-dashed text-primary border-primary">
                        {emp.formattedDate === 0
                          ? "Today 🎉"
                          : `${emp.formattedDate} days`}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${emp.formattedDate === "Today 🎉"
                          ? "bg-success"
                          : "bg-warning text-white"
                          }`}
                      >
                        {emp.formattedDate === "Today 🎉" ? "Today 🎉" : "Upcoming"}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="text-end">
                      <Link href={`/employees/${emp.employeeId}`}>
                        <FiEye size={16} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer">
          <Pagination />
        </div>
        <CardLoader refreshKey={refreshKey} />
      </div>
    </div>
  );
};

export default LatestLeads;
