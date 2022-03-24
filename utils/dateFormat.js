// I stubbornly chose not to import a date utility and instead built my own specific one for this project.

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const dayWithSuffix = (day) =>
  day > 3
    ? day + "th"
    : day == 3
    ? day + "rd"
    : day == 2
    ? day + "nd"
    : day + "st";

const timeFormat = (hours, minutes, isPM) => {
  while (hours > 11) hours -= 12;
  if (minutes < 10) minutes = "0" + minutes;
  return `${hours}:${minutes} ${isPM ? "pm" : "am"}`;
};

function dateFormat(dateIn) {
  const d = new Date(dateIn);
  return `${months[d.getMonth()]} ${dayWithSuffix(
    d.getDate()
  )}, ${d.getFullYear()} at ${timeFormat(
    d.getHours(),
    d.getMinutes(),
    d.getHours() > 11
  )}`;
}

module.exports = dateFormat;
