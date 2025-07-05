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
  getUserUpcomingBookingsByBookingDate
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

module.exports = router;
