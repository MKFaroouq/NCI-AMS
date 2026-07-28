const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { Booking }=require('../models/PatientRequest');
const {Clinic } = require('../models/Clinic');
const { getClinics } = require('../controllers/clinicController');
const { validateNationalIdImage }        = require('../middleware/upload');


// adminLogin function to handle admin login requests
async function adminLogin(req, res) {
    try {

        // if theres no data privide from user
        if (!req.body) {
            return res.status(400).json({ 
                error:"please provide request data"
            });
        }      

        // check if the request body contains username and password
        const { username, password } = req.body;

        if (!username || !password) {
            console.log('Missing username or password in request body:', req.body);
            return res.status(400).json({ 
                error: "please provide both username and password" 
            });
        }

        // check admin data that already stored in .env file
        const isUsernameCorrect = username === process.env.ADMIN_USERNAME;
        const isPasswordCorrect = password === process.env.ADMIN_PASSWORD;

        if (!isUsernameCorrect || !isPasswordCorrect) {
            console.log('Invalid login attempt:', { username, password });
            return res.status(401).json({ 
                error: 'username or password is incorrect' 
            });
        }

        // Generate a JWT token for the admin user
        const token = jwt.sign(
            { username, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );
        console.log('Admin login successful, token generated:', token); // token is wrong but add for test cases (trail version)
        console.log('Admin username:', username);
        return res.json({ success: true, token , message: 'Admin login successful' , username: username });

    } catch (error) {
        console.error('Error in adminLogin:', error);
        return res.status(500).json({ 
            error: 'An error occurred while logging in' 
        });
    }
}

// function 2 : craete a booking

async function createBooking(req, res) {
    try {
        // if theres no respond from body (user) 
        if (!req.body) {
            return res.status(400).json({ error: "please enter reqested data !" });
        }

        // fetching data from body that user put it
        const { patientName, nationalId, phoneNumber, governorate, clinicId } = req.body;

        // nationalIdImage بييجي من Multer
        const nationalIdImage = req.file ? req.file.path : null;

        // check if nothing enterd by user
        if (!patientName || !nationalId || !phoneNumber || !governorate || !clinicId) {
            return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
        }

        if (!nationalIdImage) {
            return res.status(400).json({ error: 'يرجى رفع صورة الرقم القومي' });
        }

        // make sure the clinic exists and is active
        const clinic = await Clinic.findById(clinicId);

        if (!clinic) {
            return res.status(404).json({ error: "this clinic does not exist" });
        }

        if (!clinic.isActive) {
            return res.status(400).json({ error: 'the clinic is not active at the moment' });
        }

        // Rate Limit 
        // one week limit — 3 bookings per patient
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const weeklyBookingCount = await Booking.countDocuments({
            nationalId: nationalId,
            status:     { $in: ['pending', 'approved'] },
            createdAt:  { $gte: oneWeekAgo }
        });

        if (weeklyBookingCount >= 3) {
            return res.status(400).json({ 
                error: "sorry, you have reached the maximum number of bookings allowed for this week (3 bookings)"
            });
        }

        // 6. Daily Quota — per Clinic
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const todayBookingsCount = await Booking.countDocuments({
            clinicId: clinicId,
            status:   { $in: ['pending', 'approved'] },
            createdAt: { $gte: startOfToday }
        });

        if (todayBookingsCount >= clinic.quota) {
            return res.status(400).json({ 
                error: 'sorry, the clinic has reached its daily booking limit' 
            });
        }

        // save the new booking to the database
        const newBooking = new Booking({
            patientName,
            nationalId,
            phoneNumber,
            governorate,
            clinicId,
            nationalIdImage,
            status:      'pending',
            queueNumber: null,
            bookingDate: null   // when make the approved by admin, the bookingDate will be set
        });

        await newBooking.save();

        return res.status(201).json({ 
            message: "booking created successfully", 
            booking: newBooking 
        });

    } catch (error) {
        console.error('Error in createBooking:', error);
        return res.status(500).json({ error: "An error occurred while creating the booking" });
    }
}

module.exports = {
    adminLogin,
    createBooking,

};
