const express = require('express');
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingsByUserId,
  getBookingsByServicemanId,
  completeBooking,
  cancelBooking,
  getBookingsByStatus,
  getAvailableTimeSlots,
  getUserUpcomingBookingsByBookingDate,
  getServicemanUpcomingBookingsByBookingDate,
  getUpcomingBookingsCount,
  getCompletedBookingsCount,
  getCancelledBookingsCount,
  getAllBookingsCounts
} = require('../controller/bookingController');




// POST - Create new booking
router.post('/createbooking', createBooking);

// GET - All bookings
router.get('/allbookings', getAllBookings);

// GET - Single booking by ID
router.get('/specificbookings/:id', getBookingById);

// GET - all booking by userID

router.get('/allbookings/user/:userId', getBookingsByUserId);

// GET - all booking by SERVICEID

router.get('/allbookings/serviceman/:servicemanId', getBookingsByServicemanId);

router.put('/specificbooking/:id/complete', completeBooking);

router.put('/specificbooking/:id/cancel', cancelBooking);

// Get bookings by status
router.get('/allbookings/status/:status', getBookingsByStatus);

router.get('/available-slots/:servicemanId/:date', getAvailableTimeSlots);

router.get('/created/:userId/:date', getUserUpcomingBookingsByBookingDate);

router.get('/servicecreated/:servicemanId/:date',getServicemanUpcomingBookingsByBookingDate)

// GET - Count upcoming bookings

// router.get('/count/upcoming/:servicemanId', getUpcomingBookingsCount);

// // GET - Count completed bookings
// router.get('/count/completed/:servicemanId', getCompletedBookingsCount);

// // GET - Count cancelled bookings
// router.get('/count/cancelled/:servicemanId', getCancelledBookingsCount);

// GET - All booking counts (BONUS: Get all counts in one call)
router.get('/count/all/:servicemanId', getAllBookingsCounts);


module.exports = router;
