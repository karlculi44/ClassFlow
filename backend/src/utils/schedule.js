const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const normalizeSchedule = ({
  schedule_days,
  schedule_start_time,
  schedule_end_time,
}) => {
  if (!Array.isArray(schedule_days) || schedule_days.length === 0) {
    throw new Error("Select at least one day for the class schedule.");
  }

  const uniqueDays = [...new Set(schedule_days)];
  if (uniqueDays.some((day) => !WEEKDAYS.includes(day))) {
    throw new Error("Schedule contains an invalid weekday.");
  }

  if (!schedule_start_time || !schedule_end_time) {
    throw new Error("Start time and end time are required.");
  }

  if (schedule_start_time >= schedule_end_time) {
    throw new Error("Schedule start time must be earlier than end time.");
  }

  return {
    schedule_days: WEEKDAYS.filter((day) => uniqueDays.includes(day)),
    schedule_start_time,
    schedule_end_time,
  };
};
