const USER_EDITABLE_FIELDS = [
  "email",
  "fullName",
  "phone",
  "status",
  "employmentType",
  "workLocation",
  "dateOfJoining",
  "gender",
  "dateOfBirth",
  "fatherName",
  "motherName",
  "bloodGroup",
  "currentAddress",
  "permanentAddress",
  "city",
  "state",
  "country",
  "pincode",
  "emergencyContactName",
  "emergencyContactPhone",
  "emergencyContactRelation",
  "reportingManagerName",
  "spouseName",
  "departmentId",
  "designationId",
];

const FINANCIAL_EDITABLE_FIELDS = [
  "bankName",
  "accountNo",
  "ifscCode",
  "panNumber",
  "uanNo",
  "esicNo",
];

const ALLOWED_ENUMS = {
  status: ["ACTIVE", "INACTIVE"],
  employmentType: ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"],
  gender: ["MALE", "FEMALE", "OTHER"],
};

function validationError(message, errors = {}) {
  const error = new Error(message);
  error.statusCode = 400;
  error.errors = errors;
  return error;
}

function normalizeString(value, field) {
  if (value === null) return null;

  if (typeof value !== "string") {
    throw validationError(`${field} must be a string.`);
  }

  return value.trim() || null;
}

function normalizeDate(value, field, nullable = false) {
  if (value === null || value === "") {
    if (nullable) return null;
    throw validationError(`${field} is required.`);
  }

  if (typeof value !== "string") {
    throw validationError(`${field} must be a date string.`);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw validationError(`Invalid ${field}.`);
  }

  return date;
}

function buildUserUpdate(body) {
  const data = {};

  for (const field of USER_EDITABLE_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(body, field)) continue;

    const value = body[field];

    if (field === "dateOfJoining") {
      data[field] = normalizeDate(value, field);
      continue;
    }

    if (field === "dateOfBirth") {
      data[field] = normalizeDate(value, field, true);
      continue;
    }

    if (ALLOWED_ENUMS[field]) {
      if (value === null && field !== "status") {
        data[field] = null;
        continue;
      }

      if (!ALLOWED_ENUMS[field].includes(value)) {
        throw validationError(`Invalid ${field}.`);
      }

      data[field] = value;
      continue;
    }

    data[field] = normalizeString(value, field);
  }

  for (const field of ["email", "fullName", "phone"]) {
    if (Object.prototype.hasOwnProperty.call(data, field) && !data[field]) {
      throw validationError(`${field} cannot be empty.`);
    }
  }

  if (data.email) {
    data.email = data.email.toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw validationError("Invalid email address.");
    }
  }

  return data;
}

function buildFinancialUpdate(financialDetails) {
  if (
    !financialDetails ||
    typeof financialDetails !== "object" ||
    Array.isArray(financialDetails)
  ) {
    throw validationError("Invalid financial details.");
  }

  const unsupportedFields = Object.keys(financialDetails).filter(
    (field) => !FINANCIAL_EDITABLE_FIELDS.includes(field)
  );

  if (unsupportedFields.length > 0) {
    throw validationError("Financial details contain unsupported fields.", {
      unknownFields: unsupportedFields,
    });
  }

  const data = {};

  for (const field of FINANCIAL_EDITABLE_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(financialDetails, field)) {
      continue;
    }

    data[field] = normalizeString(financialDetails[field], field);
  }

  if (Object.keys(data).length === 0) {
    throw validationError("No financial details provided.");
  }

  return data;
}

export function validateUpdateUserProfile(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw validationError("Invalid request body.");
  }

  const allowedKeys = [...USER_EDITABLE_FIELDS, "financialDetails"];
  const unknownKeys = Object.keys(body).filter((key) => !allowedKeys.includes(key));

  if (unknownKeys.length > 0) {
    throw validationError("Request contains unsupported fields.", {
      unknownFields: unknownKeys,
    });
  }

  const userData = buildUserUpdate(body);
  const hasFinancialDetails = Object.prototype.hasOwnProperty.call(body, "financialDetails");
  const financialDetails = hasFinancialDetails
    ? buildFinancialUpdate(body.financialDetails)
    : undefined;

  if (Object.keys(userData).length === 0 && !hasFinancialDetails) {
    throw validationError("No profile changes provided.");
  }

  return {
    ...userData,
    ...(hasFinancialDetails ? { financialDetails } : {}),
  };
}
