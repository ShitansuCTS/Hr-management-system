"use client";
import React, { memo, useEffect, useState } from "react";
import Dropdown from "@/components/shared/Dropdown";
import SelectDropdown from "@/components/shared/SelectDropdown";
import Select from "react-select";
import { customersTableData } from "@/utils/fackData/customersTableData";
import Link from "next/link";
import { FiPhone, FiUser } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import {
  FiMail,
  FiBriefcase,
  FiCheckCircle,
} from "react-icons/fi";
import { BsPatchCheckFill } from "react-icons/bs";
import "./style.css";
import Loaders from "@/components/loaders/AllemployeeCardsLoaders";
import { useAllUsersStore } from '@/store/useAllUserStore';
import toast from "react-hot-toast";

const CustomersTable = () => {

  // fetching the users from the stote
  const { users, loading, fetchUsers } = useAllUsersStore();


  useEffect(() => {
    fetchUsers();
  }, []);

  // fetching the users from the stote



  return (
    <>
      <div className="container">
        <div className="row g-4 justify-content-center">
          {/* 1️⃣ Loading state */}
          {loading && Array.from({ length: 8 }).map((_, index) => <Loaders key={index} />)}

          {/* 2️⃣ No users found */}
          {!loading && users.length === 0 && (
            <div className="col-12 text-center py-5">
              <h5 className="text-muted">No users found</h5>
              <p className="small text-secondary">
                There are no employees available for this organization.
              </p>
            </div>
          )}

          {/* 3️⃣ Users list */}
          {!loading &&
            users.length > 0 &&
            users.map((user) => (

              <div className="col-xl-3 col-lg-4 col-md-6 mb-4" key={user.id}>
                <div
                  className="card border-0  overflow-hidden h-100"
                  style={{
                    boxShadow: "0 8px 25px rgba(15,23,42,.08)",
                    transition: ".3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(37,99,235,.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 25px rgba(15,23,42,.08)";
                  }}
                >
                  {/* Header */}
                  <div
                    className="position-relative"
                    style={{
                      height: 70,
                      background:
                        "linear-gradient(135deg,#3B5BDB,#1D4ED8)",
                    }}
                  >
                  </div>

                  {/* Avatar */}
                  <div
                    className="text-center"
                    style={{ marginTop: "-36px", zIndex: "999" }}
                  >
                    <img
                      src={user.profileImageUrl || "https://i.pravatar.cc/150"}
                      alt={user.fullName}
                      width={100}
                      height={100}
                      className="rounded-circle border border-4 border-white"
                      style={{
                        objectFit: "cover",
                        boxShadow: "0 8px 20px rgba(0,0,0,.12)",
                      }}
                    />
                  </div>

                  <div className="card-body pt-3 pb-3 px-4">

                    {/* Name */}
                    <div className="text-center">
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        <h6 className="fw-bold mb-0 text-dark">
                          {user.fullName}
                        </h6>

                        <BsPatchCheckFill
                          color="#2563EB"
                          size={16}
                        />
                      </div>

                      <small className="text-primary fw-medium">
                        {user.designation?.name || "No Designation"}
                      </small>
                    </div>

                    <hr className="my-3" />

                    {/* Department */}
                    <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                      <FiBriefcase
                        size={15}
                        className="text-dark"
                        style={{ opacity: 0.8 }}
                      />

                      <small
                        className="text-truncate text-secondary"
                        style={{ maxWidth: "220px" }}
                      >
                        {user.department?.name || "No Department"}
                      </small>
                    </div>

                    {/* Email */}
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      <FiMail
                        size={15}
                        className="text-dark"
                        style={{ opacity: 0.8 }}
                      />

                      <small
                        className="text-truncate text-secondary"
                        style={{ maxWidth: "220px" }}
                      >
                        {user.email}
                      </small>
                    </div>

                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default CustomersTable;
