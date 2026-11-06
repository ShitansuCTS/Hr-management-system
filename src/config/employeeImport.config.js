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
    required: false,
    type: "string",
  },

  department: {
    header: "Department",
    required: false,
    type: "string",
  },

  employmentType: {
    header: "Employment Type",
    required: false,
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
    required: false,
    type: "string",
  },

  dateOfBirth: {
    header: "Date Of Birth",
    required: false,
    type: "date",
  },

  bloodGroup: {
    header: "Blood Group",
    required: false,
    type: "string",
  },

  fatherName: {
    header: "Father Name",
    required: false,
    type: "string",
  },

  motherName: {
    header: "Mother Name",
    required: false,
    type: "string",
  },

  spouseName: {
    header: "Spouse Name",
    required: false,
    type: "string",
  },

  bankName: {
    header: "Bank Name",
    required: false,
    type: "string",
  },

  accountNo: {
    header: "Account Number",
    required: false,
    type: "string",
  },

  ifscCode: {
    header: "IFSC Code",
    required: false,
    type: "string",
  },

  panNumber: {
    header: "PAN Number",
    required: false,
    type: "string",
  },

  uanNo: {
    header: "UAN Number",
    required: false,
    type: "string",
  },

  esicNo: {
    header: "ESIC Number",
    required: false,
    type: "string",
  },

  currentAddress: {
    header: "Current Address",
    required: false,
    type: "string",
  },

  permanentAddress: {
    header: "Permanent Address",
    required: false,
    type: "string",
  },

  city: {
    header: "City",
    required: false,
    type: "string",
  },

  state: {
    header: "State",
    required: false,
    type: "string",
  },

  country: {
    header: "Country",
    required: false,
    type: "string",
  },

  pincode: {
    header: "Pincode",
    required: false,
    type: "string",
  },

  emergencyContactName: {
    header: "Emergency Contact Name",
    required: false,
    type: "string",
  },

  emergencyContactPhone: {
    header: "Emergency Contact Phone",
    required: false,
    type: "string",
  },

  emergencyContactRelation: {
    header: "Emergency Contact Relation",
    required: false,
    type: "string",
  },

  reportingManagerName: {
    header: "Reporting Manager Name",
    required: false,
    type: "string",
  },
};

const HEADER_ALIASES = {
  employeeid: "employeeId",
  employeecode: "employeeId",
  email: "email",
  emailaddress: "email",
  fullname: "fullName",
  employeename: "fullName",
  phone: "phone",
  phonenumber: "phone",
  mobilenumber: "phone",
  designation: "designation",
  designationname: "designation",
  department: "department",
  departmentname: "department",
  employmenttype: "employmentType",
  worklocation: "workLocation",
  dateofjoining: "dateOfJoining",
  joiningdate: "dateOfJoining",
  gender: "gender",
  dateofbirth: "dateOfBirth",
  dob: "dateOfBirth",
  bloodgroup: "bloodGroup",
  fathername: "fatherName",
  mothername: "motherName",
  spousename: "spouseName",
  bankname: "bankName",
  accountnumber: "accountNo",
  accountno: "accountNo",
  ifsccode: "ifscCode",
  pannumber: "panNumber",
  panno: "panNumber",
  uannumber: "uanNo",
  uanno: "uanNo",
  esicnumber: "esicNo",
  esicno: "esicNo",
  currentaddress: "currentAddress",
  permanentaddress: "permanentAddress",
  city: "city",
  state: "state",
  country: "country",
  pincode: "pincode",
  emergencycontactname: "emergencyContactName",
  emergencycontactphone: "emergencyContactPhone",
  emergencycontactnumber: "emergencyContactPhone",
  emergencycontactrelation: "emergencyContactRelation",
  reportingmanagername: "reportingManagerName",
  reportingmanager: "reportingManagerName",
};

export function normalizeEmployeeImportHeader(header) {
  return String(header ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function getEmployeeImportField(header) {
  const normalizedHeader = normalizeEmployeeImportHeader(header);
  const alias = HEADER_ALIASES[normalizedHeader];

  if (alias) {
    return alias;
  }

  return Object.entries(EMPLOYEE_IMPORT_COLUMNS).find(
    ([, config]) => normalizeEmployeeImportHeader(config.header) === normalizedHeader
  )?.[0];
}

export const REQUIRED_EMPLOYEE_IMPORT_FIELDS = [
  "employeeId",
  "email",
  "fullName",
  "phone",
  "workLocation",
  "dateOfJoining",
];
