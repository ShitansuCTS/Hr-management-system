import Image from "next/image";
import React from "react";
import Link from "next/link";
import { BsPatchCheckFill } from "react-icons/bs";
import { FiEdit, FiMail, FiMapPin, FiPhone, FiTrash2 } from "react-icons/fi";

const Profile = ({ user }) => {
  return (
    <div className="card stretch stretch-full">
      <div className="card-body">
        <div className="mb-4 text-center">
          <div className="wd-150 ht-150 mx-auto mb-3 position-relative">
            <div className="avatar-image wd-150 ht-150 border border-5 border-gray-3">
              <img
                src={user?.profileImageUrl || "/images/avatar/1.png"}
                alt="img"
                width="140"
                height="140"
                className="img-fluid"
              />
            </div>
            <div
              className="wd-10 ht-10 text-success rounded-circle position-absolute translate-middle"
              style={{ top: "76%", right: "10px" }}
            >
              <BsPatchCheckFill size={16} />
            </div>
          </div>
          <div className="mb-4">
            <a href="#" className="fs-14 fw-bold d-block">
              {" "}
              {user?.fullName || " Alexandra Della"}
            </a>
            <a href="#" className="fs-12 fw-normal text-muted d-block">
              {user?.email || "alex.della@outlook.com"}
            </a>
          </div>
          <div className="fs-12 fw-normal text-muted text-center d-flex flex-wrap gap-3 mb-4">
            <div className="flex-fill py-3 px-4 rounded-1 d-none d-sm-block border border-dashed border-gray-5">
              <h6 className="fs-15 fw-bolder">{user?.employeeId || "123456"}</h6>
              <p className="fs-12 text-muted mb-0">Employee Id</p>
            </div>
            <div className="flex-fill py-3 px-4 rounded-1 d-none d-sm-block border border-dashed border-gray-5">
              <h6 className="fs-15 fw-bolder">{user?.status || "Active"}</h6>
              <p className="fs-12 text-muted mb-0">Status</p>
            </div>
            {/* <div className="flex-fill py-3 px-4 rounded-1 d-none d-sm-block border border-dashed border-gray-5">
              <h6 className="fs-15 fw-bolder">
                {user?.lastLoginAt
                  ? new Date(user.lastLoginAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "Never Logged In"}
              </h6>
              <p className="fs-12 text-muted mb-0">Last Login</p>
            </div> */}
          </div>
        </div>
        <ul className="list-unstyled mb-4">
          <li className="hstack justify-content-between mb-4">
            <span className="text-muted fw-medium hstack gap-3">
              <FiMapPin size={16} />
              Address
            </span>
            <a href="#" className="float-end">
              {user?.currentAddress || " Patia , Bhuabneswar , India"}
            </a>
          </li>
          <li className="hstack justify-content-between mb-4">
            <span className="text-muted fw-medium hstack gap-3">
              <FiPhone size={16} />
              Phone
            </span>
            <a href="#" className="float-end">
              {"+91 - " + user?.phone || " +91 9876543210"}
            </a>
          </li>
        </ul>
        <div className="d-flex justify-content-center pt-4">
          <Link href="/" className="btn btn-primary px-4 d-inline-flex align-items-center gap-2 ">
            <FiEdit size={16} />
            Edit your profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
