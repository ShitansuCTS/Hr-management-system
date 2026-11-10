"use client";
import React from "react";
import { useParams } from "next/navigation";
import CustomerSocalMedia from "./CustomerSocalMedia";
import TabOverviewContent from "./TabOverviewContent";
import TabBillingContent from "./TabBillingContent";
import TabActivityContent from "./TabActivityContent";
import TabNotificationsContent from "./TabNotificationsContent";
import TabConnections from "./TabConnections";
import TabSecurity from "./TabSecurity";
import Profile from "../widgetsList/Profile";
import CustomerSocalFlower from "./CustomerSocalFlower";
import { useEffect } from "react";
import ProfileSkeleton from "../loaders/ProfileSkeleton";
import ProfileTabsSkeleton from "../loaders/ProfileTabsSkeleton";
import { useProfileStore } from "@/store/profile.store";

const CustomerContent = () => {
  const { employeeId } = useParams();
  const user = useProfileStore((state) => state.profile);
  const profileKey = useProfileStore((state) => state.profileKey);
  const loading = useProfileStore((state) => state.profileLoading);
  const storeError = useProfileStore((state) => state.profileError);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const expectedProfileKey = `employee:${employeeId?.trim()}`;
  const currentUser = profileKey === expectedProfileKey ? user : null;
  const profileError = profileKey === expectedProfileKey ? storeError : "";
  const isLoading = loading || (!currentUser && !profileError);

  useEffect(() => {
    if (!employeeId) return;

    fetchProfile(employeeId).catch((error) => {
      console.error("Failed to load employee profile:", error);
    });
  }, [employeeId, fetchProfile]);

  return (
    <>
      <div className="col-xxl-4 col-xl-6 employee-profile-sticky-column h-100">
        {isLoading ? (
          <ProfileSkeleton />
        ) : profileError ? (
          <div className="alert alert-danger" role="alert">
            {profileError}
          </div>
        ) : (
          <Profile user={currentUser} />
        )}
      </div>
      <div className="col-xxl-8 col-xl-6 employee-profile-content-column h-100">
        {isLoading ? (
          <ProfileTabsSkeleton />
        ) : profileError ? (
          <div className="alert alert-danger" role="alert">
            {profileError}
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

                {/* <li className="nav-item flex-fill border-top" role="presentation">
                <a
                  href="#"
                  className="nav-link"
                  data-bs-toggle="tab"
                  data-bs-target="#connectionTab"
                  role="tab"
                >
                  Connection
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
                  Security
                </a>
              </li> */}
              </ul>
            </div>
            <div className="tab-content employee-profile-tab-body">
              <TabOverviewContent user={currentUser} />
              <div className="tab-pane fade" id="billingTab" role="tabpanel">
                <TabBillingContent billingHistoryshow={true} user={currentUser} />
              </div>
              <TabActivityContent employeeId={currentUser?.employeeId} />
              <TabNotificationsContent employeeId={currentUser?.employeeId} />
              <TabConnections />
              <TabSecurity />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomerContent;
