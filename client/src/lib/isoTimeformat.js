const formatISODate = (dateString) => {
  const date = new Date(dateString);
  const localTime = date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return localTime;
};

export default formatISODate;