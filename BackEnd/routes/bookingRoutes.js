const express=require('express');
const router=express.Router();
const auth = require('../middleware/auth');

const { createBooking , getAllBookings , approveBooking , rejectBooking , exportBookings} = require('../controllers/bookingController');


// POST /api/bookings
// upload.single => only one file will be uploaded with the field name 'nationalIdImage'
router.post('/bookings', createBooking);

// GET /api/bookings
router.get('/bookings', auth , getAllBookings);

// PATCH /api/bookings/:id/approve
router.patch('/bookings/:id/approve', auth, approveBooking);

// PATCH /api/bookings/:id/reject
router.patch('/bookings/:id/reject', auth, rejectBooking);

// Export the booking to excel file
router.post('/bookings/export/:clinicId', auth, exportBookings)

module.exports = router;
