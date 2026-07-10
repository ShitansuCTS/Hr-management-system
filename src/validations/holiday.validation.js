import { z } from "zod";

const createHolidaySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Holiday name is required")
    .max(30, "Holiday name must not exceed 30 characters")
    .regex(
      /^[A-Za-z0-9][A-Za-z0-9\s&()'/-]*$/,
      "Holiday name must start with an alphabet or number"
    ),

  date: z
    .string()
    .min(1, "Holiday date is required"),

  type: z
    .string()
    .trim()
    .min(1, "Holiday type is required"),

  description: z
    .string()
    .trim()
    .max(
      100,
      "Description must not exceed 100 characters"
    )
    .optional(),
})
.superRefine((data, ctx) => {

  const today = new Date();

  today.setHours(0,0,0,0);

  const tomorrow = new Date(today);

  tomorrow.setDate(today.getDate()+1);

  const holidayDate = new Date(data.date);

  holidayDate.setHours(0,0,0,0);

  if(isNaN(holidayDate.getTime())){

      ctx.addIssue({
          code:z.ZodIssueCode.custom,
          path:["date"],
          message:"Invalid holiday date"
      });

      return;

  }

  if(holidayDate < tomorrow){

      ctx.addIssue({
          code:z.ZodIssueCode.custom,
          path:["date"],
          message:"Holiday date must be tomorrow or a future date"
      });

  }

});

export function validateCreateHoliday(body){

    const result =
        createHolidaySchema.safeParse(body);

    if(!result.success){

        const errors={};

        result.error.issues.forEach(issue=>{

            errors[issue.path[0]]=issue.message;

        });

        const error =
            new Error("Validation failed");

        error.errors=errors;

        error.statusCode=400;

        throw error;

    }

    return result.data;

}