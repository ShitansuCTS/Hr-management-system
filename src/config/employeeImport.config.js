export const IMPORT_FIELD_TYPES = {
  STRING: "string",
  DATE: "date",
  NUMBER: "number",
  EMAIL: "email",
  PHONE: "phone",
};

export const EMPLOYEE_IMPORT_COLUMNS = {

  employeeId: {
    header: "Employee ID",
    required: true,
    type: "string",
    unique: true,
  },

  email: {
    header: "Email",
    required: true,
    type: "string",
    unique: true,
  },

  fullName: {
    header: "Full Name",
    required: true,
    type: "string",
  },

  phone: {
    header: "Phone",
    required: true,
    type: "string",
    unique: false,
  },

  designation: {
    header: "Designation",
    required: true,
    type: "string",
  },

  department: {
    header: "Department",
    required: true,
    type: "string",
  },

  employmentType: {
    header: "Employment Type",
    required: true,
    type: "string",
  },

  workLocation: {
    header: "Work Location",
    required: true,
    type: "string",
  },

  dateOfJoining: {
    header: "Date Of Joining",
    required: true,
    type: "date",
  },

  gender: {
    header: "Gender",
    required: true,
    type: "string",
  },

  dateOfBirth: {
    header: "Date Of Birth",
    required: true,
    type: "date",
  },

  bloodGroup: {
    header: "Blood Group",
    required: true,
    type: "string",
  },

  fatherName: {
    header: "Father Name",
    required: true,
    type: "string",
  },

  motherName: {
    header: "Mother Name",
    required: true,
    type: "string",
  },

  spouseName: {
    header: "Spouse Name",
    required: true,
    type: "string",
  },

  bankName: {
    header: "Bank Name",
    required: true,
    type: "string",
  },

  accountNo: {
    header: "Account Number",
    required: true,
    type: "string",
  },

  ifscCode: {
    header: "IFSC Code",
    required: true,
    type: "string",
  },

  panNumber: {
    header: "PAN Number",
    required: true,
    type: "string",
  },

  uanNo: {
    header: "UAN Number",
    required: true,
    type: "string",
  },

  esicNo: {
    header: "ESIC Number",
    required: true,
    type: "string",
  },

  currentAddress: {
    header: "Current Address",
    required: true,
    type: "string",
  },

  permanentAddress: {
    header: "Permanent Address",
    required: true,
    type: "string",
  },

  city: {
    header: "City",
    required: true,
    type: "string",
  },

  state: {
    header: "State",
    required: true,
    type: "string",
  },

  country: {
    header: "Country",
    required: true,
    type: "string",
  },

  pincode: {
    header: "Pincode",
    required: true,
    type: "string",
  },

  emergencyContactName: {
    header: "Emergency Contact Name",
    required: true,
    type: "string",
  },

  emergencyContactPhone: {
    header: "Emergency Contact Phone",
    required: true,
    type: "string",
  },

  emergencyContactRelation: {
    header: "Emergency Contact Relation",
    required: true,
    type: "string",
  },

  reportingManagerName: {
    header: "Reporting Manager Name",
    required: true,
    type: "string",
  },

};