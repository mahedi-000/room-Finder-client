export const formatTime12h = (time) => {
  if (!time) return "";

  let [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;

  return `${h}:${m.toString().padStart(2, "0")} ${period}`;
};

export const to24Hour = (time12h) => {
  if (!time12h) return "";

  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

export const to12Hour = (time24) => {
  let [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2, "0")} ${period}`;
};
