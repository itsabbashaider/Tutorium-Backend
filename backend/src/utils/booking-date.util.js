const combineBookingDateTime = (booking_date, time) => {
  const date = new Date(booking_date);

  const [hours, minutes, seconds = "00"] = time.split(":");

  date.setHours(
    Number(hours),
    Number(minutes),
    Number(seconds),
    0
  );

  return date;
};

const isBookingInPast = (
  booking_date
) => {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const bookingDate = new Date(
    booking_date
  );

  bookingDate.setHours(0, 0, 0, 0);

  return bookingDate < today;
};

const isMatchingAvailabilityDay = (
  booking_date,
  availability
) => {
  const bookingDay = new Date(
    booking_date
  ).getDay();

  return (
    bookingDay ===
    availability.day_of_week
  );
};

const hasBookingEnded = (booking_end) => {
  return new Date() >= new Date(booking_end);
};

module.exports = {
  combineBookingDateTime,
  isBookingInPast,
  isMatchingAvailabilityDay,
  hasBookingEnded,
};