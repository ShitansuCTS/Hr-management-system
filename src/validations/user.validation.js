import { z } from "zod";
import sanitizeHtml from "sanitize-html";

/* ----------------------------------------------------
 * REGEX
 * --------------------------------------------------*/

const employeeIdRegex = /^\d{1,10}$/;

const phoneRegex = /^[6-9]\d{9}$/;

const nameRegex = /^[A-Za-z][A-Za-z\s.'-]*$/;

const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

const accountNumberRegex = /^\d{9,18}$/;

const uanRegex = /^\d{12}$/;

const esicRegex = /^\d{10,17}$/;

const pincodeRegex = /^[1-9][0-9]{5}$/;

/* ----------------------------------------------------
 * SANITIZE HELPER
 * --------------------------------------------------*/

function clean(value) {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  return sanitizeHtml(value.trim(), {
    allowedTags: [],
    allowedAttributes: {},
  });
}

/* ----------------------------------------------------
 * SCHEMA
 * --------------------------------------------------*/

const createUserSchema = z
  .object({
    /* ---------------- Employee ---------------- */

    employeeId: z
      .string()
      .trim()
      .min(1, "Employee ID is required")
      .regex(employeeIdRegex, "Employee ID must contain only digits"),

    email: z.string().trim().min(1, "Email is required").email("Invalid email address"),

    fullName: z
      .string()
      .trim()
      .min(1, "Full name is required")
      .max(50, "Full name must not exceed 50 characters")
      .regex(nameRegex, "Full name must start with an alphabet"),

    phone: z
      .string()
      .trim()
      .min(1, "Phone number is required")
      .regex(phoneRegex, "Invalid phone number"),

    designation: z.string().optional(),

    department: z.string().optional(),

    employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"]).optional(),

    workLocation: z
      .string()
      .trim()
      .max(40,"Work Location must not exceed 50 characters")
      .regex(nameRegex, "Work Location must start with an alphabet"),

    dateOfJoining: z.string().optional(),

    /* ---------------- Personal ---------------- */

    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),

    dateOfBirth: z.string().optional(),

    bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),

    fatherName: z
      .string()
      .trim()
      .max(50, "Father name must not exceed 50 characters")
      .regex(nameRegex, "Father name must start with an alphabet")
      .optional()
      .or(z.literal("")),

    motherName: z
      .string()
      .trim()
      .max(50, "Mother name must not exceed 50 characters")
      .regex(nameRegex, "Mother name must start with an alphabet")
      .optional()
      .or(z.literal("")),

    spouseName: z
      .string()
      .trim()
      .max(50, "Spouse name must not exceed 50 characters")
      .regex(nameRegex, "Spouse name must start with an alphabet")
      .optional()
      .or(z.literal("")),

    /* ---------------- Financial ---------------- */

    bankName: z
      .string()
      .trim()
      .max(80, "Bank name must not exceed 80 characters")
      .optional()
      .or(z.literal("")),

    accountNo: z
      .string()
      .trim()
      .regex(accountNumberRegex, "Invalid account number")
      .optional()
      .or(z.literal("")),

    ifscCode: z
      .string()
      .trim()
      .toUpperCase()
      .regex(ifscRegex, "Invalid IFSC code")
      .optional()
      .or(z.literal("")),

    panNumber: z
      .string()
      .trim()
      .toUpperCase()
      .regex(panRegex, "Invalid PAN number")
      .optional()
      .or(z.literal("")),

    uanNo: z.string().trim().regex(uanRegex, "Invalid UAN number").optional().or(z.literal("")),

    esicNo: z.string().trim().regex(esicRegex, "Invalid ESIC number").optional().or(z.literal("")),

    /* ---------------- Address ---------------- */

    currentAddress: z
      .string()
      .trim()
      .max(200, "Current address must not exceed 200 characters")
      .optional()
      .or(z.literal("")),

    permanentAddress: z
      .string()
      .trim()
      .max(200, "Permanent address must not exceed 200 characters")
      .optional()
      .or(z.literal("")),

    city: z
      .string()
      .trim()
      .max(40, "City must not exceed 40 characters")
      .optional()
      .or(z.literal("")),

    state: z
      .string()
      .trim()
      .max(40, "State must not exceed 40 characters")
      .optional()
      .or(z.literal("")),

    country: z
      .string()
      .trim()
      .max(40, "Country must not exceed 40 characters")
      .optional()
      .or(z.literal("")),

    pincode: z.string().trim().regex(pincodeRegex, "Invalid pincode").optional().or(z.literal("")),

    /* ---------------- Emergency ---------------- */

    emergencyContactName: z
      .string()
      .trim()
      .max(50, "Emergency contact name must not exceed 50 characters")
      .regex(nameRegex, "Emergency contact name must start with an alphabet")
      .optional()
      .or(z.literal("")),

    emergencyContactPhone: z
      .string()
      .trim()
      .regex(phoneRegex, "Invalid emergency contact number")
      .optional()
      .or(z.literal("")),

    emergencyContactRelation: z
      .string()
      .trim()
      .max(30, "Emergency relation must not exceed 30 characters")
      .optional()
      .or(z.literal("")),

    /* ---------------- Reporting ---------------- */

    reportingManagerName: z
      .string()
      .trim()
      .max(50, "Reporting manager name must not exceed 50 characters")
      .regex(nameRegex, "Reporting manager name must start with an alphabet")
      .optional()
      .or(z.literal("")),

    /* ---------------- Image ---------------- */

    profileImage: z.instanceof(File, {
      message: "Profile image is required",
    }),
  })
  .superRefine((data, ctx) => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    /* ----------------------------------------
     * Date Of Joining Validation
     * --------------------------------------*/

    if (data.dateOfJoining) {
      const joiningDate = new Date(data.dateOfJoining);

      if (isNaN(joiningDate.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["dateOfJoining"],
          message: "Invalid joining date",
        });
      } else {
        joiningDate.setHours(0, 0, 0, 0);
      }
    }

    /* ----------------------------------------
     * Date Of Birth Validation
     * --------------------------------------*/

    if (data.dateOfBirth) {
      const dob = new Date(data.dateOfBirth);

      if (isNaN(dob.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["dateOfBirth"],
          message: "Invalid date of birth",
        });
      } else {
        dob.setHours(0, 0, 0, 0);

        let age = today.getFullYear() - dob.getFullYear();

        const monthDifference = today.getMonth() - dob.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
          age--;
        }

        if (age < 18) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["dateOfBirth"],
            message: "Employee must be at least 18 years old",
          });
        }

        if (dob > today) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["dateOfBirth"],
            message: "Date of birth cannot be in the future",
          });
        }
      }
    }

    /* ----------------------------------------
     * PAN Validation
     * --------------------------------------*/

    if (
      data.panNumber &&
      data.panNumber.length > 0 &&
      !panRegex.test(data.panNumber.toUpperCase())
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["panNumber"],
        message: "Invalid PAN number",
      });
    }

    /* ----------------------------------------
     * IFSC Validation
     * --------------------------------------*/

    if (data.ifscCode && data.ifscCode.length > 0 && !ifscRegex.test(data.ifscCode.toUpperCase())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["ifscCode"],
        message: "Invalid IFSC code",
      });
    }

    /* ----------------------------------------
     * Account Number Validation
     * --------------------------------------*/

    if (data.accountNo && data.accountNo.length > 0 && !accountNumberRegex.test(data.accountNo)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["accountNo"],
        message: "Invalid account number",
      });
    }

    /* ----------------------------------------
     * UAN Validation
     * --------------------------------------*/

    if (data.uanNo && data.uanNo.length > 0 && !uanRegex.test(data.uanNo)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["uanNo"],
        message: "Invalid UAN number",
      });
    }

    /* ----------------------------------------
     * ESIC Validation
     * --------------------------------------*/

    if (data.esicNo && data.esicNo.length > 0 && !esicRegex.test(data.esicNo)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["esicNo"],
        message: "Invalid ESIC number",
      });
    }

    /* ----------------------------------------
     * Pincode Validation
     * --------------------------------------*/

    if (data.pincode && data.pincode.length > 0 && !pincodeRegex.test(data.pincode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pincode"],
        message: "Invalid pincode",
      });
    }

    /* ----------------------------------------
     * Emergency Contact
     * --------------------------------------*/

    if (data.emergencyContactPhone && data.phone && data.emergencyContactPhone === data.phone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["emergencyContactPhone"],
        message: "Emergency contact cannot be the employee's own number",
      });
    }
  });

