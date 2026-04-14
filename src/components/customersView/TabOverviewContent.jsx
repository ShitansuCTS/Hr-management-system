import React from "react";
import { FiAlertTriangle } from "react-icons/fi";
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
  return (
    <div className="tab-pane fade show active p-4" id="overviewTab" role="tabpanel">
      <div className="profile-details mb-5">
        <div className="mb-2 mt-4 d-flex align-items-center justify-content-between">
          <h5 className="fw-bold mb-0">Profile Details:</h5>
          <a href="#" className="btn btn-sm btn-light-brand">
            Edit Profile
          </a>
        </div>

        <div className="row g-2 mb-2">
          <div className="col-sm-6 text-muted">Full Name :</div>
          <div className="col-sm-6 fw-semibold">{user?.fullName || "-"}</div>
        </div>

        <div className="row g-2 mb-2">
          <div className="col-sm-6 text-muted">Employee ID :</div>
          <div className="col-sm-6 fw-semibold">{user?.employeeId || "-"}</div>
        </div>

        <div className="row g-2 mb-2">
          <div className="col-sm-6 text-muted">Email :</div>
          <div className="col-sm-6 fw-semibold">{user?.email || "-"}</div>
        </div>

        <div className="row g-2 mb-2">
          <div className="col-sm-6 text-muted">Phone :</div>
          <div className="col-sm-6 fw-semibold">{user?.phone || "-"}</div>
        </div>

        <div className="row g-2 mb-2">
          <div className="col-sm-6 text-muted">Gender :</div>
          <div className="col-sm-6 fw-semibold">{user?.gender || "-"}</div>
        </div>

        <div className="row g-2 mb-2">
          <div className="col-sm-6 text-muted">Date of Birth :</div>
          <div className="col-sm-6 fw-semibold">
            {" "}
            {user?.dateOfBirth
              ? new Date(user.dateOfBirth).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "-"}
          </div>
        </div>

        <div className="row g-2 mb-2">
          <div className="col-sm-6 text-muted">Designation</div>
          <div className="col-sm-6 fw-semibold">{user?.designation?.name || "-"}</div>
        </div>

        <div className="row g-2 mb-2">
          <div className="col-sm-6 text-muted">Department</div>
          <div className="col-sm-6 fw-semibold">{user?.department?.name || "-"}</div>
        </div>

        <div className="row g-2 mb-2">
          <div className="col-sm-6 text-muted">Employment Type</div>
          <div className="col-sm-6 fw-semibold">{user?.employmentType || "-"}</div>
        </div>

        <div className="row g-2 mb-2">
          <div className="col-sm-6 text-muted">Work Location</div>
          <div className="col-sm-6 fw-semibold">{user?.workLocation || "-"}</div>
        </div>

        <div className="row g-2 mb-2">
          <div className="col-sm-6 text-muted">Reporting Manager</div>
          <div className="col-sm-6 fw-semibold">{user?.reportingManagerName || "-"}</div>
        </div>

        {/* Address Information */}
        <div className="mb-2 mt-4 d-flex align-items-center justify-content-between">
          <h5 className="fw-bold mb-0">Address Details:</h5>
          {/* <a href="#" className="btn btn-sm btn-light-brand">
            Edit Profile
          </a> */}
        </div>

        <div className="row g-2 mb-2">
          <div className="col-sm-6 text-muted">Current Address</div>
          <div className="col-sm-6 fw-semibold">{user?.currentAddress || "-"}</div>
        </div>

        <div className="row g-2 mb-2">
          <div className="col-sm-6 text-muted">Permanent Address</div>
          <div className="col-sm-6 fw-semibold">{user?.permanentAddress || "-"}</div>
        </div>

        <div className="row g-2 mb-2">
          <div className="col-sm-6 text-muted">City</div>
          <div className="col-sm-6 fw-semibold">{user?.city || "-"}</div>
        </div>

        <div className="row g-2 mb-2">
          <div className="col-sm-6 text-muted">State</div>
          <div className="col-sm-6 fw-semibold">{user?.state || "-"}</div>
        </div>

        <div className="row g-2 mb-2">
          <div className="col-sm-6 text-muted">Country</div>
          <div className="col-sm-6 fw-semibold">{user?.country || "-"}</div>
        </div>

        {/* Emergency Contact */}
        <div className="mb-2 mt-4 d-flex align-items-center justify-content-between">
          <h5 className="fw-bold mb-0">Emergency Contact:</h5>
        </div>

        <div className="row g-2 mb-2">
          <div className="col-sm-6 text-muted">Contact Name</div>
          <div className="col-sm-6 fw-semibold">{user?.emergencyContactName || "-"}</div>
        </div>

        <div className="row g-2 mb-2">
          <div className="col-sm-6 text-muted">Contact Phone</div>
          <div className="col-sm-6 fw-semibold">{user?.emergencyContactPhone || "-"}</div>
        </div>

        <div className="row g-2 mb-2">
          <div className="col-sm-6 text-muted">Relation</div>
          <div className="col-sm-6 fw-semibold">{user?.emergencyContactRelation || "-"}</div>
        </div>

        {/* {informationData.map((item, index) => (
          <div
            key={index}
            className={`row g-0 ${index === informationData.length - 1 ? "mb-0" : "mb-4"}`}
          >
            <div className="col-sm-6 text-muted">{item.label}:</div>
            <div className="col-sm-6 fw-semibold">{item.value}</div>
          </div>
        ))} */}
      </div>
      {/* <div
        className="alert alert-dismissible mb-4 p-4 d-flex alert-soft-warning-message profile-overview-alert"
        role="alert"
      >
        <div className="me-4 d-none d-md-block">
          <FiAlertTriangle className="fs-1" />
        </div>
        <div>
          <p className="fw-bold mb-1 text-truncate-1-line">
            Your profile has not been updated yet!!!
          </p>
          <p className="fs-10 fw-medium text-uppercase text-truncate-1-line">
            Last Update: <strong>26 Dec, 2023</strong>
          </p>
          <a href="#" className="btn btn-sm bg-soft-warning text-warning d-inline-block">
            Update Now
          </a>
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" />
        </div>
      </div> */}
      {/* <div className="project-section">
        <div className="mb-4 d-flex align-items-center justify-content-between">
          <h5 className="fw-bold mb-0">Projects Details:</h5>
          <a href="#" className="btn btn-sm btn-light-brand">
            View Alls
          </a>
        </div>
        <div className="row">
          {projectsData.runningProjects
            .slice(0, 2)
            .map(
              ({
                id,
                progress,
                project_logo,
                project_category,
                project_name,
                status,
                team_members,
                progress_color,
                badge_color,
              }) => (
                <div key={id} className="col-xxl-6 col-xl-12 col-md-6">
                  <div className="border border-dashed border-gray-5 rounded mb-4 md-lg-0">
                    <div className="p-4">
                      <div className="d-sm-flex align-items-center">
                        <div className="wd-50 ht-50 p-2 bg-gray-200 rounded-2">
                          <img src={project_logo} className="img-fluid" alt="" />
                        </div>
                        <div className="ms-0 mt-4 ms-sm-3 mt-sm-0">
                          <a href="#" className="d-block">
                            {project_name}
                          </a>
                          <div className="fs-12 d-block text-muted">{project_category}</div>
                        </div>
                      </div>
                      <div className="my-4 text-muted text-truncate-2-line">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias dolorem
                        necessitatibus temporibus nemo commodi eaque dignissimos itaque unde hic,
                        sed rerum doloribus possimus minima nobis porro facilis voluptatum atque
                        asperiores perspiciatis saepe laboriosam rem cupiditate libero sit.
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="img-group lh-0 ms-3">
                          <ImageGroup data={team_members} avatarStyle={"bg-soft-primary"} />
                        </div>
                        <div className={`badge ${badge_color}`}>{status}</div>
                      </div>
                    </div>
                    <div className="px-4 py-3 border-top border-top-dashed border-gray-5 d-flex justify-content-between gap-2">
                      <div className="w-75 d-none d-md-block">
                        <small className="mb-1 fs-11 fw-medium text-uppercase text-muted d-flex align-items-center justify-content-between">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </small>
                        <HorizontalProgress progress={progress} barColor={progress_color} />
                      </div>
                      <span className="mx-2 text-gray-400 d-none d-md-block">|</span>
                      <a href="#" className="fs-12 fw-bold">
                        View →
                      </a>
                    </div>
                  </div>
                </div>
              )
            )}
        </div>
      </div> */}
    </div>
  );
};

export default TabOverviewContent;
