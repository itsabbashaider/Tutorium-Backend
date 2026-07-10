const combineBookingDateTime = (
  booking_date,
  time
) => {
  return new Date(
    `${booking_date}T${time}`
  );
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