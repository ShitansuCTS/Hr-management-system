"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TabOverviewContent from "@/components/customersView/TabOverviewContent";
import TabNotificationsContent from "@/components/customersView/TabNotificationsContent";
import TabConnections from "@/components/customersView/TabConnections";
import TabSecurity from "@/components/customersView/TabSecurity";
import Profile from "@/components/widgetsList/Profile";
import { useUserStore } from "@/store/useUserStore";
import ProfileSkeleton from "@/components/loaders/ProfileSkeleton";
import ProfileTabsSkeleton from "@/components/loaders/ProfileTabsSkeleton";
import ComingSoonSection from "@/components/sharedUi/ComingSoonSection";

const ProfileContent = () => {
  const params = useParams();
  const employeeIdFromRoute = params?.employeeId;
  const { user: loggedInUser, loading: userLoading, fetchUser } = useUserStore();

  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (employeeIdFromRoute) {
        try {
          setLoading(true);
          const res = await fetch(`/api/users/users-profile/${employeeIdFromRoute.trim()}`, {
            method: "GET",
            credentials: "include",
          });

          if (!res.ok) {
            throw new Error("Failed to fetch employee profile");
          }

          const data = await res.json();
          setTargetUser(data?.user || null);
        } catch (error) {
          console.error("Error fetching employee profile:", error);
          setTargetUser(null);
        } finally {
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const userFromServer = await fetchUser();
        setTargetUser(userFromServer || loggedInUser || null);
      } catch (error) {
        setTargetUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [employeeIdFromRoute, fetchUser, loggedInUser]);

  const currentUser = employeeIdFromRoute ? targetUser : loggedInUser || targetUser;
  const isLoading = employeeIdFromRoute ? loading : userLoading || loading;

  return (
    <>
      <div className="col-xxl-4 col-xl-6 employee-profile-sticky-column h-100">
        {isLoading ? <ProfileSkeleton /> : <Profile user={currentUser} />}
      </div>

      <div className="col-xxl-8 col-xl-6 employee-profile-content-column h-100">
        {isLoading ? (
          <ProfileTabsSkeleton />
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

              <div className="tab-pane fade" id="activityTab" role="tabpanel">
                <ComingSoonSection
                  image="/illustrations/coming-soon.png"
                  title="No Activity Found"
                  description="Recent employee activities will appear here."
                />
              </div>

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
