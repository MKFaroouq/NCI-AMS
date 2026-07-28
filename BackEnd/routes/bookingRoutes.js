const express=require('express');
const router=express.Router();
const { adminLogin , createBooking } = require('../Controllers/bookingController');
const { upload } = require('../middleware/upload');


// POST /api/auth/login
router.post('/auth/login', adminLogin);

// POST /api/bookings
// upload.single => only one file will be uploaded with the field name 'nationalIdImage'
router.post('/bookings', upload.single('nationalIdImage'), createBooking);
module.exports = router;
