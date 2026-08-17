"use client";
import React, { useState } from "react";
import SelectDropdown from "@/components/shared/SelectDropdown";
import { currencyOptionsData } from "@/utils/fackData/currencyOptionsData";
import { FiCamera, FiInfo } from "react-icons/fi";
import { BsCreditCardFill, BsPaypal } from "react-icons/bs";
import { useEffect } from "react";
import {
  FaCcAmex,
  FaCcDinersClub,
  FaCcDiscover,
  FaCcJcb,
  FaCcMastercard,
  FaCcVisa,
} from "react-icons/fa6";
import DatePicker from "react-datepicker";
import useDatePicker from "@/hooks/useDatePicker";
import useImageUpload from "@/hooks/useImageUpload";
import topTost from "@/utils/topTost";
// import { invoiceTempletOptions } from './InvoiceView'
import Dropdown from "@/components/shared/Dropdown";
import toast from "react-hot-toast";
import { leaveTypeOptions } from "@/utils/options";
import {
  User, Send, Loader2, Info, CalendarDays,
  MessageSquare,
  CheckCircle
} from "lucide-react";
import LeaveSidebar from "@/components/leaves/LeaveSidebar";
import { marketingCampaignChartOptions } from "@/utils/chartsLogic/marketingCampaignChartOptions";
import { useUserStore } from "@/store/useUserStore";
import { useLeaveStore } from "@/store/useLeaveStore";
import CardLoader from "@/components/shared/CardLoader";
import useCardTitleActions from "@/hooks/useCardTitleActions";


