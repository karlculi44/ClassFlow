import dayjs from "dayjs";

function formatDate(date) {
  return dayjs(date).format("dddd | M/D/YYYY");
}

export default formatDate;
