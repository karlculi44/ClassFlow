export const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const normalizeDays = (days) => {
  let parsedDays = days;
  if (typeof days === "string") {
    try {
      parsedDays = JSON.parse(days);
    } catch {
      parsedDays = [];
    }
  }

  return WEEKDAYS.filter(
    (day) => Array.isArray(parsedDays) && parsedDays.includes(day),
  );
};

export const formatTime = (time) => {
  if (!time) return "";
  const [hours, minutes] = String(time).split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return "";
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
};

export const formatSchedule = (classItem) => {
  const days = normalizeDays(classItem?.schedule_days);
  if (
    !days.length ||
    !classItem?.schedule_start_time ||
    !classItem?.schedule_end_time
  ) {
    return "Schedule pending";
  }

  const dayLabel =
    days.length === WEEKDAYS.length
      ? "Daily"
      : days.length === 1
        ? days[0]
        : days.length === 2
          ? `${days[0]} & ${days[1]}`
          : `${days.slice(0, -1).join(", ")} & ${days.at(-1)}`;

  return `${dayLabel} • ${formatTime(classItem.schedule_start_time)} – ${formatTime(classItem.schedule_end_time)}`;
};
