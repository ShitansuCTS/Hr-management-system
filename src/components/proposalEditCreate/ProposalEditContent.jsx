"use client";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import SelectDropdown from "@/components/shared/SelectDropdown";
import MultiSelectImg from "@/components/shared/MultiSelectImg";
import MultiSelectTags from "@/components/shared/MultiSelectTags";
import Loading from "@/components/shared/Loading";
import AddProposal from "./AddProposal";
import { currencyOptionsData } from "@/utils/fackData/currencyOptionsData";
import useDatePicker from "@/hooks/useDatePicker";
import { addDays } from "date-fns";
import { timezonesData } from "@/utils/fackData/timeZonesData";
import {
  propasalLeadOptions,
  propsalDiscountOptions,
  propsalRelatedOptions,
  propsalStatusOptions,
  propsalVisibilityOptions,
  taskAssigneeOptions,
  taskLabelsOptions,
} from "@/utils/options";
import useLocationData from "@/hooks/useLocationData";
import toast from "react-hot-toast";

// Options for dropdowns
const employmentTypeOptions = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERN", label: "Intern" },
];

const genderOptions = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

const countryOptions = [
  { value: "India", label: "India" },
  { value: "USA", label: "USA" },
  { value: "UK", label: "UK" },
  { value: "Canada", label: "Canada" },
  { value: "Australia", label: "Australia" },
];

const stateOptions = [
  { value: "Odisha", label: "Odisha" },
  { value: "Maharashtra", label: "Maharashtra" },
  { value: "Karnataka", label: "Karnataka" },
  { value: "Delhi", label: "Delhi" },
  { value: "Tamil Nadu", label: "Tamil Nadu" },
];

const cityOptions = [
  { value: "Bhubaneshwar", label: "Bhubaneshwar" },
  { value: "Mumbai", label: "Mumbai" },
  { value: "Bangalore", label: "Bangalore" },
  { value: "Delhi", label: "Delhi" },
  { value: "Chennai", label: "Chennai" },
];

const relationshipOptions = [
  { value: "Father", label: "Father" },
  { value: "Mother", label: "Mother" },
  { value: "Spouse", label: "Spouse" },
  { value: "Brother", label: "Brother" },
  { value: "Sister", label: "Sister" },
  { value: "Friend", label: "Friend" },
];

const previtems = [
  {
    id: 1,
    product: "Website design and development",
    qty: 1,
    price: 250,
  },
  {
    id: 2,
    product: "Search engine optimization (SEO) optimization",
    qty: 2,
    price: 300,
  },
];

// const departmentOptions = [
//   { value: "Development", label: "Development" },
//   { value: "HR", label: "HR" },
//   { value: "Sales", label: "Sales" },
//   { value: "SEO", label: "SEO" },
//   { value: "SMO", label: "SMO" },
//   { value: "Graphic Design", label: " Graphic Design" },
//   { value: "Lead Generation", label: "Lead Generation" },
//   { value: "Accounting", label: "Accounting" },
// ];

// const designationOptions = {
//   Development: [
//     { value: "Frontend Developer", label: "Frontend Developer" },
//     { value: "Backend Developer", label: "Backend Developer" },
//     { value: "Full Stack Developer", label: "Full Stack Developer" },
//     { value: "Software Engineer", label: "Software Engineer" },
//     { value: "Senior Developer", label: "Senior Developer" },
//     { value: "Tech Lead", label: "Tech Lead" },
//     { value: "QA Engineer", label: "QA Engineer" },
//     { value: "DevOps Engineer", label: "DevOps Engineer" },
//   ],

//   HR: [
//     { value: "HR Executive", label: "HR Executive" },
//     { value: "HR Manager", label: "HR Manager" },
//     { value: "Recruiter", label: "Recruiter" },
//     { value: "Talent Acquisition Specialist", label: "Talent Acquisition Specialist" },
//     { value: "HR Business Partner", label: "HR Business Partner" },
//   ],

