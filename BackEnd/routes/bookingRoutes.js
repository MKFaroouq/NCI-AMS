const express=require('express');
const router=express.Router();
const auth = require('../middleware/auth');

const { createBooking , getAllBookings } = require('../controllers/bookingController');


// POST /api/bookings
// upload.single => only one file will be uploaded with the field name 'nationalIdImage'
router.post('/bookings', createBooking);

// GET /api/bookings
router.get('/bookings', auth , getAllBookings);


module.exports = router;
