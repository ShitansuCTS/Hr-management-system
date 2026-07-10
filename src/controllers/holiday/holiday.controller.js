import { validateCreateHoliday } from "@/validations/holiday.validation";
import { createHolidayService, getHolidayService } from "@/services/holiday/holiday.service";

export async function createHoldidayController(body, currentUser) {
  const holidayData = validateCreateHoliday(body);

  const holiday = await createHolidayService(holidayData, currentUser);

  return {
    success: true,
    message: "Holiday created successfully",
    data: holiday,
  };
}

export async function getHolidayController(currentUser) {
  const holidays = await getHolidayService(currentUser);

  return {
    success: true,
    message: "Holiday list fetched successfully",
    data: holidays,
  };
}
