"use client";
import React, { useState, useEffect } from "react";
import PageHeaderSetting from "@/components/shared/pageHeader/PageHeaderSetting";
import Footer from "@/components/shared/Footer";
import TextAreaTopLabel from "@/components/shared/TextAreaTopLabel";
import { FiCamera } from "react-icons/fi";
import useImageUpload from "@/hooks/useImageUpload";
import PerfectScrollbar from "react-perfect-scrollbar";
import InputTopLabel from "@/components/shared/InputTopLabel";
import ProfileDetailsSkeleton from "@/components/loaders/ProfileLoader";
import { useProfileStore } from "@/store/profile.store";


const ProfileInfo = () => {
  const profile = useProfileStore((state) => state.profile);
  const profileKey = useProfileStore((state) => state.profileKey);
  const loading = useProfileStore((state) => state.profileLoading);
  const storeError = useProfileStore((state) => state.profileError);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const user = profileKey === "self" ? profile : null;
  const profileError = profileKey === "self" ? storeError : "";
  const isLoading = loading || (!user && !profileError);


  // helper function
  const getEmployeeStatus = (dateOfJoining) => {
    if (!dateOfJoining) {
      return {
        label: "—",
        className: "bg-soft-secondary text-secondary",
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const doj = new Date(dateOfJoining);
    doj.setHours(0, 0, 0, 0);

    if (doj.getTime() === today.getTime()) {
      return {
        label: "Joined Today",
        className: "bg-soft-success text-success",
      };
    }

    if (doj > today) {
      return {
        label: "Joining Soon",
        className: "bg-soft-primary text-primary",
      };
    }

    return {
      label: "Active",
      className: "bg-soft-info text-info",
    };
  };


  useEffect(() => {
    fetchProfile().catch((error) => {
      console.error("Failed to load profile details:", error);
    });
  }, [fetchProfile]);

  // helper function


  return (
    <div className="content-area">
      <PerfectScrollbar>
        <PageHeaderSetting />
        {isLoading ? (
          <ProfileDetailsSkeleton />
        ) : profileError ? (
          <div className="alert alert-danger" role="alert">
            {profileError}
          </div>
        ) : (
          <div className="content-area-body">
            <div className="card mb-0">
              <div className="card-body">
                <div className="mb-5 d-flex align-items-center gap-4">
                  {/* Profile Image */}
                  <label
                    htmlFor="img"
                    className="wd-100 ht-100 position-relative overflow-hidden border border-gray-2 rounded"
                  >
                    <img
                      src={user?.profileImageUrl || "/images/logo-abbr.png"}
                      className="upload-pic img-fluid rounded h-100 w-100"
                      alt="profile"
                    />
                  </label>

                  {/* Name & Employee ID */}
                  <div>
                    <h4 className="fw-bold mb-1 text-dark">
                      {user?.fullName || "—"}
                      {/* Shitansu kumar Gochhayat */}
                    </h4>
                    {/* <span className="text-muted fs-14">
                                        <strong>{user?.employeeId || "—"}</strong>
                                    </span> */}
                    {(() => {
                      const status = getEmployeeStatus(user?.dateOfJoining);
                      return (
                        <span className={`badge ${status.className}`}>
                          {user?.employeeId || "—"}
                        </span>
                      );
                    })()}
                  </div>
                </div>

                <div className="tab-pane fade show active" id="profileTab" role="tabpanel">
                  <hr />
                  <div className=" general-info">
                    {/* Header */}
                    <div className="mb-4 d-flex align-items-center justify-content-between border-bottom pb-3">
                      <div>
                        <h5 className="fw-bold mb-1 text-dark">General Information :</h5>
                        <span className="fs-12 text-muted">
                          Employee personal & professional details
                        </span>
                      </div>
                      <a href="#" className="btn btn-sm btn-light-brand">
                        Edit Profile
                      </a>
                    </div>

                    {/* Professional Information */}
                    <h6 className="fw-semibold text-primary mb-3">Professional Details</h6>

                    <div className="row mb-3">
                      <div className="col-lg-3 fw-semibold text-muted">Designation :</div>
                      <div className="col-lg-9">{user?.designation || "—"}</div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-lg-3 fw-semibold text-muted">Department :</div>
                      <div className="col-lg-9">{user?.department || "—"}</div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-lg-3 fw-semibold text-muted">Employment Type :</div>
                      <div className="col-lg-9">
                        <span className="badge bg-soft-primary text-primary">
                          {user?.employmentType?.replaceAll("_", " ") || "—"}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-lg-3 fw-semibold text-muted">Work Location :</div>
                      <div className="col-lg-9">{user?.workLocation || "—"}</div>
                    </div>

                    <hr />

                    {/* Contact Information */}
                    <h6 className="fw-semibold text-primary mb-3">Contact Details</h6>

                    <div className="row mb-3">
                      <div className="col-lg-3 fw-semibold text-muted">Email :</div>
                      <div className="col-lg-9">{user?.email || "—"}</div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-lg-3 fw-semibold text-muted">Phone :</div>
                      <div className="col-lg-9">{user?.phone || "—"}</div>
                    </div>

                    <hr />

                    {/* Personal Information */}
                    <h6 className="fw-semibold text-primary mb-3">Personal Details</h6>

                    <div className="row mb-3">
                      <div className="col-lg-3 fw-semibold text-muted">Gender :</div>
                      <div className="col-lg-9">{user?.gender || "—"}</div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-lg-3 fw-semibold text-muted">Father’s Name :</div>
                      <div className="col-lg-9">{user?.fatherName || "—"}</div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-lg-3 fw-semibold text-muted">Mother’s Name :</div>
                      <div className="col-lg-9">{user?.motherName || "—"}</div>
                    </div>

                    <hr />

                    {/* Address */}
                    <h6 className="fw-semibold text-primary mb-3">Address</h6>

                    <div className="row mb-3">
                      <div className="col-lg-3 fw-semibold text-muted">Current Address :</div>
                      <div className="col-lg-9">{user?.currentAddress || "—"}</div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-lg-3 fw-semibold text-muted">Permanent Address :</div>
                      <div className="col-lg-9">{user?.permanentAddress || "—"}</div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-lg-3 fw-semibold text-muted">City / State :</div>
                      <div className="col-lg-9">
                        {user?.city || "—"}, {user?.state || "—"}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-lg-3 fw-semibold text-muted">Country / Pincode :</div>
                      <div className="col-lg-9">
                        {user?.country || "—"} - {user?.pincode || "—"}
                      </div>
                    </div>

                    <hr />

                    {/* Emergency */}
                    <h6 className="fw-semibold text-primary mb-3">Emergency Contact</h6>

                    <div className="row mb-3">
                      <div className="col-lg-3 fw-semibold text-muted">Contact Person :</div>
                      <div className="col-lg-9">
                        {user?.emergencyContactName || "—"} ({user?.emergencyContactRelation || "—"}
                        )
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-lg-3 fw-semibold text-muted">Contact Phone :</div>
                      <div className="col-lg-9">{user?.emergencyContactPhone || "—"}</div>
                    </div>

                    <hr />

                    {/* Organization */}
                    <h6 className="fw-semibold text-primary mb-3">Organization</h6>

                    <div className="row">
                      <div className="col-lg-3 fw-semibold text-muted">Organization Name :</div>
                      <div className="col-lg-9">
                        <strong>{user?.organization?.name || "—"}</strong>
                        <div className="fs-12 text-muted">{user?.organization?.domain}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <Footer />
      </PerfectScrollbar>
    </div>
  );
};

export default ProfileInfo;
