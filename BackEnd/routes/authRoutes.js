const express=require('express');
const router=express.Router();
const { login } = require("../controllers/authController");


// POST /api/auth/login - check app.js for the route prefix
router.post('/login', login);

module.exports = router;
