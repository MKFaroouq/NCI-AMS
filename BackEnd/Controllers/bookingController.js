const jwt = require('jsonwebtoken');
const {Booking , Counter } =require('../models/PatientRequest');
const Clinic  = require('../models/Clinic');
const ExcelJS = require('exceljs');
const path = require('path');


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

// function 5 : export bookings to excel file

async function exportBookings(req, res) {
    try {
        const clinicId = req.params.clinicId;

        const clinic = await Clinic.findById(clinicId);

        if (!clinic) {
            return res.status(404).json({ error: 'Clinic not found' });
        }
        const countApproved = await Booking.countDocuments({
            status: "approved"
        });

        console.log("Approved:", countApproved);        

        const bookings = await Booking.find({ clinicId , status:"approved"}).populate('clinicId')

        if (bookings.length === 0) {
            return res.status(404).json({ error: 'No approved bookings found for this clinic' });
        }

        // export per clinic
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(clinic.name);

        worksheet.columns = [
            { header: 'Booking ID', key: '_id', width: 30 },
            { header: 'Patient Name', key: 'patientName', width: 30 },
            { header: 'National ID', key: 'nationalId', width: 20 },
            { header: 'Phone Number', key: 'phoneNumber', width: 20 },
            { header: 'Clinic Name', key: 'clinicName', width: 30 },
            { header: 'Queue Number', key: 'queueNumber', width: 15 },
            { header: 'Booking Date', key: 'bookingDate', width: 20 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'National ID Image', key: 'nationalIdImage', width: 30 }
        ];

        // Add rows to the worksheet by using loop into the bookings data
        for (const booking of bookings) {
            worksheet.addRow({
                _id: booking._id.toString(),
                patientName: booking.patientName,
                nationalId: booking.nationalId,
                phoneNumber: booking.phoneNumber,
                clinicName: booking.clinicId.name,
                queueNumber: booking.queueNumber,
                bookingDate: booking.bookingDate,
                status: booking.status,
                nationalIdImage: booking.nationalIdImage ? booking.nationalIdImage : 'N/A' 
            });
        };


            // Update exported bookings
            await Booking.updateMany(
                {
                    clinicId: clinic._id,
                    status: "approved"
                },
                {
                    $set: {
                        status: "exported"
                    }
                }
            );
              

        // console.log(workbook);

        // Generate a unique filename for the Excel file ( clinic name + timestamp)
        const fileName = `${clinic.name}-${Date.now()}.xlsx`;

        const filePath = path.join(__dirname, '..', 'exports', fileName);
        
        //save the workbook to a file => in dir exports
        await workbook.xlsx.writeFile(filePath);

        return res.status(200).json({
            message: "Excel file created successfully",
            fileName,
            msg: "Bookings exported successfully",
            data:{
                count: bookings.length,
                bookings: bookings
            }
        }); 
        
        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error('Error downloading the file:', err);
                res.status(500).send('Error downloading the file');
            }
        });

    } catch (error) {
        res.status(500).json({ error: 'An error occurred while exporting bookings', msg: error.message });
    }
}

    // function 6 : Export all bookings to excel file

    async function exportAllBookings(req, res) {
        try {

        // Get all active clinics
        const clinics = await Clinic.find({ isActive: true });

        if (clinics.length === 0) {
            return res.status(404).json({
                error: "No active clinics found"
            });
        }

        const workbook = new ExcelJS.Workbook();
        // Loop through all clinics
        for (const clinic of clinics) {

            // Create worksheet for each clinic
            const worksheet = workbook.addWorksheet(clinic.name);

            // Worksheet Columns
            worksheet.columns = [
                { header: "Queue Number", key: "queueNumber", width: 15 },
                { header: "Patient Name", key: "patientName", width: 30 },
                { header: "National ID", key: "nationalId", width: 20 },
                { header: "Phone Number", key: "phoneNumber", width: 20 },
                { header: "Booking Date", key: "bookingDate", width: 20 },
                { header: "Status", key: "status", width: 15 }
            ];

            // Get approved bookings for this clinic
            const bookings = await Booking.find({
                clinicId: clinic._id,
                status: "approved"
            });

            console.log("Clinic:", clinic.name);
            console.log("Bookings Count:", bookings.length);

            // Skip if no bookings
            if (bookings.length === 0) {
                continue;
            }
            // Add rows
            for (const booking of bookings) {
                worksheet.addRow({
                    queueNumber: booking.queueNumber,
                    patientName: booking.patientName,
                    nationalId: booking.nationalId,
                    phoneNumber: booking.phoneNumber,
                    bookingDate: booking.bookingDate,
                    status: booking.status
                });
            }

            // Update exported bookings
            await Booking.updateMany(
                {
                    clinicId: clinic._id,
                    status: "approved"
                },
                {
                    $set: {
                        status: "exported"
                    }
                }
            );
        }

        // File name
        const fileName = `NCI-Q-${Date.now()}.xlsx`;
        const filePath = path.join(__dirname, '..', 'exports', fileName);

        // Save workbook
        await workbook.xlsx.writeFile(filePath);

        // Download file
            res.download(filePath, fileName, (err) => {
            if (err) {
                console.error('Error downloading the file:', err);
                res.status(500).send('Error downloading the file');
            }
        });

        console.log(filePath);

    } catch (error) {

        return res.status(500).json({
            error: "An error occurred while exporting bookings",
            msg: error.message
        });

    }
            
}

// function 7 : delete a booking

async function deleteBooking(req, res) {
    try {
        const bookingId = req.params.id;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                error: "Booking not found"
            });
        }

        // delete booking
        await Booking.findByIdAndDelete(bookingId);

        // only pending or rejected bookings can be deleted
        if (!["pending", "rejected"].includes(booking.status)) {
            return res.status(400).json({
                error: "Only pending or rejected bookings can be deleted"
            });
}
        // success response
        return res.status(200).json({
            message: "Booking deleted successfully"
        });


    } catch (error) {
        return res.status(500).json({
            error: "An error occurred while deleting the booking",
            msg: error.message
        });
    }
}

module.exports = {
    createBooking,
    getAllBookings,
    approveBooking,
    rejectBooking,
    exportBookings,
    exportAllBookings,
    deleteBooking
};