const previtems = [
  {
    id: 1,
    product: "",
    qty: 0,
    price: 0,
  },
];
const CreateLeaves = () => {
  const { fetchUser, user, loading: userLoading } = useUserStore();
  const { applyLeave, leaveActionLoading } = useLeaveStore();
  const { refreshKey } = useCardTitleActions();

  // ==========================
  // Leave Form State
  // ==========================
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [selectedLeaveType, setSelectedLeaveType] = useState(leaveTypeOptions[0]);

  // ==========================
  // Handle Input Change
  // ==========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================
  // Submit Leave Request
  // ==========================
  const handleClick = async () => {
    if (
      !formData.leaveType ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.reason.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.endDate < formData.startDate) {
      toast.error("End date cannot be before start date");
      return;
    }

    const success = await applyLeave(formData);

    if (success) {
      setFormData({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
      });

      setSelectedLeaveType(null);
    }
  };

  // ==========================
  // Cancel Form
  // ==========================
  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? All entered data will be lost.")) {
      setFormData({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
      });

      setSelectedLeaveType(null);

      toast.success("Form cleared successfully");
    }
  };

  // ==========================
  // Fetch Logged-in User
  // ==========================
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <div className="col-xl-8">
        <div className="card stretch stretch-full border-0">

          {/* =====================================================
        HEADER
    ====================================================== */}
          <div className="card-header d-flex align-items-center justify-content-between">
            <div>
              <h5 className="mb-1 fw-bold">Apply Leave</h5>
              <p className="fs-11 text-muted mb-0">
                Submit a leave request for approval
              </p>
            </div>

            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "rgba(52, 84, 209, 0.10)",
              }}
            >
              <CalendarDays size={19} className="text-primary" />
            </div>
          </div>

          <div className="card-body">

            {/* =====================================================
          EMPLOYEE PROFILE
      ====================================================== */}
            <div className="p-3 rounded-3 border border-dashed mb-4">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-4">

                {/* =====================================================
        EMPLOYEE
    ====================================================== */}
                <div className="d-flex align-items-center gap-3">

                  {/* Avatar */}
                  <div className="position-relative flex-shrink-0">
                    <div
                      className="avatar-image rounded-circle overflow-hidden"
                      style={{
                        width: "58px",
                        height: "58px",
                      }}
                    >
                      <img
                        src={
                          user?.profileImageUrl ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user?.fullName || "User"
                          )}&background=3454d1&color=fff&size=128`
                        }
                        alt={user?.fullName || "Employee"}
                        className="img-fluid"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>

                    {/* Online indicator */}
                    <span
                      className="position-absolute d-flex align-items-center justify-content-center rounded-circle bg-success border border-2 border-white"
                      style={{
                        width: "13px",
                        height: "13px",
                        right: "0px",
                        bottom: "1px",
                      }}
                    />
                  </div>

                  {/* Employee information */}
                  <div className="min-w-0">

                    {/* Name */}
                    <div className="d-flex align-items-center gap-2">
                      <h6 className="mb-0 fw-bold text-truncate">
                        {user?.fullName || "John Doe"}
                      </h6>

                      <span
                        className="badge rounded-pill bg-soft-primary text-primary"
                        style={{ fontSize: "9px" }}
                      >
                        Employee
                      </span>
                    </div>

                    {/* Designation */}
                    <div className="fs-11 text-muted mt-1">
                      {user?.designation?.name || "Developer"}
                    </div>

                    {/* Employee ID */}
                    <div className="d-flex align-items-center gap-2 mt-2">
                      <span className="d-inline-flex align-items-center gap-1 fs-10 text-muted">
                        <User size={11} />
                        {user?.employeeId || "ctsl_0001"}
                      </span>

                      <span className="text-muted fs-10">•</span>

                      <span className="fs-10 text-muted">
                        Leave Application
                      </span>
                    </div>

                  </div>
                </div>


                {/* =====================================================
        REQUEST STATUS
    ====================================================== */}
                <div className="d-flex align-items-center gap-3">

                  {/* Status icon */}
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle bg-soft-success"
                    style={{
                      width: "38px",
                      height: "38px",
                    }}
                  >
                    <CheckCircle
                      size={18}
                      className="text-success"
                    />
                  </div>

                  {/* Status text */}
                  <div>
                    <div className="fs-10 text-uppercase text-muted fw-semibold">
                      Request Status
                    </div>

                    <div className="d-flex align-items-center gap-2 mt-1">
                      <span
                        className="rounded-circle bg-success"
                        style={{
                          width: "7px",
                          height: "7px",
                        }}
                      />

                      <span className="fs-11 fw-semibold text-success">
                        Ready to Apply
                      </span>
                    </div>
                  </div>

                </div>

              </div>
            </div>


            {/* =====================================================
          LEAVE REQUEST
      ====================================================== */}
            {/* <div className="mb-3">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "30px",
                    height: "30px",
                    backgroundColor: "rgba(52, 84, 209, 0.10)",
                  }}
                >
                  <CalendarDays size={15} className="text-primary" />
                </div>

                <div>
                  <h6 className="mb-0 fw-semibold">
                    Leave Details
                  </h6>

                  <span className="fs-11 text-muted">
                    Select the dates and type of leave
                  </span>
                </div>
              </div>
            </div> */}


            {/* =====================================================
    DATE + LEAVE TYPE
====================================================== */}
            <div className="row g-3">

              {/* Start Date */}
              <div className="col-md-4">
                <label className="form-label fs-12 fw-semibold">
                  Start Date
                  <span className="text-danger ms-1">*</span>
                </label>

                <div className="position-relative">
                  <CalendarDays
                    size={15}
                    className="position-absolute text-muted"
                    style={{
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 2,
                    }}
                  />

                  <input
                    type="date"
                    name="startDate"
                    className="form-control rounded-3 ps-5"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* End Date */}
              <div className="col-md-4">
                <label className="form-label fs-12 fw-semibold">
                  End Date
                  <span className="text-danger ms-1">*</span>
                </label>

                <div className="position-relative">
                  <CalendarDays
                    size={15}
                    className="position-absolute text-muted"
                    style={{
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 2,
                    }}
                  />

                  <input
                    type="date"
                    name="endDate"
                    className="form-control rounded-3 ps-5"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Leave Type */}
              <div className="col-md-4">
                <div className="mb-4">
                  <label className="form-label">
                    Leave Type <span className="text-danger">*</span>
                  </label>

                  <SelectDropdown
                    options={leaveTypeOptions}
                    selectedOption={selectedLeaveType}
                    defaultSelect="Select Leave Type"
                    onSelectOption={(option) => {
                      setSelectedLeaveType(option);

                      setFormData((prev) => ({
                        ...prev,
                        leaveType: option.value,
                      }));
                    }}
                  />
                </div>
              </div>

            </div>


            {/* =====================================================
    REASON
====================================================== */}
            <div className="row g-3 mt-1">

              <div className="col-12">
                <label className="form-label fs-12 fw-semibold">
                  Reason
                  <span className="text-danger ms-1">*</span>
                </label>

                <div className="position-relative">
                  <MessageSquare
                    size={15}
                    className="position-absolute text-muted"
                    style={{
                      left: "14px",
                      top: "16px",
                      zIndex: 2,
                    }}
                  />

                  <input
                    type="text"
                    name="reason"
                    className="form-control rounded-3 ps-5"
                    placeholder="Briefly explain the reason for leave"
                    value={formData.reason}
                    onChange={handleChange}
                  />
                </div>
              </div>

            </div>


            {/* =====================================================
          REQUEST SUMMARY
      ====================================================== */}
            {/* {(formData.startDate ||
              formData.endDate ||
              selectedLeaveType) && (
                <div
                  className="mt-4 p-3 rounded-3"
                  style={{
                    backgroundColor: "rgba(52, 84, 209, 0.05)",
                    border: "1px solid rgba(52, 84, 209, 0.10)",
                  }}
                >
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Info size={15} className="text-primary" />

                    <span className="fs-12 fw-semibold">
                      Request Summary
                    </span>
                  </div>

                  <div className="row g-3">

                    {selectedLeaveType && (
                      <div className="col-md-4">
                        <div className="fs-10 text-muted">
                          Leave Type
                        </div>

                        <div className="fs-12 fw-semibold mt-1">
                          {selectedLeaveType.label ||
                            selectedLeaveType.value}
                        </div>
                      </div>
                    )}

                    {formData.startDate && (
                      <div className="col-md-4">
                        <div className="fs-10 text-muted">
                          Start Date
                        </div>

                        <div className="fs-12 fw-semibold mt-1">
                          {formData.startDate}
                        </div>
                      </div>
                    )}

                    {formData.endDate && (
                      <div className="col-md-4">
                        <div className="fs-10 text-muted">
                          End Date
                        </div>

                        <div className="fs-12 fw-semibold mt-1">
                          {formData.endDate}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )} */}


            {/* =====================================================
          ACTIONS
      ====================================================== */}
            <div className="d-flex justify-content-end align-items-center gap-2 mt-4 pt-3 border-top">

              <button
                type="button"
                className="btn btn-light"
                onClick={handleCancel}
                disabled={leaveActionLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-primary d-flex align-items-center justify-content-center gap-2 px-4"
                onClick={handleClick}
                disabled={leaveActionLoading}
                style={{
                  minWidth: "190px",
                  height: "40px",
                }}
              >
                {leaveActionLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm"></span>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Submit Leave Request</span>
                  </>
                )}
              </button>

            </div>

          </div>

          <CardLoader refreshKey={refreshKey} />
        </div>
      </div>

      <LeaveSidebar />
    </>
  );
};

export default CreateLeaves;
