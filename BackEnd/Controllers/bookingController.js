const jwt = require('jsonwebtoken');
const {Booking} =require('../models/PatientRequest');
const Clinic  = require('../models/Clinic');


// function 1 : craete a booking

async function createBooking(req, res) {
    try {
        // if there's no data privide from user at all
        if (!req.body) {
            return res.status(400).json({ error: 'Please provide booking data' });
        }

        // fetch the required fields from the request body
        const { patientName, nationalId, phoneNumber, clinicId } = req.body;


        // Validation — data validation for required fields
        if (!patientName || !nationalId || !phoneNumber || !clinicId ) {
            return res.status(400).json({ error: "all fields are required" });
        }


        // make sure the clinic exists and is active
        const clinic = await Clinic.findById(clinicId);

        if (!clinic) {
            return res.status(404).json({ error: "clinic not found" });
        }

        if (!clinic.isActive) {
            return res.status(400).json({ error: "clinic is not active" });
        }

        // Rate Limit - only 3 bookings per week per national ID
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const weeklyBookingCount = await Booking.countDocuments({
            nationalId: nationalId,
            status:     { $in: ['pending', 'approved'] },
            createdAt:  { $gte: oneWeekAgo }
        });

        if (weeklyBookingCount >= 3) {
            return res.status(400).json({ 
                error: 'Sorry, you have reached the maximum limit (3 bookings in a week)' 
            });
        }

        // 8. Daily Quota — per Clinic
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const todayBookingsCount = await Booking.countDocuments({
            clinicId: clinicId,
            status:   { $in: ['pending', 'approved'] },
            createdAt: { $gte: startOfToday }
        });

        if (todayBookingsCount >= clinic.quota) {
            return res.status(400).json({ 
                error: 'Sorry, the clinic has reached its daily booking limit' 
            });
        }

        // save the new booking to the database
        const newBooking = new Booking({
            patientName,
            nationalId,
            phoneNumber,
            clinicId,
            status:      'pending',
            queueNumber: null,
            bookingDate: null
        });

        await newBooking.save();

        return res.status(201).json({ 
            message: 'Booking created successfully — under review', 
            booking: newBooking 
        });

    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while creating the booking' , msg: error.message});
    }
}

module.exports = {
    createBooking,

};
