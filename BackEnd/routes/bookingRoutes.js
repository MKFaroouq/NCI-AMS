const express = require('express');
const router  = express.Router();
const { adminLogin } = require('../controllers/bookingController');

// POST /api/auth/login
router.post('/auth/login', adminLogin);

module.exports = router;