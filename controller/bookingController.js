const dayjs = require('dayjs');
const ServiceMan = require('../db/models/serviceman');
const Booking = require('../db/models/booking');
const User= require("../db/models/user");
const { Op } = require('sequelize'); // ✅ Correct way


const createBooking = async (req, res) => {
  const { nanoid } = await import('nanoid');
  const customId = 'book_' + nanoid(10);

  try {
    const {
      servicemanId,
      serviceManName,
      userId,
      userName,
      serviceType,
      serviceOptions,
      location,
      paid,
      status,
      bookingDateTime // should be ISO string like "2025-07-05T09:00:00"
    } = req.body;

    // Validate serviceman and user exist
    const servicemanExists = await ServiceMan.findByPk(servicemanId);
    if (!servicemanExists) {
      return res.status(404).json({ message: 'ServiceMan not found.' });
    }

    const userExists = await User.findByPk(userId);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found.' });
    }

  const bookingDate = new Date(bookingDateTime);
    if (isNaN(bookingDate)) {
      return res.status(400).json({ message: 'Invalid bookingDateTime format.' });
    }


    const newBooking = await Booking.create({
      id: customId,
      servicemanId,
      serviceManName,
      userId,
      userName,
      serviceType,
      serviceOptions,
      location,
      paid: paid ?? false,
     status,
      bookingDateTime: bookingDate,

      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({
      message: 'Booking created successfully.',
      booking: newBooking
    });

  } catch (error) {
    console.error('Booking Creation Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Get All Bookings Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }
    res.status(200).json({ booking });
  } catch (error) {
    console.error('Get Booking Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const getBookingsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.findAll({ where: { userId } });

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this user.' });
    }

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings for user:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const getBookingsByServicemanId = async (req, res) => {
  try {
    const { servicemanId } = req.params;
    const bookings = await Booking.findAll({ where: { servicemanId } });

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this serviceman.' });
    }

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings for serviceman:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const completeBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    booking.status = 'completed';
    await booking.save();

    res.status(200).json({
      message: 'Booking marked as completed.',
      booking
    });
  } catch (error) {
    console.error('Complete Booking Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      message: 'Booking cancelled successfully.',
      booking
    });
  } catch (error) {
    console.error('Cancel Booking Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const getBookingsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const validStatuses = ['upcoming', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status type.' });
    }

    const bookings = await Booking.findAll({ where: { status } });

    if (bookings.length === 0) {
      return res.status(404).json({ message: `No ${status} bookings found.` });
    }

    res.status(200).json({ bookings });
  } catch (error) {
    console.error(`Error fetching ${req.params.status} bookings:`, error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const getAvailableTimeSlots = async (req, res) => {
  const { servicemanId, date } = req.params;

  try {
    const allSlots = [
      '9 AM', '10 AM', '11 AM', '12 PM',
      '1 PM', '2 PM', '3 PM', '4 PM', '5 PM',
      '6 PM','7 PM' ,'8 PM','9 PM','10 PM','11 PM','12 AM',
      '1 AM','2 AM'
    ];

    // Fetch all upcoming bookings of serviceman
    const bookings = await Booking.findAll({
      where: {
        servicemanId,
        status: 'upcoming'
      }
    });

    // Filter and extract booked slots for the specific date
    const bookedSlots = bookings
      .filter(b => dayjs(b.bookingDateTime).format('YYYY-MM-DD') === date)
      .map(b => dayjs(b.bookingDateTime).format('h A')); // slot time only

    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.status(200).json({
      date,
      availableSlots
    });

  } catch (error) {
    console.error('Slot check error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


const getUserUpcomingBookingsByBookingDate = async (req, res) => {
  try {
    const { userId, date } = req.params;

    if (!dayjs(date, 'YYYY-MM-DD', true).isValid()) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    const startOfDay = dayjs(date).startOf('day').toDate();
    const endOfDay = dayjs(date).endOf('day').toDate();

    const bookings = await Booking.findAll({
      where: {
        userId,
        status: 'upcoming',
        bookingDateTime: {
          [Op.gte]: startOfDay,
          [Op.lte]: endOfDay
        }
      }
    });

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No upcoming bookings for this user on this date.' });
    }

    res.status(200).json({ bookings });

  } catch (error) {
    console.error('Error fetching user bookings by bookingDateTime:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};




module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingsByUserId,
  getBookingsByServicemanId,
  cancelBooking,
  completeBooking,
  getBookingsByStatus,
  getAvailableTimeSlots,
  getUserUpcomingBookingsByBookingDate
};
