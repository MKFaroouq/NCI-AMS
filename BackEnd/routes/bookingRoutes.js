const express=require('express');
const router=express.Router();
const auth = require('../middleware/auth');

<<<<<<< HEAD
const { createBooking , getAllBookings , approveBooking , rejectBooking } = require('../controllers/bookingController');
=======
const { createBooking , getAllBookings } = require('../controllers/bookingController');
>>>>>>> 1a6763987e21ba554c9d416a733bc657fdfdabbb


// POST /api/bookings
// upload.single => only one file will be uploaded with the field name 'nationalIdImage'
router.post('/bookings', createBooking);

// GET /api/bookings
router.get('/bookings', auth , getAllBookings);

<<<<<<< HEAD
// PATCH /api/bookings/:id/approve
router.patch('/bookings/:id/approve', auth, approveBooking);

// PATCH /api/bookings/:id/reject
router.patch('/bookings/:id/reject', auth, rejectBooking);
=======
>>>>>>> 1a6763987e21ba554c9d416a733bc657fdfdabbb

module.exports = router;
