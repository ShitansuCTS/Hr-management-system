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
import { useState, useEffect } from "react";
import PayrollSection from "../profile/PayrollSection";

const CustomerContent = () => {
  const { employeeId } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employeeId) return;

    const fetchUserDetails = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/users/users-profile/${employeeId.trim()}`, {
          method: "GET",
          credentials: "include", // important for cookies (auth_token)
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await res.json();

        // console.log("The user infor what we are getting is :", user);

        if (data.success) {
          setUser(data.user);
          console.log("Received user details:", data.user);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [employeeId]);

  return (
    <>
      <div className="col-xxl-4 col-xl-6">
        <Profile user={user} />
        {/* <CustomerSocalMedia />
        <CustomerSocalFlower /> */}
      </div>
      <div className="col-xxl-8 col-xl-6">
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
                  data-bs-target="#payrollTab"
                  role="tab"
                >
                  Payroll
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
          <div className="tab-content">
            <TabOverviewContent user={user} />
            <div className="tab-pane fade" id="billingTab" role="tabpanel">
              <TabBillingContent billingHistoryshow={true} user={user} />
            </div>
            <TabActivityContent />
            <TabNotificationsContent employeeId={user?.employeeId} />
            <TabConnections />
            <TabSecurity />
            <div className="tab-pane fade" id="payrollTab" role="tabpanel">
              <PayrollSection user={user} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerContent;
