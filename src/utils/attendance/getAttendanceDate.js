const ATTENDANCE_TIME_ZONE = process.env.ATTENDANCE_TIME_ZONE || "Asia/Kolkata";

export function getAttendanceDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: ATTENDANCE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const dateParts = Object.fromEntries(parts.map(({ type, value }) => [type, value]));

  return new Date(
    Date.UTC(Number(dateParts.year), Number(dateParts.month) - 1, Number(dateParts.day))
  );
}

export function formatWorkingDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}
