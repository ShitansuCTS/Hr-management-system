"use client";
import React from "react";
import { useParams } from "next/navigation";
import TabOverviewContent from "@/components/customersView/TabOverviewContent";
import TabBillingContent from "@/components/customersView/TabBillingContent";
import TabActivityContent from "@/components/customersView/TabActivityContent";
import TabNotificationsContent from "@/components/customersView/TabNotificationsContent";
import TabConnections from "@/components/customersView/TabConnections";
import TabSecurity from "@/components/customersView/TabSecurity";
import Profile from "@/components/widgetsList/Profile";
import AccountInfo from "@/components/profile/AccountInfo";
import { useState, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import ProfileSkeleton from "@/components/loaders/ProfileSkeleton";
import ProfileTabsSkeleton from "@/components/loaders/ProfileTabsSkeleton";
import ComingSoonSection from "@/components/sharedUi/ComingSoonSection";

const ProfileContent = () => {
  const { user, loading, hasFetched, fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <>
      <div className="col-xxl-4 col-xl-6">
        {loading ? <ProfileSkeleton /> : <Profile user={user} />}
      </div>
      <div className="col-xxl-8 col-xl-6">
        {loading ? (
          <ProfileTabsSkeleton />
        ) : (
          <div className="card border-top-0">
            <div className="card-header p-0">
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
            <div className="tab-content">
              <TabOverviewContent user={user} />

              <div className="tab-pane fade" id="billingTab" role="tabpanel">
                <ComingSoonSection
                  image="/illustrations/coming-soon.png"
                  title="No Documents Available"
                  description="Employee documents have not been uploaded yet."
                />
              </div>

              <div className="tab-pane fade" id="notificationsTab" role="tabpanel">
                <ComingSoonSection
                  image="/illustrations/coming-soon.png"
                  title="No Documents Available"
                  description="Employee documents have not been uploaded yet."
                />
              </div>

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
                  title="No Connections"
                  description="No Payroll details are available at the moment."
                />
              </div>

              <div className="tab-pane fade" id="securityTab" role="tabpanel">
                <ComingSoonSection
                  image="/illustrations/coming-soon.png"
                  title="Security Information Unavailable"
                  description="Leaves and login history will be available in a future update."
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileContent;
