import Image from "next/image";
import React, { Fragment, useEffect, useState } from "react";
import {
  FiActivity,
  FiBell,
  FiChevronRight,
  FiDollarSign,
  FiLogOut,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import UserDropdownSkeleton from "@/components/loaders/UserDropdownSkeletonHeader";
import Link from "next/link";

const activePosition = ["Active", "Always", "Bussy", "Inactive", "Disabled", "Cutomization"];
const subscriptionsList = [
  "Plan",
  "Billings",
  "Referrals",
  "Payments",
  "Statements",
  "Subscriptions",
];
const ProfileModal = () => {
  const { user, loading } = useUserStore();
  const router = useRouter();

  // useEffect(() => {
  //   fetchUser();
  // }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    // Redirect to login
    router.push("/authentication/login/minimal");
    router.refresh(); // clears cached data
  };

  // if (loading) {
  //   return <UserDropdownSkeleton />;
  // }

  return (
    <div className="dropdown nxl-h-item">
      <a href="#" data-bs-toggle="dropdown" role="button" data-bs-auto-close="outside">
        {loading ? (
          <div
            className="rounded-circle bg-secondary"
            style={{
              width: "40px",
              height: "40px",
              animation: "pulse 1.5s infinite",
            }}
          ></div>
        ) : (
          <img
            src={user?.profileImageUrl || "/images/avatar/1.png"}
            alt="user-image"
            className="img-fluid user-avtar me-0"
            style={{ width: "40px", height: "40px" }}
          />
        )}
      </a>
      <div className="dropdown-menu dropdown-menu-end nxl-h-dropdown nxl-user-dropdown">
        <div className="dropdown-header">
          <div className="d-flex align-items-center">
            <img
              src={
                loading ? "/images/avatar/1.png" : user?.profileImageUrl || "/images/avatar/1.png"
              }
              alt="user-image"
              className="img-fluid user-avtar"
              style={{ width: "40px", height: "40px" }}
            />
            <div>
              <h6 className="text-dark mb-0">
                {user?.fullName || "Alexandra Della"}
                <span className="badge bg-soft-success text-success ms-1">PRO</span>
              </h6>
              <span className="fs-12 fw-medium text-muted">
                {user?.email || "alex.della@outlook.com"}
              </span>
            </div>
          </div>
        </div>
        <div className="dropdown">
          <a href="#" className="dropdown-item" data-bs-toggle="dropdown">
            <span className="hstack">
              <i className="wd-10 ht-10 border border-2 border-gray-1 bg-success rounded-circle me-2"></i>
              <span>Active</span>
            </span>
            <i className="ms-auto me-0">
              <FiChevronRight />
            </i>
          </a>
          <div className="dropdown-menu user-active">
            {activePosition.map((item, index) => {
              return (
                <Fragment key={index}>
                  {index === activePosition.length - 1 && <div className="dropdown-divider"></div>}
                  <a href="#" className="dropdown-item">
                    <span className="hstack">
                      <i
                        className={`wd-10 ht-10 border border-2 border-gray-1 rounded-circle me-2 ${getColor(item)}`}
                      ></i>
                      <span>{item}</span>
                    </span>
                  </a>
                </Fragment>
              );
            })}
          </div>
        </div>
        <div className="dropdown-divider"></div>
        <div className="dropdown">
          <a href="#" className="dropdown-item" data-bs-toggle="dropdown">
            <span className="hstack">
              <i className=" me-2">
                <FiDollarSign />
              </i>
              <span>Subscriptions</span>
            </span>
            <i className="ms-auto me-0">
              <FiChevronRight />
            </i>
          </a>
          <div className="dropdown-menu">
            {subscriptionsList.map((item, index) => {
              return (
                <Fragment key={index}>
                  {index === activePosition.length - 1 && <div className="dropdown-divider"></div>}
                  <a href="#" className="dropdown-item">
                    <span className="hstack">
                      <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3"></i>
                      <span>{item}</span>
                    </span>
                  </a>
                </Fragment>
              );
            })}
          </div>
        </div>
        <div className="dropdown-divider"></div>
        <Link href="/customers/profile" className="dropdown-item">
          <i>
            <FiUser />
          </i>
          <span>Profile Details</span>
        </Link>
        <a href="#" className="dropdown-item">
          <i>
            <FiActivity />
          </i>
          <span>Activity Feed</span>
        </a>
        <a href="#" className="dropdown-item">
          <i>
            <FiDollarSign />
          </i>
          <span>Billing Details</span>
        </a>
        <Link href="/announcements/list" className="dropdown-item">
          <i>
            <FiBell />
          </i>
          <span>Notifications</span>
        </Link>
        <a href="#" className="dropdown-item">
          <i>
            <FiSettings />
          </i>
          <span>Account Settings</span>
        </a>
        <div className="dropdown-divider"></div>
        <button onClick={handleLogout} className="dropdown-item ">
          <i>
            {" "}
            <FiLogOut />
          </i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;

const getColor = (item) => {
  switch (item) {
    case "Always":
      return "always_clr";
    case "Bussy":
      return "bussy_clr";
    case "Inactive":
      return "inactive_clr";
    case "Disabled":
      return "disabled_clr";
    case "Cutomization":
      return "cutomization_clr";
    default:
      return "active-clr";
  }
};
