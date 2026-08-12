"use client";

import React, { useContext, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PerfectScrollbar from "react-perfect-scrollbar";
import { FiSunrise } from "react-icons/fi";

import Menus from "./Menus";
import SidebarSkeleton from "@/components/loaders/SidebarSkeleton";

import { NavigationContext } from "@/contentApi/navigationProvider";
import { useAuthStore } from "@/store/authStore";

const NavigationManu = () => {
  const { navigationOpen, setNavigationOpen } = useContext(NavigationContext);
  const pathName = usePathname();

  // Close mobile navigation on route change
  useEffect(() => {
    setNavigationOpen(false);
  }, [pathName, setNavigationOpen]);

  // Zustand selectors (better than destructuring)
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);

  return (
    <nav className={`nxl-navigation ${navigationOpen ? "mob-navigation-active" : ""}`}>
      <div className="navbar-wrapper">
        <div className="m-header">
          <Link href="/" className="b-brand">
            <Image
              width={190}
              height={50}
              src="/images/full-logo.png"
              alt="Logo"
              className="logo logo-lg"
            />

            <Image
              width={140}
              height={30}
              src="/images/logos.png"
              alt="Logo"
              className="logo logo-sm"
            />
          </Link>
        </div>

        <div className="navbar-content">
          <PerfectScrollbar>
            <ul className="nxl-navbar">
              <li className="nxl-item nxl-caption">
                <label>Navigation</label>
              </li>

              {!initialized ? <SidebarSkeleton /> : <Menus userRole={user?.role} />}
            </ul>

            <div className="card text-center">
              <div className="card-body py-3 px-3">
                <i className="fs-5 text-dark">
                  <FiSunrise />
                </i>

                <h6 className="mt-2 mb-1 text-dark fw-bold">
                  HRMS v1.0
                </h6>

                <p className="fs-12 mb-3 text-muted">
                  System is up to date
                </p>

                <Link href="#" className="btn btn-primary btn-sm w-100">
                  Check Updates
                </Link>
              </div>
            </div>

            {/* <div style={{ height: "18px" }} /> */}
          </PerfectScrollbar>
        </div>
      </div>

      <div
        onClick={() => setNavigationOpen(false)}
        className={navigationOpen ? "nxl-menu-overlay" : ""}
      />
    </nav>
  );
};

export default NavigationManu;
