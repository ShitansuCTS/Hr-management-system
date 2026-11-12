"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TabOverviewContent from "@/components/customersView/TabOverviewContent";
import TabNotificationsContent from "@/components/customersView/TabNotificationsContent";
import TabActivityContent from "@/components/customersView/TabActivityContent";
import TabConnections from "@/components/customersView/TabConnections";
import TabSecurity from "@/components/customersView/TabSecurity";
import Profile from "@/components/widgetsList/Profile";
import { useProfileStore } from "@/store/profile.store";
import ProfileSkeleton from "@/components/loaders/ProfileSkeleton";
import ProfileTabsSkeleton from "@/components/loaders/ProfileTabsSkeleton";
import ComingSoonSection from "@/components/sharedUi/ComingSoonSection";
import EditEmployeeSidebar from "@/components/profile/EditEmployeeSidebar";
import { useAuthStore } from "@/store/authStore";
import AccountInfoContent from "../customersView/AccountInfoContent";
import LeaveBalanceContent from "../customersView/LeaveBalanceContent";

const ProfileContent = () => {
  const params = useParams();
  const employeeIdFromRoute = params?.employeeId;
  const [editSidebarOpen, setEditSidebarOpen] = useState(false);
  const isAdmin = useAuthStore((state) => state.user?.role === "ADMIN");
  const profile = useProfileStore((state) => state.profile);
  const profileKey = useProfileStore((state) => state.profileKey);
  const profileLoading = useProfileStore((state) => state.profileLoading);
  const profileError = useProfileStore((state) => state.profileError);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const fetchEmployeeLeaveStatus = useProfileStore(
    (state) => state.fetchEmployeeLeaveStatus
  );
  const leaveStatus = useProfileStore((state) => state.leaveStatus);
  const leaveStatusEmployeeId = useProfileStore(
    (state) => state.leaveStatusEmployeeId
  );
  const leaveStatusLoading = useProfileStore(
    (state) => state.leaveStatusLoading
  );
  const leaveStatusError = useProfileStore((state) => state.leaveStatusError);
  const expectedProfileKey = employeeIdFromRoute
    ? `employee:${employeeIdFromRoute.trim()}`
    : "self";

  useEffect(() => {
    let active = true;

    const loadProfileAndLeaveStatus = async () => {
      try {
        const loadedProfile = await fetchProfile(employeeIdFromRoute || null);
        if (active && loadedProfile?.employeeId) {
          await fetchEmployeeLeaveStatus(loadedProfile.employeeId);
        }
      } catch (error) {
        console.error("Failed to load profile or leave status:", error);
      }
    };

    loadProfileAndLeaveStatus();
    return () => {
      active = false;
    };
  }, [employeeIdFromRoute, fetchEmployeeLeaveStatus, fetchProfile]);

  const currentUser = profileKey === expectedProfileKey ? profile : null;
  const currentError = profileKey === expectedProfileKey ? profileError : "";
  const isLoading = profileLoading || (!currentUser && !currentError);
  const currentLeaveStatus =
    leaveStatusEmployeeId === currentUser?.employeeId ? leaveStatus : null;
  const currentLeaveStatusError =
    leaveStatusEmployeeId === currentUser?.employeeId ? leaveStatusError : "";
  const currentLeaveStatusLoading =
    Boolean(currentUser?.employeeId) &&
    (leaveStatusEmployeeId !== currentUser.employeeId || leaveStatusLoading);

  return (
    <>
      <div className="col-xxl-4 col-xl-6 employee-profile-sticky-column h-100">
        {isLoading ? (
          <ProfileSkeleton />
        ) : currentError ? (
          <div className="alert alert-danger" role="alert">
            {currentError}
          </div>
        ) : (
          <Profile
            user={currentUser}
            onEdit={employeeIdFromRoute && isAdmin ? () => setEditSidebarOpen(true) : undefined}
          />
        )}
      </div>

      <div className="col-xxl-8 col-xl-6 employee-profile-content-column h-100">
        {isLoading ? (
          <ProfileTabsSkeleton />
        ) : currentError ? (
          <div className="alert alert-danger" role="alert">
            {currentError}
          </div>
        ) : !currentUser ? (
          <div className="alert alert-warning" role="alert">
            Profile details are unavailable.
          </div>
        ) : (
          <div className="employee-profile-scroll-panel card border-top-0 h-100">
            <div className="card-header p-0 employee-profile-tabs-header">
              <ul
                className="nav nav-tabs flex-wrap w-100 text-center customers-nav-tabs"
                id="myTab"
                role="tablist"
              >
                <li className="nav-item flex-fill border-top" role="presentation">
                  <a
                    href="#"
                    className="nav-link active"
                    data-bs-toggle="tab"
                    data-bs-target="#overviewTab"
                    role="tab"
                  >
                    Overview
                  </a>
                </li>
                <li className="nav-item flex-fill border-top" role="presentation">
                  <a
                    href="#"
                    className="nav-link"
                    data-bs-toggle="tab"
                    data-bs-target="#billingTab"
                    role="tab"
                  >
                    Account Info
                  </a>
                </li>
                <li className="nav-item flex-fill border-top" role="presentation">
                  <a
                    href="#"
                    className="nav-link"
                    data-bs-toggle="tab"
                    data-bs-target="#notificationsTab"
                    role="tab"
                  >
                    Documents
                  </a>
                </li>
                <li className="nav-item flex-fill border-top" role="presentation">
                  <a
                    href="#"
                    className="nav-link"
                    data-bs-toggle="tab"
                    data-bs-target="#activityTab"
                    role="tab"
                  >
                    Activity
                  </a>
                </li>
                <li className="nav-item flex-fill border-top" role="presentation">
                  <a
                    href="#"
                    className="nav-link"
                    data-bs-toggle="tab"
                    data-bs-target="#connectionTab"
                    role="tab"
                  >
                    Payroll
                  </a>
                </li>
                <li className="nav-item flex-fill border-top" role="presentation">
                  <a
                    href="#"
                    className="nav-link"
                    data-bs-toggle="tab"
                    data-bs-target="#securityTab"
                    role="tab"
                  >
                    Leaves
                  </a>
                </li>
              </ul>
            </div>

            <div className="tab-content employee-profile-tab-body">
              <TabOverviewContent user={currentUser} />

              <div className="tab-pane fade" id="billingTab" role="tabpanel">
                <AccountInfoContent
                  financialDetails={currentUser.financialDetails}
                />
              </div>

              <TabNotificationsContent employeeId={currentUser?.employeeId} />

              <TabActivityContent employeeId={currentUser?.employeeId} />

              <div className="tab-pane fade" id="connectionTab" role="tabpanel">
                <ComingSoonSection
                  image="/illustrations/coming-soon.png"
                  title="No Payroll Details"
                  description="Payroll information is not available at the moment."
                />
              </div>

              <div className="tab-pane fade" id="securityTab" role="tabpanel">
        
                <LeaveBalanceContent
                  leaveBalances={currentLeaveStatus?.leaveBalances || []}
                  leaves={currentLeaveStatus?.leaves || []}
                  loading={currentLeaveStatusLoading}
                  error={currentLeaveStatusError}
                />
              </div>

              <TabConnections />
              <TabSecurity />
            </div>
          </div>
        )}
      </div>
      {editSidebarOpen && currentUser && employeeIdFromRoute && isAdmin && (
        <EditEmployeeSidebar
          user={currentUser}
          onClose={() => setEditSidebarOpen(false)}
          onSaved={() => setEditSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default ProfileContent;