//   Sales: [
//     { value: "Sales Executive", label: "Sales Executive" },
//     { value: "Sales Manager", label: "Sales Manager" },
//     { value: "Business Development Executive", label: "Business Development Executive" },
//     { value: "Business Development Manager", label: "Business Development Manager" },
//     { value: "Account Manager", label: "Account Manager" },
//   ],

//   SEO: [
//     { value: "SEO Executive", label: "SEO Executive" },
//     { value: "SEO Analyst", label: "SEO Analyst" },
//     { value: "Senior SEO Specialist", label: "Senior SEO Specialist" },
//     { value: "SEO Manager", label: "SEO Manager" },
//   ],

//   SMO: [
//     { value: "SMO Executive", label: "SMO Executive" },
//     { value: "Social Media Executive", label: "Social Media Executive" },
//     { value: "Social Media Manager", label: "Social Media Manager" },
//     { value: "Content Strategist", label: "Content Strategist" },
//   ],

//   "Graphic Design": [
//     { value: "Graphic Designer", label: "Graphic Designer" },
//     { value: "Senior Graphic Designer", label: "Senior Graphic Designer" },
//     { value: "UI/UX Designer", label: "UI/UX Designer" },
//     { value: "Visual Designer", label: "Visual Designer" },
//     { value: "Creative Head", label: "Creative Head" },
//   ],

//   "Lead Generation": [
//     { value: "Lead Generation Executive", label: "Lead Generation Executive" },
//     { value: "Lead Generation Specialist", label: "Lead Generation Specialist" },
//     { value: "Inside Sales Executive", label: "Inside Sales Executive" },
//     { value: "Email Marketing Executive", label: "Email Marketing Executive" },
//   ],

//   Accounting: [
//     { value: "Accountant", label: "Accountant" },
//     { value: "Senior Accountant", label: "Senior Accountant" },
//     { value: "Accounts Executive", label: "Accounts Executive" },
//     { value: "Finance Manager", label: "Finance Manager" },
//     { value: "Billing Executive", label: "Billing Executive" },
//   ],
// };

const bloodOptions = [
  { value: "A+", label: "A+" },
  { value: "B+", label: "B+" },
  { value: "O+", label: "O+" },
  { value: "AB+", label: "AB+" },
  { value: "A-", label: "A-" },
  { value: "B-", label: "B-" },
  { value: "O-", label: "O-" },
  { value: "AB-", label: "AB-" },
];

// Default selected values
const defaultEmploymentType = employmentTypeOptions[0]; // Full Time
const defaultGender = genderOptions[0]; // Male
const defaultCountry = countryOptions[0]; // India
const defaultState = stateOptions[0]; // Odisha
const defaultCity = cityOptions[0]; // Bhubaneshwar
const defaultRelationship = relationshipOptions[0]; // Father

// Profile Picture Upload Component (defined outside)
const ProfilePictureUpload = ({ profileImage, setProfileImage }) => {
  const [preview, setPreview] = useState("https://placehold.co/60x60/000000/FFFFFF/?text=No+Image");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center gap-4 flex-wrap">
      <img
        src={preview}
        alt="Profile Preview"
        className="rounded-circle border"
        width="120"
        height="120"
        style={{ objectFit: "cover" }}
      />
      <div className="d-flex flex-column gap-2">
        <label className="btn btn-outline-secondary mb-0">
          Upload
          <input type="file" accept="image/png, image/jpeg" hidden onChange={handleImageChange} />
        </label>
        <small className="text-muted">Optional (JPG, PNG)</small>
      </div>
    </div>
  );
};

