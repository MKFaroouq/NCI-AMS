const express=require('express');
const router=express.Router();
const { adminLogin } = require("../controllers/authController");


// POST /api/auth/login - check app.js for the route prefix
router.post('/login', adminLogin);

module.exports = router;
