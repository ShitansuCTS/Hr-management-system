"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FiBriefcase, FiCreditCard, FiUser, FiX } from "react-icons/fi";
import { useProfileStore } from "@/store/profile.store";

const EMPTY_FORM = {
  email: "",
  fullName: "",
  phone: "",
  status: "ACTIVE",
  employmentType: "",
  workLocation: "",
  dateOfJoining: "",
  gender: "",
  dateOfBirth: "",
  fatherName: "",
  motherName: "",
  spouseName: "",
  bloodGroup: "",
  currentAddress: "",
  permanentAddress: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactRelation: "",
  reportingManagerName: "",
  departmentId: "",
  designationId: "",
  financialDetails: {
    bankName: "",
    accountNo: "",
    ifscCode: "",
    panNumber: "",
    uanNo: "",
    esicNo: "",
  },
};

const dateInputValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

function createFormValues(user) {
  return {
    ...EMPTY_FORM,
    ...Object.fromEntries(
      Object.keys(EMPTY_FORM)
        .filter((key) => key !== "financialDetails")
        .map((key) => {
          const value = user?.[key];
          return [
            key,
            key === "dateOfJoining" || key === "dateOfBirth"
              ? dateInputValue(value)
              : (value ?? ""),
          ];
        })
    ),
    financialDetails: {
      ...EMPTY_FORM.financialDetails,
      ...user?.financialDetails,
    },
  };
}

const TextField = ({ label, name, value, onChange, type = "text", required }) => (
  <div className="col-md-6">
    <label className="form-label fw-medium" htmlFor={`employee-edit-${name}`}>
      {label}
      {required && <span className="text-danger ms-1">*</span>}
    </label>
    <input
      id={`employee-edit-${name}`}
      className="form-control"
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
);