const ProposalEditContent = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const { startDate, endDate, setStartDate, setEndDate, renderFooter } = useDatePicker();
  const { countries, states, cities, loading, error, fetchStates, fetchCities } = useLocationData();
  const [loadings, setLoadings] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDesignation, setSelectedDesignation] = useState(null);

  // Dropdown selected values with defaults
  const [selectedEmploymentType, setSelectedEmploymentType] = useState(defaultEmploymentType);
  const [selectedGender, setSelectedGender] = useState(defaultGender);
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [selectedState, setSelectedState] = useState(defaultState);
  const [selectedCity, setSelectedCity] = useState(defaultCity);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState(null);
  const [selectedRelationship, setSelectedRelationship] = useState(defaultRelationship);

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  // Checkbox states
  const [payrollSettings, setPayrollSettings] = useState({
    overtime: false,
    conveyance: false,
    medical: false,
    pf: false,
    es: false,
  });

  useEffect(() => {
    setStartDate(new Date());
    setEndDate(addDays(new Date(), 2));
  }, []);

  // Department and designation section
  const fetchDepartments = async () => {
    const res = await fetch("/api/v1/departments");
    const data = await res.json();
    setDepartments(data.data || []);
  };
  const fetchDesignations = async () => {
    const res = await fetch("/api/v1/designations");
    const data = await res.json();
    setDesignations(data.data || []);
  };

  useEffect(() => {
    fetchDepartments();
    fetchDesignations();
  }, []);

  console.log("departments", departments);
  console.log("designations", designations);

  const departmentOptions = departments.map((dept) => ({
    value: dept.id, // use ID (better than name)
    label: dept.name,
  }));
  const designationOptions = departments.reduce((acc, dept) => {
    acc[dept.id] = designations
      .filter((des) => des.departmentId === dept.id)
      .map((des) => ({
        value: des.id,
        label: des.name,
      }));

    return acc;
  }, {});

  const selectedDepartmentOption = departmentOptions.find(
    (opt) => opt.value === selectedDepartment
  );

  const selectedDesignationOption =
    selectedDepartment && designationOptions[selectedDepartment]
      ? designationOptions[selectedDepartment].find((opt) => opt.value === selectedDesignation)
      : null;
  // Department and designation section

  // form submission login
  const [formData, setFormData] = useState({
    fullName: "",
    employeeId: "", // Default value
    email: "",
    phone: "",
    designation: "",
    department: "",
    employmentType: defaultEmploymentType.value, // Set default value
    workLocation: "",
    dateOfJoining: "",

    // Personal Details
    gender: defaultGender.value, // Set default value
    dateOfBirth: "",
    fatherName: "",
    motherName: "",
    spouseName: "",

    // Financial & Statutory
    bankName: "",
    accountNo: "",
    ifscCode: "",
    panNumber: "",
    uanNo: "",
    esicNo: "",

    // Address Details
    currentAddress: "",
    permanentAddress: "",
    city: defaultCity.value, // Set default value
    state: defaultState.value, // Set default value
    country: defaultCountry.value, // Set default value
    pincode: "",

    // Emergency Contact
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: defaultRelationship.value, // Set default value

    // Reporting Manager
    reportingManagerName: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setPayrollSettings((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPayrollSettings((prev) => ({ ...prev, [name]: checked }));
  };

  // Dropdown handlers
  const handleEmploymentTypeChange = (option) => {
    setSelectedEmploymentType(option);
    setFormData((prev) => ({ ...prev, employmentType: option?.value || "" }));
  };

  const handleGenderChange = (option) => {
    setSelectedGender(option);
    setFormData((prev) => ({ ...prev, gender: option?.value || "" }));
  };

  const handleCountryChange = (option) => {
    setSelectedCountry(option);
    setFormData((prev) => ({ ...prev, country: option?.value || "" }));
    // Fetch states based on selected country
    if (option?.value) {
      fetchStates(option.value);
    }
  };

  const handleStateChange = (option) => {
    setSelectedState(option);
    setFormData((prev) => ({ ...prev, state: option?.value || "" }));
    // Fetch cities based on selected state
    if (option?.value) {
      fetchCities(option.value);
    }
  };

  const handleCityChange = (option) => {
    setSelectedCity(option);
    setFormData((prev) => ({ ...prev, city: option?.value || "" }));
  };

  const handleRelationshipChange = (option) => {
    setSelectedRelationship(option);
    setFormData((prev) => ({ ...prev, emergencyContactRelation: option?.value || "" }));
  };

  const handleDepartmentChange = (option) => {
    setSelectedDepartment(option.value); // store only ID
    setSelectedDesignation(null);

    setFormData((prev) => ({
      ...prev,
      department: option.value,
      designation: "",
    }));
  };

  const handleDesignationChange = (option) => {
    setSelectedDesignation(option.value);

    setFormData((prev) => ({
      ...prev,
      designation: option.value,
    }));
  };

  const handleBloodGroupChange = (option) => {
    setSelectedBloodGroup(option);
    setFormData((prev) => ({ ...prev, bloodGroup: option?.value || "" }));
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      employeeId: "UTC+0530",
      email: "",
      phone: "",
      designation: "",
      department: "",
      employmentType: defaultEmploymentType.value,
      workLocation: "",
      dateOfJoining: "",
      gender: defaultGender.value,
      dateOfBirth: "",
      fatherName: "",
      motherName: "",
      spouseName: "",
      bankName: "",
      accountNo: "",
      ifscCode: "",
      panNumber: "",
      uanNo: "",
      esicNo: "",
      currentAddress: "",
      permanentAddress: "",
      city: defaultCity.value,
      state: defaultState.value,
      country: defaultCountry.value,
      pincode: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelation: defaultRelationship.value,
      reportingManagerName: "",
    });
    setPayrollSettings({
      overtime: false,
      conveyance: false,
      medical: false,
      pf: false,
      es: false,
    });
    setSelectedEmploymentType(defaultEmploymentType);
    setSelectedGender(defaultGender);
    setSelectedCountry(defaultCountry);
    setSelectedState(defaultState);
    setSelectedCity(defaultCity);
    setSelectedRelationship(defaultRelationship);
    setProfileImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadings(true);

    try {
      const data = new FormData();

      // Append all text fields
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      // Append checkbox settings
      Object.keys(payrollSettings).forEach((key) => {
        data.append(key, payrollSettings[key]);
      });
      // Append image file
      if (profileImage) {
        data.append("profileImage", profileImage);
      }

      const res = await fetch("/api/v1/users/all-users-details", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        const errorMessage =
          Object.values(result.errors || {})[0] || result.message || "Something went wrong";

        toast.error(errorMessage);
        return;
      }

      // for (let [key, value] of data.entries()) {
      //   console.log(key, value);
      // }

      toast.success(result.message || "User created successfully");
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoadings(false);
    }
  };
  // form submission login

  return (
    <>
      <div className="col-xl-12">
        <div className="card stretch stretch-full">
          <div className="card-body">
            <h3 className="mb-4 fw-bold">Add Employee</h3>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <div
                    className="card shadow-sm rounded-3 p-2"
                    style={{
                      position: "sticky",
                      alignSelf: "flex-end",
                    }}
                  >
                    {/* Profile Picture Section */}
                    <div className="row mb-4">
                      <div className="col-12">
                        <div className="card shadow-sm border-0">
                          <div className="card-body text-center">
                            {/* Header */}
                            <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                fill="#3353d0"
                                viewBox="0 0 24 24"
                              >
                                <circle cx="12" cy="8" r="4" fill="#3353d0" />
                                <path
                                  d="M4 20c2-4 14-4 16 0"
                                  stroke="#3353d0"
                                  strokeWidth="2"
                                  fill="none"
                                />
                              </svg>
                              <h5 className="fw-semibold mb-0" style={{ color: "#3353d0" }}>
                                Profile Picture
                              </h5>
                            </div>

                            {/* Divider */}
                            <div className="border-bottom mb-4"></div>

                            {/* Upload Component */}
                            <div className="d-flex justify-content-center">
                              <ProfilePictureUpload
                                profileImage={profileImage}
                                setProfileImage={setProfileImage}
                              />
                            </div>

                            {/* Helper Text */}
                            <small className="text-muted d-block mt-3">
                              Upload a clear headshot (JPG or PNG). This photo will appear on
                              employee records.
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payroll & Settings Section */}
                    <div className="row mb-4">
                      <div className="col-12">
                        <div className="border-bottom pb-2 mb-3">
                          <h5 className="fw-semibold mb-0" style={{ color: "#3353d0" }}>
                            Payroll & Settings
                          </h5>
                        </div>
                        <div className="d-flex gap-4 flex-wrap">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="overtime"
                              id="overtime"
                              checked={payrollSettings.overtime}
                              onChange={handleCheckboxChange}
                            />
                            <label className="form-check-label" htmlFor="overtime">
                              Overtime
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="conveyance"
                              id="conveyance"
                              checked={payrollSettings.conveyance}
                              onChange={handleCheckboxChange}
                            />
                            <label className="form-check-label" htmlFor="conveyance">
                              Conveyance
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="medical"
                              id="medical"
                              checked={payrollSettings.medical}
                              onChange={handleCheckboxChange}
                            />
                            <label className="form-check-label" htmlFor="medical">
                              Medical
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="pf"
                              id="pf"
                              checked={payrollSettings.pf}
                              onChange={handleCheckboxChange}
                            />
                            <label className="form-check-label" htmlFor="pf">
                              PF
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="es"
                              id="es"
                              checked={payrollSettings.es}
                              onChange={handleCheckboxChange}
                            />
                            <label className="form-check-label" htmlFor="es">
                              ES
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ID Section */}
                    <div className="row mb-4">
                      <div className="col-12 text-center">
                        <div className="border-bottom pb-2 mb-3">
                          <h5 className="fw-semibold mb-0 d-flex justify-content-center align-items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              fill="#3353d0"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M4 4h16v16H4z"
                                stroke="#3353d0"
                                strokeWidth="2"
                                fill="none"
                              />
                              <circle cx="12" cy="10" r="3" fill="#3353d0" />
                              <path
                                d="M8 17c1.5-2 6.5-2 8 0"
                                stroke="#3353d0"
                                strokeWidth="2"
                                fill="none"
                              />
                            </svg>
                            <span style={{ color: "#3353d0" }}>Employee ID</span>
                          </h5>
                        </div>

                        <div className="d-flex justify-content-center">
                          <div className="col-md-8">
                            <input
                              type="text"
                              className="form-control text-center fw-bold bg-light"
                              placeholder="Enter last 4 digits"
                              name="employeeId"
                              value={formData.employeeId}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                                setFormData((prev) => ({
                                  ...prev,
                                  employeeId: value,
                                }));
                              }}
                              style={{
                                fontSize: "1.3rem",
                                letterSpacing: "2px",
                              }}
                            />
                            <small className="text-muted d-block mt-2">
                              Employee ID: <strong>CTSL{formData.employeeId || "XXXX"}</strong>
                            </small>
                            <small className="text-muted d-block mt-2">
                              Enter Last Four Digit Only To Generate the User
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reporting Details Section */}
                    <div className="row mb-4">
                      <div className="col-12">
                        <div className="border-bottom pb-2 mb-3">
                          <h5 className="fw-semibold mb-0" style={{ color: "#3353d0" }}>
                            Reporting Details
                          </h5>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-4">
                          <label className="form-label">
                            Reporting Manager <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Manager name"
                            name="reportingManagerName"
                            value={formData.reportingManagerName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-8">
                  <div className="card shadow-sm rounded-3 p-2">
                    {/* Personal Details Section */}
                    <div className="row mb-4">
                      <div className="col-12">
                        <div className="border-bottom pb-2 mb-3">
                          <h5 className="fw-semibold mb-0 d-flex align-items-center fs-20 gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ color: "#3353d0" }}
                            >
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span style={{ color: "#3353d0" }}>Personal Details</span>
                          </h5>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-4">
                          <label className="form-label">
                            Employee Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="John Doe"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-4">
                          <label className="form-label">
                            Email <span className="text-danger">*</span>
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="john.doe@company.com"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-4">
                          <label className="form-label">
                            Phone <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="9876543210"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-4">
                          <label className="form-label">
                            Department <span className="text-danger">*</span>
                          </label>
                          {/* <SelectDropdown
                            options={departmentOptions}
                            defaultSelect="Select Department"
                            selectedOption={selectedDepartmentOption} // ✅ FIXED
                            onSelectOption={handleDepartmentChange}
                            searchable={true}
                            placeholder="Search department..."
                          /> */}
                          <select
                            className="form-control"
                            value={selectedDepartment || ""}
                            onChange={(e) =>
                              handleDepartmentChange({
                                value: e.target.value,
                                label: e.target.options[e.target.selectedIndex].text,
                              })
                            }
                          >
                            <option value="">Select Department</option>
                            {departmentOptions.map((dept) => (
                              <option key={dept.value} value={dept.value}>
                                {dept.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-4">
                          <label className="form-label">
                            Designation <span className="text-danger">*</span>
                          </label>
                          {/* <SelectDropdown
                            options={
                              selectedDepartment
                                ? designationOptions[selectedDepartment]
                                : []
                            }
                            defaultSelect="Select Designation"
                            selectedOption={selectedDesignationOption} // ✅ FIXED
                            onSelectOption={handleDesignationChange}
                            searchable={true}
                            placeholder="Search designation..."
                            disabled={!selectedDepartment}
                          /> */}
                          <select
                            className="form-control"
                            value={selectedDesignation || ""}
                            onChange={(e) =>
                              handleDesignationChange({
                                value: e.target.value,
                                label: e.target.options[e.target.selectedIndex].text,
                              })
                            }
                            disabled={!selectedDepartment}
                          >
                            <option value="">Select Designation</option>
                            {selectedDepartment &&
                              designationOptions[selectedDepartment]?.map((des) => (
                                <option key={des.value} value={des.value}>
                                  {des.label}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="mb-4">
                          <label className="form-label">
                            Employment Type <span className="text-danger">*</span>
                          </label>
                          <SelectDropdown
                            options={employmentTypeOptions}
                            defaultSelect="Select Type"
                            selectedOption={selectedEmploymentType}
                            onSelectOption={handleEmploymentTypeChange}
                            searchable={true}
                            placeholder="Search employment type..."
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-4">
                          <label className="form-label">
                            Work Location <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Bhubaneshwar"
                            name="workLocation"
                            value={formData.workLocation}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-4">
                          <label className="form-label">
                            Date of Joining <span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            name="dateOfJoining"
                            value={formData.dateOfJoining}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-4">
                          <label className="form-label">
                            Gender <span className="text-danger">*</span>
                          </label>
                          <SelectDropdown
                            options={genderOptions}
                            defaultSelect="Select Gender"
                            selectedOption={selectedGender}
                            onSelectOption={handleGenderChange}
                            searchable={true}
                            placeholder="Search gender..."
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-4">
                          <label className="form-label">
                            Date of Birth <span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-4">
                          <label className="form-label">
                            Father's Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Father's name"
                            name="fatherName"
                            value={formData.fatherName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-4">
                          <label className="form-label">Mother's Name</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Mother's name"
                            name="motherName"
                            value={formData.motherName}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-4">
                          <label className="form-label">Spouse Name</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Spouse name"
                            name="spouseName"
                            value={formData.spouseName}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-4">
                          <label className="form-label">
                            Blood Group <span className="text-danger">*</span>
                          </label>
                          <SelectDropdown
                            options={bloodOptions}
                            defaultSelect="Select Blood Group"
                            selectedOption={selectedBloodGroup}
                            onSelectOption={handleBloodGroupChange}
                            searchable={true}
                            placeholder="Search Blood Group..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Financial & Statutory Section */}
                    <div className="row mb-4">
                      <div className="col-12">
                        <div className="border-bottom pb-2 mb-3">
                          <h5 className="fw-semibold mb-0 d-flex align-items-center fs-20 gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ color: "#3353d0" }}
                            >
                              <rect x="2" y="6" width="20" height="14" rx="2" ry="2"></rect>
                              <line x1="2" y1="10" x2="22" y2="10"></line>
                              <line x1="8" y1="14" x2="16" y2="14"></line>
                            </svg>
                            <span style={{ color: "#3353d0" }}>Financial & Statutory</span>
                          </h5>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-4">
                          <label className="form-label">Bank Name</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Bank name"
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-4">
                          <label className="form-label">Account No</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Account number"
                            name="accountNo"
                            value={formData.accountNo}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-4">
                          <label className="form-label">IFSC Code</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="IFSC code"
                            name="ifscCode"
                            value={formData.ifscCode}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-4">
                          <label className="form-label">PAN Number</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="PAN number"
                            name="panNumber"
                            value={formData.panNumber}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-4">
                          <label className="form-label">UAN No</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="UAN number"
                            name="uanNo"
                            value={formData.uanNo}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-4">
                          <label className="form-label">ESIC No</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="ESIC number"
                            name="esicNo"
                            value={formData.esicNo}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address Details Section */}
                    <div className="row mb-4">
                      <div className="col-12">
                        <div className="border-bottom pb-2 mb-3">
                          <h5 className="fw-semibold mb-0 d-flex align-items-center fs-20 gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ color: "#3353d0" }}
                            >
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                              <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <span style={{ color: "#3353d0" }}>Address Details</span>
                          </h5>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-4">
                          <label className="form-label">
                            Current Address <span className="text-danger">*</span>
                          </label>
                          <textarea
                            type="text"
                            className="form-control"
                            placeholder="Current address"
                            name="currentAddress"
                            value={formData.currentAddress || ""}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-4">
                          <label className="form-label">
                            Permanent Address <span className="text-danger">*</span>
                          </label>
                          <textarea
                            type="text"
                            className="form-control"
                            placeholder="Permanent address"
                            name="permanentAddress"
                            value={formData.permanentAddress || ""}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="mb-4">
                          <label className="form-label">
                            Country <span className="text-danger">*</span>
                          </label>
                          <SelectDropdown
                            options={countryOptions}
                            defaultSelect="Select Country"
                            selectedOption={selectedCountry}
                            onSelectOption={handleCountryChange}
                            searchable={true}
                            placeholder="Search country..."
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="mb-4">
                          <label className="form-label">
                            State <span className="text-danger">*</span>
                          </label>
                          <SelectDropdown
                            options={stateOptions}
                            defaultSelect="Select State"
                            selectedOption={selectedState}
                            onSelectOption={handleStateChange}
                            searchable={true}
                            placeholder="Search state..."
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="mb-4">
                          <label className="form-label">
                            City <span className="text-danger">*</span>
                          </label>
                          <SelectDropdown
                            options={cityOptions}
                            defaultSelect="Select City"
                            selectedOption={selectedCity}
                            onSelectOption={handleCityChange}
                            searchable={true}
                            placeholder="Search city..."
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="mb-4">
                          <label className="form-label">
                            Pincode <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Pincode"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Emergency Details Section */}
                    <div className="row mb-4">
                      <div className="col-12">
                        <div className="border-bottom pb-2 mb-3">
                          <h5 className="fw-semibold mb-0 d-flex align-items-center fs-20 gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ color: "#3353d0" }}
                            >
                              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                            <span style={{ color: "#3353d0" }}>Emergency Details</span>
                          </h5>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-4">
                          <label className="form-label">
                            Emergency Contact Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Contact name"
                            name="emergencyContactName"
                            value={formData.emergencyContactName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-4">
                          <label className="form-label">
                            Emergency Contact Number <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Contact number"
                            name="emergencyContactPhone"
                            value={formData.emergencyContactPhone}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-4">
                          <label className="form-label">
                            Emergency Contact Relationship <span className="text-danger">*</span>
                          </label>
                          <SelectDropdown
                            options={relationshipOptions}
                            defaultSelect="Select Relationship"
                            selectedOption={selectedRelationship}
                            onSelectOption={handleRelationshipChange}
                            searchable={true}
                            placeholder="Search relationship..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="row mt-4">
                <div className="col-12 d-flex gap-2">
                  <button type="submit" className="btn btn-primary px-4" disabled={loadings}>
                    {loadings ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />
                        Saving...
                      </>
                    ) : (
                      "Save Employee"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light px-4"
                    disabled={loadings}
                    onClick={resetForm}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProposalEditContent;
