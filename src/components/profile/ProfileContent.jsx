"use client";

import React, { useEffect } from "react";
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

const ProfileContent = () => {
  const params = useParams();
  const employeeIdFromRoute = params?.employeeId;
  const profile = useProfileStore((state) => state.profile);
  const profileKey = useProfileStore((state) => state.profileKey);
  const profileLoading = useProfileStore((state) => state.profileLoading);
  const profileError = useProfileStore((state) => state.profileError);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const expectedProfileKey = employeeIdFromRoute
    ? `employee:${employeeIdFromRoute.trim()}`
    : "self";

  useEffect(() => {
    fetchProfile(employeeIdFromRoute || null).catch((error) => {
      console.error("Failed to load profile:", error);
    });
  }, [employeeIdFromRoute, fetchProfile]);

  const currentUser = profileKey === expectedProfileKey ? profile : null;
  const currentError = profileKey === expectedProfileKey ? profileError : "";
  const isLoading = profileLoading || (!currentUser && !currentError);

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
          <Profile user={currentUser} />
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
                <ComingSoonSection
                  image="/illustrations/coming-soon.png"
                  title="No Account Information"
                  description="Account details are not available for this profile yet."
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
                <ComingSoonSection
                  image="/illustrations/coming-soon.png"
                  title="No Leave Records"
                  description="Leave information will be available here when data is present."
                />
              </div>

              <TabConnections />
              <TabSecurity />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileContent;
