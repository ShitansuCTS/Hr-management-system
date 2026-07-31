import React from "react";
import {
  FiUser,
  FiCalendar,
  FiBriefcase,
  FiMapPin,
  FiUsers,
  FiLayers,
  FiPhone,
  FiHeart,
  FiDroplet,
  FiPhoneCall,
  FiUserCheck,
  FiHome,
} from "react-icons/fi";
import { projectsData } from "@/utils/fackData/projectsData";
import ImageGroup from "@/components/shared/ImageGroup";
import HorizontalProgress from "@/components/shared/HorizontalProgress";

const informationData = [
  { label: "Full Name", value: "Alexandra Della" },
  { label: "Surname", value: "Della" },
  { label: "Company", value: "Theme Ocean" },
  { label: "Date of Birth", value: "26 May, 2000" },
  { label: "Mobile Number", value: "+01 (375) 5896 3214" },
  { label: "Email Address", value: "alex.della@outlook.com" },
  { label: "Location", value: "California, United States" },
  { label: "Joining Date", value: "20 Dec, 2023" },
  { label: "Country", value: "United States" },
  { label: "Communication", value: "Email, Phone" },
  { label: "Allow Changes", value: "YES" },
  { label: "Website", value: "https://wrapbootstrap.com/user/theme_ocean" },
];
const TabOverviewContent = ({ user }) => {
  const formatValue = (value) => {
    if (!value) return "-";

    return value
      .toString()
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="tab-pane fade show active " id="overviewTab" role="tabpanel">
      <div className="row g-1">
        {/* ================= Left ================= */}
        <div className="col-lg-6">
          <div className="  h-100">
            <div className="card-body">
              <div className="d-flex align-items-center mb-4">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle bg-primary-subtle me-3"
                  style={{ width: "42px", height: "42px" }}
                >
                  <FiUser className="text-primary" size={22} />
                </div>

                <div>
                  <h5 className="fw-bold mb-0">Profile Information</h5>
                  <small className="text-muted">Basic employee details</small>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                <div className="d-flex align-items-center">
                  <FiUser className="text-muted me-3" size={16} />
                  <span className="text-muted">Gender</span>
                </div>
                <span
                  className="fw-semibold text-dark"
                  style={{
                    fontSize: "14px",
                    letterSpacing: ".2px",
                  }}
                >
                  {formatValue(user?.gender)}
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                <div className="d-flex align-items-center">
                  <FiCalendar className="text-muted me-3" size={16} />
                  <span className="text-muted">Date of Birth</span>
                </div>
                <span className="fw-semibold text-dark">
                  {user?.dateOfBirth
                    ? new Date(user.dateOfBirth).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "-"}
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                <div className="d-flex align-items-center">
                  <FiBriefcase className="text-muted me-3" size={16} />
                  <span className="text-muted">Designation</span>
                </div>

                <span className="fw-semibold text-dark fs-13">
                  {formatValue(user?.designation?.name)}
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                <div className="d-flex align-items-center">
                  <FiLayers className="text-muted me-3" size={16} />
                  <span className="text-muted">Department</span>
                </div>

                <span className="fw-semibold text-dark fs-13">
                  {formatValue(user?.department?.name)}
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                <div className="d-flex align-items-center">
                  <FiBriefcase className="text-muted me-3" size={16} />
                  <span className="text-muted">Employment Type</span>
                </div>

                <span className="fw-semibold text-dark fs-13">
                  {formatValue(user?.employmentType)}
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                <div className="d-flex align-items-center">
                  <FiMapPin className="text-muted me-3" size={16} />
                  <span className="text-muted">Work Location</span>
                </div>

                <span className="fw-semibold text-dark fs-13">
                  {formatValue(user?.workLocation)}
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-center pt-3">
                <div className="d-flex align-items-center">
                  <FiUsers className="text-muted me-3" size={16} />
                  <span className="text-muted">Reporting Manager</span>
                </div>

                <span className="fw-semibold text-dark fs-13">
                  {formatValue(user?.reportingManagerName)}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* ================= Right ================= */}
        <div className="col-lg-6">
          <div
            className="  h-100"
            style={{
              borderLeft: "1px dashed #d8dbe5", // adjust color to match border-gray-5
            }}
          >
            <div className="card-body">
              {/* Header */}
              <div className="d-flex align-items-center mb-4">
                <FiPhone className="text-warning me-2" size={20} />
                <div>
                  <h5 className="fw-bold mb-0">Emergency Contact</h5>
                  <small className="text-muted">Primary emergency contact</small>
                </div>
              </div>

              {/* Contact Name */}
              <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                <div className="d-flex align-items-center">
                  <FiUser className="text-muted me-3" size={16} />
                  <span className="text-muted">Father's Name</span>
                </div>

                <span className="fw-semibold text-dark fs-13">{formatValue(user?.fatherName)}</span>
              </div>
              {/* Contact Name */}
              <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                <div className="d-flex align-items-center">
                  <FiUsers className="text-muted me-3" size={16} />
                  <span className="text-muted">Mother's Name</span>
                </div>

                <span className="fw-semibold text-dark fs-13">{formatValue(user?.motherName)}</span>
              </div>
              {/* Contact Name */}
              <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                <div className="d-flex align-items-center">
                  <FiUserCheck className="text-muted me-3" size={16} />
                  <span className="text-muted">Emergency Contact</span>
                </div>

                <span className="fw-semibold text-dark fs-13">
                  {formatValue(user?.emergencyContactName)}
                </span>
              </div>

              {/* Phone */}
              <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                <div className="d-flex align-items-center">
                  <FiPhoneCall className="text-muted me-3" size={16} />
                  <span className="text-muted">Phone Number</span>
                </div>

                <span className="fw-semibold text-dark fs-13">
                  {user?.emergencyContactPhone || "-"}
                </span>
              </div>

              {/* Phone */}

              <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                <div className="d-flex align-items-center">
                  <FiHeart className="text-muted me-3" size={16} />
                  <span className="text-muted">Relationship</span>
                </div>

                <span className="fw-semibold text-dark fs-13">
                  {formatValue(user?.emergencyContactRelation)}
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                <div className="d-flex align-items-center">
                  <FiDroplet className="text-muted me-3" size={16} />
                  <span className="text-muted">Blood Group</span>
                </div>

                <span className="fw-semibold text-dark fs-13">{formatValue(user?.bloodGroup)}</span>
              </div>

              {/* Relationship */}
              <div className="d-flex justify-content-between align-items-center pt-3">
                <div className="d-flex align-items-center">
                  <FiHome className="text-muted me-3" size={16} />
                  <span className="text-muted">City</span>
                </div>

                <span className="fw-semibold text-dark fs-13">{formatValue(user?.city)}</span>
              </div>

              {/* Blood Group */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabOverviewContent;