const SelectField = ({ label, name, value, options, onChange, required }) => (
  <div className="col-md-6">
    <label className="form-label fw-medium" htmlFor={`employee-edit-${name}`}>
      {label}
      {required && <span className="text-danger ms-1">*</span>}
    </label>
    <select
      id={`employee-edit-${name}`}
      className="form-select"
      name={name}
      value={value}
      onChange={onChange}
      required={required}
    >
      {!required && <option value="">Not specified</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const SectionHeading = ({ icon: Icon, title, description }) => (
  <div className="d-flex align-items-center gap-3 mb-4">
    <span
      className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary"
      style={{ width: 42, height: 42 }}
    >
      <Icon size={20} />
    </span>
    <div>
      <h6 className="fw-bold mb-1">{title}</h6>
      <small className="text-muted">{description}</small>
    </div>
  </div>
);

const EditEmployeeSidebar = ({ user, onClose, onSaved }) => {
  const [form, setForm] = useState(() => createFormValues(user));
  const updateEmployeeProfile = useProfileStore((store) => store.updateEmployeeProfile);
  const saving = useProfileStore((store) => store.profileUpdateLoading);
  const departments = useProfileStore((store) => store.employeeEditDepartments);
  const designations = useProfileStore((store) => store.employeeEditDesignations);
  const optionsLoading = useProfileStore((store) => store.employeeEditOptionsLoading);
  const optionsError = useProfileStore((store) => store.employeeEditOptionsError);
  const fetchEmployeeEditOptions = useProfileStore((store) => store.fetchEmployeeEditOptions);

  useEffect(() => {
    setForm(createFormValues(user));
  }, [user]);

  useEffect(() => {
    fetchEmployeeEditOptions().catch((error) => {
      console.error("Failed to load employee edit options:", error);
    });
  }, [fetchEmployeeEditOptions]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !saving) onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, saving]);

  const availableDesignations = useMemo(
    () => designations.filter((designation) => designation.departmentId === form.departmentId),
    [designations, form.departmentId]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => {
      const next = { ...current, [name]: value };
      if (name === "departmentId" && current.departmentId !== value) {
        next.designationId = "";
      }
      return next;
    });
  };

  const handleFinancialChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      financialDetails: {
        ...current.financialDetails,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updates = {
      ...form,
      employmentType: form.employmentType || null,
      gender: form.gender || null,
      dateOfBirth: form.dateOfBirth || null,
      departmentId: form.departmentId || null,
      designationId: form.designationId || null,
      financialDetails: Object.fromEntries(
        Object.entries(form.financialDetails).map(([key, value]) => [key, value || null])
      ),
    };

    try {
      await updateEmployeeProfile(user.employeeId, updates);
      onSaved();
    } catch {
      // The profile store reports API failures through the shared toast system.
    }
  };

  return (
    <>
      <button
        type="button"
        className="sidebar-overlay"
        onClick={() => !saving && onClose()}
        aria-label="Close employee editor"
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          padding: 0,
          border: 0,
          background: "rgba(15, 23, 42, 0.35)",
          zIndex: 1100,
        }}
      />
      <aside
        className="theme-customizer theme-customizer-open email-sidebar"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-employee-title"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "640px",
          maxWidth: "100vw",
          height: "100vh",
          zIndex: 1101,
        }}
      >
        <form
          className="customizer-sidebar-wrapper d-flex flex-column h-100"
          onSubmit={handleSubmit}
        >
          <div className="p-4 d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1 fw-bold" id="edit-employee-title">
                Edit Employee
              </h5>
              <small className="text-muted">
                Update {user.fullName}&apos;s personal and financial details
              </small>
            </div>
            <button
              type="button"
              className="avatar-text avatar-md"
              onClick={onClose}
              disabled={saving}
              aria-label="Close employee editor"
            >
              <FiX />
            </button>
          </div>

          <div className="flex-grow-1 p-4" style={{ overflowY: "auto" }}>
            <section className="mb-5">
              <SectionHeading
                icon={FiUser}
                title="Personal Details"
                description="Employee identity, work, contact, and address information"
              />
              <div className="row g-3">
                <TextField
                  label="Full Name"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
                <SelectField
                  label="Status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                  options={[
                    { value: "ACTIVE", label: "Active" },
                    { value: "INACTIVE", label: "Inactive" },
                  ]}
                />
                <SelectField
                  label="Employment Type"
                  name="employmentType"
                  value={form.employmentType}
                  onChange={handleChange}
                  options={[
                    { value: "FULL_TIME", label: "Full Time" },
                    { value: "PART_TIME", label: "Part Time" },
                    { value: "CONTRACT", label: "Contract" },
                    { value: "INTERN", label: "Intern" },
                  ]}
                />
                <TextField
                  label="Work Location"
                  name="workLocation"
                  value={form.workLocation}
                  onChange={handleChange}
                />
                <TextField
                  label="Date of Joining"
                  name="dateOfJoining"
                  type="date"
                  value={form.dateOfJoining}
                  onChange={handleChange}
                  required
                />
                <SelectField
                  label="Gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  options={[
                    { value: "MALE", label: "Male" },
                    { value: "FEMALE", label: "Female" },
                    { value: "OTHER", label: "Other" },
                  ]}
                />
                <TextField
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                />
                <SelectField
                  label="Department"
                  name="departmentId"
                  value={form.departmentId}
                  onChange={handleChange}
                  options={departments.map((department) => ({
                    value: department.id,
                    label: department.name,
                  }))}
                />
                <SelectField
                  label="Designation"
                  name="designationId"
                  value={form.designationId}
                  onChange={handleChange}
                  options={availableDesignations.map((designation) => ({
                    value: designation.id,
                    label: designation.name,
                  }))}
                />
                {optionsLoading && (
                  <div className="col-12 text-muted small">
                    Loading departments and designations…
                  </div>
                )}
                {optionsError && (
                  <div className="col-12">
                    <div className="alert alert-warning py-2 mb-0" role="alert">
                      {optionsError}
                    </div>
                  </div>
                )}
                <TextField
                  label="Father's Name"
                  name="fatherName"
                  value={form.fatherName}
                  onChange={handleChange}
                />
                <TextField
                  label="Mother's Name"
                  name="motherName"
                  value={form.motherName}
                  onChange={handleChange}
                />
                <TextField
                  label="Spouse Name"
                  name="spouseName"
                  value={form.spouseName}
                  onChange={handleChange}
                />
                <TextField
                  label="Blood Group"
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                />
                <div className="col-12">
                  <label className="form-label fw-medium" htmlFor="employee-edit-currentAddress">
                    Current Address
                  </label>
                  <textarea
                    id="employee-edit-currentAddress"
                    className="form-control"
                    name="currentAddress"
                    rows={2}
                    value={form.currentAddress}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium" htmlFor="employee-edit-permanentAddress">
                    Permanent Address
                  </label>
                  <textarea
                    id="employee-edit-permanentAddress"
                    className="form-control"
                    name="permanentAddress"
                    rows={2}
                    value={form.permanentAddress}
                    onChange={handleChange}
                  />
                </div>
                <TextField label="City" name="city" value={form.city} onChange={handleChange} />
                <TextField label="State" name="state" value={form.state} onChange={handleChange} />
                <TextField
                  label="Country"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                />
                <TextField
                  label="Pincode"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                />
                <TextField
                  label="Emergency Contact Name"
                  name="emergencyContactName"
                  value={form.emergencyContactName}
                  onChange={handleChange}
                />
                <TextField
                  label="Emergency Contact Phone"
                  name="emergencyContactPhone"
                  type="tel"
                  value={form.emergencyContactPhone}
                  onChange={handleChange}
                />
                <TextField
                  label="Emergency Contact Relation"
                  name="emergencyContactRelation"
                  value={form.emergencyContactRelation}
                  onChange={handleChange}
                />
                <TextField
                  label="Reporting Manager"
                  name="reportingManagerName"
                  value={form.reportingManagerName}
                  onChange={handleChange}
                />
              </div>
            </section>

            <section>
              <SectionHeading
                icon={FiCreditCard}
                title="Financial Details"
                description="Banking and statutory identification information"
              />
              <div className="row g-3">
                <TextField
                  label="Bank Name"
                  name="bankName"
                  value={form.financialDetails.bankName}
                  onChange={handleFinancialChange}
                />
                <TextField
                  label="Account Number"
                  name="accountNo"
                  value={form.financialDetails.accountNo}
                  onChange={handleFinancialChange}
                />
                <TextField
                  label="IFSC Code"
                  name="ifscCode"
                  value={form.financialDetails.ifscCode}
                  onChange={handleFinancialChange}
                />
                <TextField
                  label="PAN Number"
                  name="panNumber"
                  value={form.financialDetails.panNumber}
                  onChange={handleFinancialChange}
                />
                <TextField
                  label="UAN Number"
                  name="uanNo"
                  value={form.financialDetails.uanNo}
                  onChange={handleFinancialChange}
                />
                <TextField
                  label="ESIC Number"
                  name="esicNo"
                  value={form.financialDetails.esicNo}
                  onChange={handleFinancialChange}
                />
              </div>
            </section>
          </div>

          <div className="p-3 border-top d-flex justify-content-end gap-2 bg-white">
            <button type="button" className="btn btn-light" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </aside>
    </>
  );
};

export default EditEmployeeSidebar;
