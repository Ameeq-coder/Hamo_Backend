const dayjs = require('dayjs');
const ServiceMan = require('../db/models/serviceman');
const Booking = require('../db/models/booking');
const User= require("../db/models/user");
const UserDetail=require('../db/models/userdetails')
const ServiceDetail=require('../db/models/servicedetail')
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
      bookingDateTime ,
        startTime,
  endTime,
  price
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
startTime,
  endTime,
  price,
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

    const bookings = await Booking.findAll({
      where: { userId },
      include: [
        {
          model: ServiceMan,
          as: 'serviceman',
          include: [
            {
              model: ServiceDetail,
              as: 'detail',
              attributes: ['imageUrl', 'category', 'location'] // ✅ Add what you want
            }
          ]
        }
      ]
    });

    if (!bookings.length) {
      return res.status(404).json({ message: 'No bookings found for this user.' });
    }

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const getBookingsByServicemanId = async (req, res) => {
  try {
    const { servicemanId } = req.params;

    const bookings = await Booking.findAll({
      where: { servicemanId },
      include: [
        {
          model: User,
          as: 'user',
          include: [
            {
              model: UserDetail,
              as: 'details',
              attributes: ['imageUrl', 'name', 'address'] // You can adjust these
            }
          ]
        }
      ]
    });

    if (!bookings.length) {
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
      '6 PM', '7 PM', '8 PM', '9 PM', '10 PM',
      '11 PM', '12 AM', '1 AM', '2 AM'
    ];

    const bookings = await Booking.findAll({
      where: {
        servicemanId,
        status: 'upcoming'
      }
    });

    const bookedSlots = new Set();

    bookings.forEach(booking => {
      const bookingDate = dayjs(booking.bookingDateTime).format('YYYY-MM-DD');

      if (bookingDate === date) {
        const start = dayjs(`${date} ${booking.startTime}`, 'YYYY-MM-DD h A');
        const end = dayjs(`${date} ${booking.endTime}`, 'YYYY-MM-DD h A');

        if (!start.isValid() || !end.isValid()) {
          console.warn(`Invalid time format for booking ID ${booking.id}`);
          return;
        }

        for (
          let time = start.clone();
          time.isBefore(end);
          time = time.add(1, 'hour')
        ) {
          const slotLabel = time.format('h A'); // Example: "9 PM"
          bookedSlots.add(slotLabel);
        }
      }
    });

    const availableSlots = allSlots.filter(slot => !bookedSlots.has(slot));

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
      },
      include: [
        {
          model: ServiceMan,
          as: 'serviceman',
          attributes: ['id', 'email', 'serviceType'],
          include: [
            {
              model: ServiceDetail,
              as: 'detail',
              attributes: ['imageUrl', 'category', 'location']
            }
          ]
        }
      ]
    });

    if (!bookings.length) {
      return res.status(404).json({ message: 'No upcoming bookings for this user on this date.' });
    }

    res.status(200).json({ bookings });

  } catch (error) {
    console.error('Error fetching user bookings by bookingDateTime:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


const getServicemanUpcomingBookingsByBookingDate = async (req, res) => {
  try {
    const { servicemanId, date } = req.params;

    if (!dayjs(date, 'YYYY-MM-DD', true).isValid()) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    const startOfDay = dayjs(date).startOf('day').toDate();
    const endOfDay = dayjs(date).endOf('day').toDate();

    const bookings = await Booking.findAll({
      where: {
        servicemanId,
        status: 'upcoming',
        bookingDateTime: {
          [Op.gte]: startOfDay,
          [Op.lte]: endOfDay
        }
      },
      include: [
        {
          model: User,
          as: 'user',
          include: [
            {
              model: UserDetail,
              as: 'details',
              attributes: ['name', 'imageUrl', 'address']
            }
          ]
        }
      ]
    });

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No upcoming bookings for this serviceman on this date.' });
    }

    res.status(200).json({ bookings });

  } catch (error) {
    console.error('Error fetching serviceman bookings by date:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// const getUpcomingBookingsCount = async (req, res) => {





//   try {
//     const { servicemanId } = req.params;
    
//     const whereCondition = servicemanId 
//       ? { status: 'upcoming', servicemanId }
//       : { status: 'upcoming' };

//     const count = await Booking.count({
//       where: whereCondition
//     });

//     res.status(200).json({
//       status: 'upcoming',
//       servicemanId: servicemanId || 'all',
//       count
//     });
//   } catch (error) {
//     console.error('Error counting upcoming bookings:', error);
//     res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// };

// // Count completed bookings (Global or by ServicemanId)
// const getCompletedBookingsCount = async (req, res) => {
//   try {
//     const { servicemanId } = req.params;
    
//     const whereCondition = servicemanId 
//       ? { status: 'completed', servicemanId }
//       : { status: 'completed' };

//     const count = await Booking.count({
//       where: whereCondition
//     });

//     res.status(200).json({
//       status: 'completed',
//       servicemanId: servicemanId || 'all',
//       count
//     });
//   } catch (error) {
//     console.error('Error counting completed bookings:', error);
//     res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// };

// const getCancelledBookingsCount = async (req, res) => {
//   try {
//     const { servicemanId } = req.params;
    
//     const whereCondition = servicemanId 
//       ? { status: 'cancelled', servicemanId }
//       : { status: 'cancelled' };

//     const count = await Booking.count({
//       where: whereCondition
//     });

//     res.status(200).json({
//       status: 'cancelled',
//       servicemanId: servicemanId || 'all',
//       count
//     });
//   } catch (error) {
//     console.error('Error counting cancelled bookings:', error);
//     res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// };

// Get all counts in one API call (Global or by ServicemanId)


const getAllBookingsCounts = async (req, res) => {
  try {
    const { servicemanId } = req.params;
    
    const whereConditions = servicemanId ? {
      upcoming: { status: 'upcoming', servicemanId },
      completed: { status: 'completed', servicemanId },
      cancelled: { status: 'cancelled', servicemanId }
    } : {
      upcoming: { status: 'upcoming' },
      completed: { status: 'completed' },
      cancelled: { status: 'cancelled' }
    };

    const [upcomingCount, completedCount, cancelledCount] = await Promise.all([
      Booking.count({ where: whereConditions.upcoming }),
      Booking.count({ where: whereConditions.completed }),
      Booking.count({ where: whereConditions.cancelled })
    ]);

    res.status(200).json({
      servicemanId: servicemanId || 'all',
      counts: {
        upcoming: upcomingCount,
        completed: completedCount,
        cancelled: cancelledCount,
        total: upcomingCount + completedCount + cancelledCount
      }
    });
  } catch (error) {
    console.error('Error counting all bookings:', error);
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
  getUserUpcomingBookingsByBookingDate,
  getServicemanUpcomingBookingsByBookingDate,
  // getUpcomingBookingsCount,
  // getCompletedBookingsCount,
  // getCancelledBookingsCount,
  getAllBookingsCounts
};
