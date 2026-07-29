const express=require('express');
const router=express.Router();
const { createBooking } = require('../Controllers/bookingController');



// POST /api/bookings
// upload.single => only one file will be uploaded with the field name 'nationalIdImage'
router.post('/bookings', createBooking);


module.exports = router;