export function validateCreateUser(formData) {
  const userData = {
    employeeId: formData.get("employeeId"),

    email: formData.get("email"),

    fullName: formData.get("fullName"),

    phone: formData.get("phone"),

    designation: formData.get("designation"),

    department: formData.get("department"),

    employmentType: formData.get("employmentType"),

    workLocation: formData.get("workLocation"),

    dateOfJoining: formData.get("dateOfJoining"),

    gender: formData.get("gender"),

    dateOfBirth: formData.get("dateOfBirth"),

    bloodGroup: formData.get("bloodGroup"),

    fatherName: formData.get("fatherName"),

    motherName: formData.get("motherName"),

    spouseName: formData.get("spouseName"),

    bankName: formData.get("bankName"),

    accountNo: formData.get("accountNo"),

    ifscCode: formData.get("ifscCode"),

    panNumber: formData.get("panNumber"),

    uanNo: formData.get("uanNo"),

    esicNo: formData.get("esicNo"),

    currentAddress: formData.get("currentAddress"),

    permanentAddress: formData.get("permanentAddress"),

    city: formData.get("city"),

    state: formData.get("state"),

    country: formData.get("country"),

    pincode: formData.get("pincode"),

    emergencyContactName: formData.get("emergencyContactName"),

    emergencyContactPhone: formData.get("emergencyContactPhone"),

    emergencyContactRelation: formData.get("emergencyContactRelation"),

    reportingManagerName: formData.get("reportingManagerName"),

    profileImage: formData.get("profileImage"),
  };

  const result = createUserSchema.safeParse(userData);

  if (!result.success) {
    const errors = {};

    result.error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });

    const error = new Error("Validation failed");

    error.errors = errors;

    error.statusCode = 400;

    throw error;
  }

  /* ----------------------------------------------------
   * IMAGE VALIDATION
   * --------------------------------------------------*/

  const image = result.data.profileImage;

  if (image && image.size > 0) {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(image.type)) {
      const error = new Error("Only JPG, JPEG and PNG images are allowed");

      error.statusCode = 400;

      error.errors = {
        profileImage: "Only JPG, JPEG and PNG images are allowed",
      };

      throw error;
    }

    const maxSize = 2 * 1024 * 1024;

    if (image.size > maxSize) {
      const error = new Error("Image size must be less than 2 MB");

      error.statusCode = 400;

      error.errors = {
        profileImage: "Image size must be less than 2 MB",
      };

      throw error;
    }
  }

  return {
    employeeId: result.data.employeeId,

    email: result.data.email.toLowerCase(),

    fullName: clean(result.data.fullName),

    phone: result.data.phone,

    designation: result.data.designation || null,

    department: result.data.department || null,

    employmentType: result.data.employmentType || null,

    workLocation: clean(result.data.workLocation) || null,

    dateOfJoining: result.data.dateOfJoining ? new Date(result.data.dateOfJoining) : null,

    gender: result.data.gender || null,

    dateOfBirth: result.data.dateOfBirth ? new Date(result.data.dateOfBirth) : null,

    bloodGroup: result.data.bloodGroup || null,

    fatherName: clean(result.data.fatherName) || null,

    motherName: clean(result.data.motherName) || null,

    spouseName: clean(result.data.spouseName) || null,

    bankName: clean(result.data.bankName) || null,

    accountNo: result.data.accountNo || null,

    ifscCode: result.data.ifscCode?.toUpperCase() || null,

    panNumber: result.data.panNumber?.toUpperCase() || null,

    uanNo: result.data.uanNo || null,

    esicNo: result.data.esicNo || null,

    currentAddress: clean(result.data.currentAddress) || null,

    permanentAddress: clean(result.data.permanentAddress) || null,

    city: clean(result.data.city) || null,

    state: clean(result.data.state) || null,

    country: clean(result.data.country) || null,

    pincode: result.data.pincode || null,

    emergencyContactName: clean(result.data.emergencyContactName) || null,

    emergencyContactPhone: result.data.emergencyContactPhone || null,

    emergencyContactRelation: clean(result.data.emergencyContactRelation) || null,

    reportingManagerName: clean(result.data.reportingManagerName) || null,

    profileImage: result.data.profileImage,
  };
}
