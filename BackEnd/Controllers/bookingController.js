const jwt = require('jsonwebtoken');
const {Booking , Counter } =require('../models/PatientRequest');
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

// function 2 : get all bookings

async function getAllBookings(req, res) {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        
        // if theres no bookings
        if (bookings.length === 0) {
            console.log('No bookings found');
            return res.status(404).json({ error: 'No bookings found' });
        }

        // return all booking 
        return res.status(200).json({
             count: bookings.length,
             message: 'Bookings fetched successfully',
             data:{
                bookings: bookings
             }
            });

    } catch (error) {
        return res.status(500).json({ 
            error: 'An error occurred while fetching bookings', msg: error.message
         });
    }
}

// function 3 : approve a booking and assign queue number and booking date

async function approveBooking(req, res) {
    try {
        // get booking id
        const bookingId = req.params.id;

        // find the booking by id
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // only approve if the booking is pending
        if (booking.status !== 'pending') {
            return res.status(400).json({ error: 'Only pending bookings can be approved' });
        }    

        // get today's date
        const today = new Date().toISOString().split('T')[0];

        // create count id
        const counterId = `${booking.clinicId}_${today}`;
 
        // Generate queue number
        const counter = await Counter.findByIdAndUpdate(
            counterId,
            {
                $inc: { seq: 1 }
            },
            {
                new: true,
                upsert: true
            }
        );


        // update the booking status to approved
        booking.queueNumber = counter.seq;
        booking.bookingDate = today;
        booking.status = "approved";

        // save the updated booking
        await booking.save();

        return res.status(200).json({ message: 'Booking approved successfully', booking });
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while approving the booking', msg: error.message });
    }
}

// function 4 : reject a booking

async function rejectBooking(req, res) {
    try {
        // get booking id
        const bookingId = req.params.id;

        // find the booking by id
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // only reject if the booking is pending
        if (booking.status !== 'pending') {
            return res.status(400).json({ error: 'Only pending bookings can be rejected' });
        }    

        // get today's date
        // const today = new Date().toISOString().split('T')[0];


        // update the booking status to rejected

        // booking.queueNumber = null;

        booking.status = "rejected";
        booking.rejectedAt = new Date();


        // save the updated booking
        await booking.save();

        return res.status(200).json({ message: 'Booking rejected successfully', booking });
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while rejecting the booking', msg: error.message });
    }
}

module.exports = {
    createBooking,
    getAllBookings,
    approveBooking,
    rejectBooking
};

