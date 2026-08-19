const jwt = require('jsonwebtoken');
const {Booking , Counter } =require('../models/PatientRequest');
const Clinic  = require('../models/Clinic');
const { getTodayDateString } = require("../utils/dateUtils");
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

        const cleanphoneNumber = phoneNumber.replace(/\D/g, "");   
        const cleanNationalId = nationalId.replace(/\D/g, "");

        console.log(req.body);
        console.log("Phone:", req.body.phoneNumber);


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

        if (todayBookingsCount >= clinic.dailyQuota) {
            return res.status(400).json({ 
                error: 'Sorry, the clinic has reached its daily booking limit' 
            });
        }

        console.log(/^01[0125]\d{8}$/.test(req.body.phoneNumber));

        // save the new booking to the database
        const newBooking = new Booking({
            patientName,
            nationalId : cleanNationalId,
            phoneNumber: cleanphoneNumber,
            clinicId,
            status:      'pending',
            queueNumber: null,
            // bookingDate: null
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
        const bookings = await Booking.find().populate('clinicId', 'name').sort({ createdAt: -1 });
        
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

// async function approveBooking(req, res) {
//     try {
//         // get booking id
//         const bookingId = req.params.id;

//         // find the booking by id
//         const booking = await Booking.findById(bookingId);

//         if (!booking) {
//             return res.status(404).json({ error: 'Booking not found' });
//         }

//         // only approve if the booking is pending
//         if (booking.status !== 'pending') {
//             return res.status(400).json({ error: 'Only pending bookings can be approved' });
//         }    

//         // get today's date
//         const today = new Date().toISOString().split('T')[0];

//         // create count id
//         const counterId = `${booking.clinicId}_${today}`;
 
//         // Generate queue number
//         const counter = await Counter.findByIdAndUpdate(
//             counterId,
//             {
//                 $inc: { seq: 1 }
//             },
//             {
//                 new: true,
//                 upsert: true
//             }
//         );


//         // update the booking status to approved
//         booking.queueNumber = counter.seq;
//         booking.bookingDate = today;
//         booking.status = "approved";

//         // save the updated booking
//         await booking.save();

//         return res.status(200).json({ message: 'Booking approved successfully', booking });
//     } catch (error) {
//         return res.status(500).json({ error: 'An error occurred while approving the booking', msg: error.message });
//     }
// }

// async function approveBooking(req, res) {
//     try {
//         // =========================
//         // Get Booking ID
//         // =========================
//         const bookingId = req.params.id;

//         // =========================
//         // Find Booking
//         // =========================
//         const booking = await Booking.findById(bookingId);

//         if (!booking) {
//             return res.status(404).json({
//                 error: "Booking not found"
//             });
//         }

//         // =========================
//         // Check Booking Status
//         // =========================
//         if (booking.status !== "pending") {
//             return res.status(400).json({
//                 error: "Only pending bookings can be approved"
//             });
//         }

//         // =========================
//         // Get Today's Date
//         // =========================
//         const today = new Date();

//         // Create a date without time
//         today.setHours(0, 0, 0, 0);

//         // =========================
//         // Create Counter ID
//         // =========================
//         const dateString = today.toISOString().split("T")[0];

//         const counterId = `${booking.clinicId}_${dateString}`;

//         // =========================
//         // Generate Queue Number
//         // =========================
//         const counter = await Counter.findOneAndUpdate(
//             {
//                 _id: counterId
//             },
//             {
//                 $inc: {
//                     seq: 1
//                 }
//             },
//             {
//                 upsert: true,
//                 returnDocument: "after"
//             }
//         );

//         // =========================
//         // Update Booking
//         // =========================
//         booking.queueNumber = counter.seq;
//         booking.bookingDate = today;
//         booking.status = "approved";

//         // =========================
//         // Save Booking
//         // =========================
//         await booking.save();

//         // =========================
//         // Response
//         // =========================
//         return res.status(200).json({
//             success: true,
//             message: "Booking approved successfully",
//             booking: booking
//         });

//     } catch (error) {

//         console.error("Approve Booking Error:", error);

//         return res.status(500).json({
//             error: "An error occurred while approving the booking",
//             message: error.message
//         });
//     }
// }


// ============================================================
// Function : Approve a single booking
// ============================================================

// async function approveBooking(req, res) {
//     try {

//         // ========================================================
//         // 1. Get Booking ID
//         // ========================================================

//         const bookingId = req.params.id;

//         // ========================================================
//         // 2. Find Booking
//         // ========================================================

//         const booking = await Booking.findById(bookingId);

//         if (!booking) {
//             return res.status(404).json({
//                 error: "Booking not found"
//             });
//         }

//         // ========================================================
//         // 3. Only pending bookings can be approved
//         // ========================================================

//         if (booking.status !== "pending") {
//             return res.status(400).json({
//                 error: "Only pending bookings can be approved"
//             });
//         }

//         // ========================================================
//         // 4. Get Clinic
//         // ========================================================

//         const clinic = await Clinic.findById(
//             booking.clinicId
//         );

//         if (!clinic) {
//             return res.status(404).json({
//                 error: "Clinic not found"
//             });
//         }

//         // ========================================================
//         // 5. Check Clinic status
//         // ========================================================

//         if (!clinic.isActive) {
//             return res.status(400).json({
//                 error: "Clinic is not active"
//             });
//         }

//         // ========================================================
//         // 6. Validate daily quota
//         // ========================================================

//         if (
//             typeof clinic.dailyQuota !== "number" ||
//             clinic.dailyQuota < 0
//         ) {
//             return res.status(500).json({
//                 error: "Invalid clinic daily quota"
//             });
//         }

//         // ========================================================
//         // 7. Get today's date
//         // Format: YYYY-MM-DD
//         // ========================================================

//         // const today = new Date();

//         // today.setHours(0, 0, 0, 0);

//         // const dateString =
//         //     today.toISOString().split("T")[0];

//         const dateString = getTodayDateString();
//         // ========================================================
//         // 8. Count today's approved/exported bookings
//         // ========================================================

//         const usedQuota = await Booking.countDocuments({
//             clinicId: booking.clinicId,
//             bookingDate: dateString,
//             status: {
//                 $in: ["approved", "exported"]
//             }
//         });

//         // ========================================================
//         // 9. Check if clinic quota is full
//         // ========================================================

//         if (usedQuota >= clinic.dailyQuota) {
//             return res.status(400).json({
//                 error: "Daily quota has been reached",
//                 dailyQuota: clinic.dailyQuota,
//                 usedQuota
//             });
//         }

//         // ========================================================
//         // 10. Create Counter ID
//         //
//         // Same format used by approveAllBookings()
//         // ========================================================
//         const today = getTodayDateString();


//         const counterId =
//             `${booking.clinicId.toString()}_${dateString}`;

//         // ========================================================
//         // 11. Generate next queue number atomically
//         // ========================================================

//         const counter = await Counter.findOneAndUpdate(
//             {
//                 _id: counterId
//             },
//             {
//                 $inc: {
//                     seq: 1
//                 }
//             },
//             {
//                 upsert: true,
//                 new: true
//             }
//         );

//         if (!counter) {
//             throw new Error(
//                 "Failed to generate queue number"
//             );
//         }

//         // ========================================================
//         // 12. Safety check
//         //
//         // Counter must never exceed daily quota.
//         // ========================================================

//         if (counter.seq > clinic.dailyQuota) {

//             // Roll back counter increment
//             await Counter.findOneAndUpdate(
//                 {
//                     _id: counterId
//                 },
//                 {
//                     $inc: {
//                         seq: -1
//                     }
//                 }
//             );

//             return res.status(400).json({
//                 error: "Daily quota has been reached",
//                 dailyQuota: clinic.dailyQuota,
//                 usedQuota
//             });
//         }

//         // ========================================================
//         // 13. Update Booking
//         // ========================================================

//         booking.queueNumber = counter.seq;
//         booking.bookingDate = dateString;
//         booking.status = "approved";

//         // ========================================================
//         // 14. Save Booking
//         // ========================================================

//         await booking.save();

//         // ========================================================
//         // 15. Response
//         // ========================================================

//         return res.status(200).json({
//             success: true,
//             message: "Booking approved successfully",

//             booking
//         });

//     } catch (error) {

//         console.error(
//             "Approve Booking Error:",
//             error
//         );

//         return res.status(500).json({
//             error:
//                 "An error occurred while approving the booking",

//             message: error.message
//         });
//     }
// }

// async function approveBooking(req, res) {
//     try {

//         // ========================================================
//         // 1. Get Booking ID
//         // ========================================================

//         const bookingId = req.params.id;

//         // ========================================================
//         // 2. Find Booking
//         // ========================================================

//         const booking = await Booking.findById(bookingId);

//         if (!booking) {
//             return res.status(404).json({
//                 error: "Booking not found"
//             });
//         }

//         // ========================================================
//         // 3. Only pending bookings can be approved
//         // ========================================================

//         if (booking.status !== "pending") {
//             return res.status(400).json({
//                 error: "Only pending bookings can be approved"
//             });
//         }

//         // ========================================================
//         // 4. Get Clinic
//         // ========================================================

//         const clinic = await Clinic.findById(
//             booking.clinicId
//         );

//         if (!clinic) {
//             return res.status(404).json({
//                 error: "Clinic not found"
//             });
//         }

//         // ========================================================
//         // 5. Check Clinic status
//         // ========================================================

//         if (!clinic.isActive) {
//             return res.status(400).json({
//                 error: "Clinic is not active"
//             });
//         }

//         // ========================================================
//         // 6. Validate daily quota
//         // ========================================================

//         if (
//             typeof clinic.dailyQuota !== "number" ||
//             clinic.dailyQuota < 1
//         ) {
//             return res.status(500).json({
//                 error: "Invalid clinic daily quota"
//             });
//         }

//         // ========================================================
//         // 7. Validate used quota
//         // ========================================================

//         if (
//             typeof clinic.usedQuota !== "number" ||
//             clinic.usedQuota < 0
//         ) {
//             return res.status(500).json({
//                 error: "Invalid clinic used quota"
//             });
//         }

//         // ========================================================
//         // 8. Get today's date
//         // ========================================================

//         const dateString = getTodayDateString();

//         // ========================================================
//         // 9. Atomically reserve one quota slot
//         //
//         // IMPORTANT:
//         // usedQuota is incremented ONLY if:
//         //
//         // usedQuota < dailyQuota
//         //
//         // This prevents concurrent approvals from exceeding
//         // the clinic quota.
//         // ========================================================

//         const updatedClinic = await Clinic.findOneAndUpdate(
//             {
//                 _id: booking.clinicId,
//                 isActive: true,
//                 $expr: {
//                     $lt: ["$usedQuota", "$dailyQuota"]
//                 }
//             },
//             {
//                 $inc: {
//                     usedQuota: 1
//                 }
//             },
//             {
//                 new: true
//             }
//         );

//         // ========================================================
//         // 10. Quota could not be reserved
//         // ========================================================

//         if (!updatedClinic) {

//             const currentClinic = await Clinic.findById(
//                 booking.clinicId
//             ).select("dailyQuota usedQuota isActive");

//             if (!currentClinic) {
//                 return res.status(404).json({
//                     error: "Clinic not found"
//                 });
//             }

//             if (!currentClinic.isActive) {
//                 return res.status(400).json({
//                     error: "Clinic is not active"
//                 });
//             }

//             return res.status(400).json({
//                 error: "Daily quota has been reached",
//                 dailyQuota: currentClinic.dailyQuota,
//                 usedQuota: currentClinic.usedQuota,
//                 remainingQuota: Math.max(
//                     currentClinic.dailyQuota -
//                     currentClinic.usedQuota,
//                     0
//                 )
//             });
//         }

//         // ========================================================
//         // From this point:
//         //
//         // One quota slot has been reserved.
//         //
//         // If anything fails after this point, we MUST rollback
//         // usedQuota.
//         // ========================================================

//         let quotaReserved = true;

//         try {

//             // ====================================================
//             // 11. Create Counter ID
//             // ====================================================

//             const counterId =
//                 `${booking.clinicId.toString()}_${dateString}`;

//             // ====================================================
//             // 12. Generate next queue number atomically
//             // ====================================================

//             const counter = await Counter.findOneAndUpdate(
//                 {
//                     _id: counterId
//                 },
//                 {
//                     $inc: {
//                         seq: 1
//                     }
//                 },
//                 {
//                     upsert: true,
//                     new: true
//                 }
//             );

//             if (!counter) {
//                 throw new Error(
//                     "Failed to generate queue number"
//                 );
//             }

//             // ====================================================
//             // 13. Safety check
//             //
//             // Because quota was reserved atomically,
//             // counter should never exceed dailyQuota.
//             // ====================================================

//             if (counter.seq > updatedClinic.dailyQuota) {

//                 // Rollback counter
//                 await Counter.findOneAndUpdate(
//                     {
//                         _id: counterId
//                     },
//                     {
//                         $inc: {
//                             seq: -1
//                         }
//                     }
//                 );

//                 throw new Error(
//                     "Queue number exceeded daily quota"
//                 );
//             }

//             // ====================================================
//             // 14. Update Booking
//             // ====================================================

//             booking.queueNumber = counter.seq;
//             booking.bookingDate = dateString;
//             booking.status = "approved";

//             // ====================================================
//             // 15. Save Booking
//             // ====================================================

//             await booking.save();

//             quotaReserved = false;

//             // ====================================================
//             // 16. Response
//             // ====================================================

//             return res.status(200).json({
//                 success: true,
//                 message: "Booking approved successfully",

//                 booking,

//                 quota: {
//                     dailyQuota: updatedClinic.dailyQuota,
//                     usedQuota: updatedClinic.usedQuota,
//                     remainingQuota:
//                         Math.max(
//                             updatedClinic.dailyQuota -
//                             updatedClinic.usedQuota,
//                             0
//                         )
//                 }
//             });

//         } catch (error) {

//             // ====================================================
//             // 17. Rollback quota
//             //
//             // Booking was NOT successfully approved.
//             // Therefore the reserved quota must be returned.
//             // ====================================================

//             if (quotaReserved) {

//                 await Clinic.findByIdAndUpdate(
//                     booking.clinicId,
//                     {
//                         $inc: {
//                             usedQuota: -1
//                         }
//                     }
//                 );
//             }

//             throw error;
//         }

//     } catch (error) {

//         console.error(
//             "Approve Booking Error:",
//             error
//         );

//         return res.status(500).json({
//             error:
//                 "An error occurred while approving the booking",

//             message: error.message
//         });
//     }
// }

async function approveBooking(req, res) {

    try {

        // ========================================================
        // 1. Get Booking ID
        // ========================================================

        const bookingId = req.params.id;


        // ========================================================
        // 2. Find Booking
        // ========================================================

        const booking = await Booking.findById(bookingId);

        if (!booking) {

            return res.status(404).json({
                error: "Booking not found"
            });

        }


        // ========================================================
        // 3. Only pending bookings can be approved
        // ========================================================

        if (booking.status !== "pending") {

            return res.status(400).json({
                error: "Only pending bookings can be approved"
            });

        }


        // ========================================================
        // 4. Get Clinic
        // ========================================================

        const clinic = await Clinic.findById(
            booking.clinicId
        );

        if (!clinic) {

            return res.status(404).json({
                error: "Clinic not found"
            });

        }


        // ========================================================
        // 5. Check Clinic status
        // ========================================================

        if (!clinic.isActive) {

            return res.status(400).json({
                error: "Clinic is not active"
            });

        }


        // ========================================================
        // 6. Validate clinic default quota
        // ========================================================

        if (
            typeof clinic.dailyQuota !== "number" ||
            clinic.dailyQuota < 1
        ) {

            return res.status(500).json({
                error: "Invalid clinic daily quota"
            });

        }


        // ========================================================
        // 7. Get today's date
        // ========================================================

        const dateString = getTodayDateString();


        // ========================================================
        // 8. Get or create today's quota record
        // ========================================================

        let dailyQuota =
            await DailyClinicQuota.findOne({
                clinicId: booking.clinicId,
                date: dateString
            });


        if (!dailyQuota) {

            try {

                dailyQuota =
                    await DailyClinicQuota.create({

                        clinicId: booking.clinicId,

                        date: dateString,

                        quota: clinic.dailyQuota,

                        usedQuota: 0

                    });

            } catch (error) {

                // Another concurrent request may have
                // created the record at the same time.

                if (error.code === 11000) {

                    dailyQuota =
                        await DailyClinicQuota.findOne({
                            clinicId: booking.clinicId,
                            date: dateString
                        });

                } else {

                    throw error;

                }
            }
        }


        if (!dailyQuota) {

            throw new Error(
                "Failed to create daily clinic quota"
            );

        }


        // ========================================================
        // 9. Atomically reserve ONE quota slot
        //
        // IMPORTANT:
        //
        // The increment happens ONLY when:
        //
        // usedQuota < quota
        //
        // This protects against concurrent approvals.
        // ========================================================

        const updatedQuota =
            await DailyClinicQuota.findOneAndUpdate(

                {
                    _id: dailyQuota._id,

                    $expr: {
                        $lt: [
                            "$usedQuota",
                            "$quota"
                        ]
                    }
                },

                {
                    $inc: {
                        usedQuota: 1
                    }
                },

                {
                    new: true
                }
            );


        // ========================================================
        // 10. Quota could not be reserved
        // ========================================================

        if (!updatedQuota) {

            const currentQuota =
                await DailyClinicQuota.findById(
                    dailyQuota._id
                );


            if (!currentQuota) {

                return res.status(500).json({
                    error:
                        "Daily quota record not found"
                });

            }


            return res.status(400).json({

                error:
                    "Daily quota has been reached",

                dailyQuota:
                    currentQuota.quota,

                usedQuota:
                    currentQuota.usedQuota,

                remainingQuota:
                    Math.max(
                        currentQuota.quota -
                        currentQuota.usedQuota,
                        0
                    )

            });

        }


        // ========================================================
        // From this point:
        //
        // ONE quota slot has been reserved.
        //
        // If anything fails, rollback usedQuota.
        // ========================================================

        let quotaReserved = true;


        try {

            // ====================================================
            // 11. Counter ID
            // ====================================================

            const counterId =
                `${booking.clinicId.toString()}_${dateString}`;


            // ====================================================
            // 12. Generate queue number atomically
            // ====================================================

            const counter =
                await Counter.findOneAndUpdate(

                    {
                        _id: counterId
                    },

                    {
                        $inc: {
                            seq: 1
                        }
                    },

                    {
                        upsert: true,
                        new: true
                    }
                );


            if (!counter) {

                throw new Error(
                    "Failed to generate queue number"
                );

            }


            // ====================================================
            // 13. Queue safety check
            // ====================================================

            if (
                counter.seq >
                updatedQuota.quota
            ) {

                // Rollback counter increment

                await Counter.findOneAndUpdate(

                    {
                        _id: counterId,

                        seq: {
                            $gte: counter.seq
                        }
                    },

                    {
                        $inc: {
                            seq: -1
                        }
                    }
                );


                throw new Error(
                    "Queue number exceeded daily quota"
                );

            }


            // ====================================================
            // 14. Update booking
            // ====================================================

            booking.queueNumber =
                counter.seq;

            booking.bookingDate =
                dateString;

            booking.status =
                "approved";


            // ====================================================
            // 15. Save booking
            // ====================================================

            await booking.save();


            // ====================================================
            // 16. Quota is now permanently consumed
            // ====================================================

            quotaReserved = false;


            // ====================================================
            // 17. Response
            // ====================================================

            return res.status(200).json({

                success: true,

                message:
                    "Booking approved successfully",

                booking,

                quota: {

                    dailyQuota:
                        updatedQuota.quota,

                    usedQuota:
                        updatedQuota.usedQuota,

                    remainingQuota:
                        Math.max(
                            updatedQuota.quota -
                            updatedQuota.usedQuota,
                            0
                        )

                }

            });


        } catch (error) {

            // ====================================================
            // 18. Rollback reserved quota
            // ====================================================

            if (quotaReserved) {

                await DailyClinicQuota.findOneAndUpdate(

                    {
                        _id: dailyQuota._id,

                        usedQuota: {
                            $gt: 0
                        }
                    },

                    {
                        $inc: {
                            usedQuota: -1
                        }
                    }
                );

            }


            throw error;

        }

    } catch (error) {

        console.error(
            "Approve Booking Error:",
            error
        );


        return res.status(500).json({

            error:
                "An error occurred while approving the booking",

            message:
                error.message

        });

    }
}


// function 4 : reject a booking

async function rejectBooking(req, res) {
    try {
        // get booking id
        const bookingId = req.params.id;

        // Get rejection reason from request body
        const { rejectionReason } = req.body;        

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

        booking.rejectionReason = rejectionReason?.trim() || null; // Default reason if none provided
       
        booking.rejectedAt = new Date();

        // booking.rejectedBy = req.user?.username || "Unknown"; // Capture the username of the person rejecting the booking


        // save the updated booking
        await booking.save();

        return res.status(200).json({ message: 'Booking rejected successfully', booking });
    } catch (error) {
        console.error("Reject Booking Error:", error);
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

// function 8 : get patient by national id for specific patient

// function 8 : get all bookings for a specific patient

async function getPatientBookings(req, res) {
    try {

        // get national id from params
        const { nationalId } = req.params;

        // validate national id
        if (!nationalId) {
            return res.status(400).json({
                error: "National ID is required"
            });
        }

        // national id must be 14 digits
        if (!/^\d{14}$/.test(nationalId)) {
            return res.status(400).json({
                error: "National ID must be exactly 14 digits"
            });
        }

        // get all bookings for this patient
        const bookings = await Booking.find({ nationalId })
            .populate("clinicId", "name")
            .sort({ createdAt: -1 });

        // no bookings found
        if (bookings.length === 0) {
            return res.status(404).json({
                message: "No bookings found for this National ID"
            });
        }

        // success response
        return res.status(200).json({
            count: bookings.length,
            bookings
        });

    } catch (error) {

        return res.status(500).json({
            error: "An error occurred while fetching patient bookings",
            msg: error.message
        });

    }
}

// function 9 : delete all bookings

async function deleteAllBookings(req, res) {
    try {

        // Delete all bookings
        const result = await Booking.deleteMany({});

        // No bookings found
        if (result.deletedCount === 0) {
            return res.status(404).json({
                error: "No bookings found to delete"
            });
        }

        return res.status(200).json({
            message: "All bookings deleted successfully",
            deletedCount: result.deletedCount
        });

    } catch (error) {

        return res.status(500).json({
            error: "An error occurred while deleting all bookings",
            msg: error.message
        });

    }
}

// function 10 : approve all pending bookings

// async function approveAllBookings(req, res) {
//     try {

//         // Get all pending bookings
//         const bookings = await Booking.find({
//             status: "pending"
//         });

//         // No pending bookings
//         if (bookings.length === 0) {
//             return res.status(404).json({
//                 error: "No pending bookings found"
//             });
//         }

//         let approvedCount = 0;

//         // Approve bookings one by one
//         for (const booking of bookings) {

//             // Get today's date
//             const today = new Date().toISOString().split("T")[0];

//             // Create unique counter ID for each clinic and day
//             const counterId = `${booking.clinicId.toString()}_${today}`;

//             // Get next queue number
//             const counter = await Counter.findOneAndUpdate(
//                 { _id: counterId },
//                 { $inc: { seq: 1 } },
//                 {
//                     new: true,
//                     upsert: true
//                 }
//             );

//             // Update booking
//             booking.queueNumber = counter.seq;
//             booking.bookingDate = today;
//             booking.status = "approved";

//             await booking.save();

//             approvedCount++;
//         }

//         return res.status(200).json({
//             message: "All pending bookings approved successfully",
//             approvedCount
//         });

//     } catch (error) {

//         return res.status(500).json({
//             error: "An error occurred while approving all bookings",
//             msg: error.message
//         });

//     }
// }


// ============================================================
// Function 10 : Approve all pending bookings
// ============================================================

// ============================================================
// Function 10 : Approve all pending bookings
// ============================================================

// async function approveAllBookings(req, res) {
//     try {

//         // ========================================================
//         // 1. Get all active clinics
//         // ========================================================

//         const clinics = await Clinic.find({
//             isActive: true
//         });

//         if (clinics.length === 0) {
//             return res.status(404).json({
//                 error: "No active clinics found"
//             });
//         }

//         // ========================================================
//         // 2. Get today's date
//         // Format: YYYY-MM-DD
//         // ========================================================

//         const today = new Date()
//             .toISOString()
//             .split("T")[0];

//         // ========================================================
//         // 3. Counters for response
//         // ========================================================

//         let approvedCount = 0;
//         let skippedCount = 0;

//         // Store information about each clinic
//         const clinicResults = [];

//         // ========================================================
//         // 4. Process each clinic separately
//         // ========================================================

//         for (const clinic of clinics) {

//             // ====================================================
//             // 5. Count bookings that already consumed today's
//             //    quota for this clinic
//             //
//             // approved + exported both consume quota
//             // ====================================================

//             const usedQuota = await Booking.countDocuments({
//                 clinicId: clinic._id,
//                 bookingDate: today,
//                 status: {
//                     $in: ["approved", "exported"]
//                 }
//             });

//             // ====================================================
//             // 6. Calculate remaining quota
//             //
//             // Example:
//             // quota     = 100
//             // usedQuota = 20
//             // available = 80
//             // ====================================================

//             const availableQuota = Math.max(
//                 clinic.dailyQuota - usedQuota,
//                 0
//             );

//             // ====================================================
//             // 7. Get pending bookings for this clinic
//             //
//             // Oldest bookings are processed first.
//             // This prevents newer requests from jumping ahead.
//             // ====================================================

//             const pendingBookings = await Booking.find({
//                 clinicId: clinic._id,
//                 status: "pending"
//             }).sort({
//                 createdAt: 1
//             });

//             // ====================================================
//             // 8. No pending bookings for this clinic
//             // ====================================================

//             if (pendingBookings.length === 0) {

//                 clinicResults.push({
//                     clinicId: clinic._id,
//                     clinicName: clinic.name,
//                     dailyQuota: clinic.dailyQuota,
//                     usedQuota,
//                     availableQuota,
//                     pendingBookings: 0,
//                     approvedBookings: 0,
//                     skippedBookings: 0
//                 });

//                 continue;
//             }

//             // ====================================================
//             // 9. Determine how many bookings can be approved
//             //
//             // We NEVER approve more than the remaining quota.
//             // ====================================================

//             const bookingsToApprove =
//                 pendingBookings.slice(0, availableQuota);

//             // Everything after the available quota remains pending.
//             const bookingsToSkip =
//                 pendingBookings.slice(availableQuota);

//             skippedCount += bookingsToSkip.length;

//             // ====================================================
//             // 10. Approve bookings
//             // ====================================================

//             let clinicApprovedCount = 0;

//             for (const booking of bookingsToApprove) {

//                 // ==================================================
//                 // 11. Create unique Counter ID
//                 //
//                 // Each clinic has its own counter every day.
//                 //
//                 // Example:
//                 //
//                 // Clinic A + 2026-08-10
//                 // Clinic B + 2026-08-10
//                 //
//                 // They have independent counters.
//                 // ==================================================



//                 // ==================================================
//                 // 12. Atomically increment the counter
//                 //
//                 // $inc is atomic in MongoDB.
//                 //
//                 // This is important for preventing duplicate
//                 // queue numbers when multiple requests are
//                 // processed at the same time.
//                 // ==================================================
// const today = getTodayDateString();

// const counterId =
//     `${booking.clinicId.toString()}_${today}`;
//                 const counter = await Counter.findOneAndUpdate(
//                     {
//                         _id: counterId
//                     },
//                     {
//                         $inc: {
//                             seq: 1
//                         }
//                     },
//                     {
//                         new: true,
//                         upsert: true
//                     }
//                 );

//                 // ==================================================
//                 // 13. Safety check
//                 //
//                 // This should normally never happen.
//                 // ==================================================

//                 if (!counter) {
//                     throw new Error(
//                         `Failed to generate queue number for booking ${booking._id}`
//                     );
//                 }

//                 // ==================================================
//                 // 14. Update booking
//                 // ==================================================

//                 booking.queueNumber = counter.seq;
//                 booking.bookingDate = today;
//                 booking.status = "approved";

//                 // ==================================================
//                 // 15. Save booking
//                 // ==================================================

//                 await booking.save();

//                 clinicApprovedCount++;
//                 approvedCount++;
//             }

//             // ====================================================
//             // 16. Store clinic result
//             // ====================================================

//             clinicResults.push({
//                 clinicId: clinic._id,
//                 clinicName: clinic.name,

//                 dailyQuota: clinic.dailyQuota,

//                 usedQuota,

//                 availableQuota,

//                 pendingBookings: pendingBookings.length,

//                 approvedBookings: clinicApprovedCount,

//                 skippedBookings: bookingsToSkip.length
//             });
//         }

//         // ========================================================
//         // 17. If nothing was approved
//         // ========================================================

//         if (approvedCount === 0) {

//             return res.status(400).json({
//                 error: "No bookings could be approved",
//                 approvedCount: 0,
//                 skippedCount,
//                 clinics: clinicResults
//             });
//         }

//         // ========================================================
//         // 18. Success response
//         // ========================================================

//         return res.status(200).json({

//             message:
//                 "Pending bookings processed successfully",

//             approvedCount,

//             skippedCount,

//             bookingDate: today,

//             clinics: clinicResults
//         });

//     } catch (error) {

//         // ========================================================
//         // Error handling
//         // ========================================================

//         console.error(
//             "Error in approveAllBookings:",
//             error
//         );

//         return res.status(500).json({
//             error:
//                 "An error occurred while approving all bookings",

//             msg: error.message
//         });
//     }
// }

async function approveAllBookings(req, res) {
    try {

        // ========================================================
        // 1. Get today's date
        // ========================================================

        const today = getTodayDateString();


        // ========================================================
        // 2. Get all active clinics
        // ========================================================

        const clinics = await Clinic.find({
            isActive: true
        });

        if (clinics.length === 0) {
            return res.status(404).json({
                error: "No active clinics found"
            });
        }


        // ========================================================
        // 3. Response counters
        // ========================================================

        let approvedCount = 0;
        let skippedCount = 0;

        const clinicResults = [];


        // ========================================================
        // 4. Process each clinic
        // ========================================================

        for (const clinic of clinics) {

            // ====================================================
            // 5. Get today's DailyClinicQuota
            // ====================================================

            let dailyQuotaRecord =
                await DailyClinicQuota.findOne({
                    clinicId: clinic._id,
                    date: today
                });


            // ====================================================
            // 6. Create today's quota record if it doesn't exist
            // ====================================================

            if (!dailyQuotaRecord) {

                try {

                    dailyQuotaRecord =
                        await DailyClinicQuota.create({

                            clinicId: clinic._id,

                            date: today,

                            quota: clinic.dailyQuota,

                            usedQuota: 0

                        });

                } catch (error) {

                    // Another request may have created it
                    // concurrently.

                    if (error.code === 11000) {

                        dailyQuotaRecord =
                            await DailyClinicQuota.findOne({
                                clinicId: clinic._id,
                                date: today
                            });

                    } else {

                        throw error;

                    }
                }
            }


            if (!dailyQuotaRecord) {

                throw new Error(
                    `Failed to create daily quota for clinic ${clinic._id}`
                );

            }


            // ====================================================
            // 7. Get pending bookings
            //
            // Oldest first
            // ====================================================

            const pendingBookings =
                await Booking.find({

                    clinicId: clinic._id,

                    status: "pending"

                }).sort({
                    createdAt: 1
                });


            // ====================================================
            // 8. No pending bookings
            // ====================================================

            if (pendingBookings.length === 0) {

                const remainingQuota =
                    Math.max(
                        dailyQuotaRecord.quota -
                        dailyQuotaRecord.usedQuota,
                        0
                    );


                clinicResults.push({

                    clinicId: clinic._id,

                    clinicName: clinic.name,

                    dailyQuota:
                        dailyQuotaRecord.quota,

                    usedQuota:
                        dailyQuotaRecord.usedQuota,

                    remainingQuota,

                    pendingBookings: 0,

                    approvedBookings: 0,

                    skippedBookings: 0

                });

                continue;
            }


            // ====================================================
            // 9. Calculate remaining quota
            // ====================================================

            const remainingQuota =
                Math.max(
                    dailyQuotaRecord.quota -
                    dailyQuotaRecord.usedQuota,
                    0
                );


            // ====================================================
            // 10. No quota available
            // ====================================================

            if (remainingQuota === 0) {

                skippedCount +=
                    pendingBookings.length;


                clinicResults.push({

                    clinicId: clinic._id,

                    clinicName: clinic.name,

                    dailyQuota:
                        dailyQuotaRecord.quota,

                    usedQuota:
                        dailyQuotaRecord.usedQuota,

                    remainingQuota: 0,

                    pendingBookings:
                        pendingBookings.length,

                    approvedBookings: 0,

                    skippedBookings:
                        pendingBookings.length

                });

                continue;
            }


            // ====================================================
            // 11. Determine how many bookings we TRY to approve
            // ====================================================

            const bookingsToApprove =
                pendingBookings.slice(
                    0,
                    remainingQuota
                );


            const bookingsToSkip =
                pendingBookings.slice(
                    remainingQuota
                );


            skippedCount +=
                bookingsToSkip.length;


            // ====================================================
            // 12. Approve bookings one by one
            // ====================================================

            let clinicApprovedCount = 0;


            for (const booking of bookingsToApprove) {

                // ==================================================
                // 13. Atomically reserve quota
                //
                // This is VERY important.
                //
                // Even if approveAllBookings is running together
                // with approveBooking, quota cannot exceed limit.
                // ==================================================

                const updatedQuota =
                    await DailyClinicQuota.findOneAndUpdate(

                        {
                            _id:
                                dailyQuotaRecord._id,

                            $expr: {
                                $lt: [
                                    "$usedQuota",
                                    "$quota"
                                ]
                            }
                        },

                        {
                            $inc: {
                                usedQuota: 1
                            }
                        },

                        {
                            new: true
                        }
                    );


                // ==================================================
                // 14. Quota was consumed by another request
                // ==================================================

                if (!updatedQuota) {

                    // Remaining bookings stay pending.

                    skippedCount +=
                        pendingBookings.length -
                        clinicApprovedCount;

                    break;
                }


                // ==================================================
                // 15. Generate queue number
                // ==================================================

                const counterId =
                    `${clinic._id.toString()}_${today}`;


                const counter =
                    await Counter.findOneAndUpdate(

                        {
                            _id: counterId
                        },

                        {
                            $inc: {
                                seq: 1
                            }
                        },

                        {
                            new: true,

                            upsert: true
                        }
                    );


                if (!counter) {

                    // Rollback quota reservation

                    await DailyClinicQuota.findOneAndUpdate(

                        {
                            _id:
                                dailyQuotaRecord._id,

                            usedQuota: {
                                $gt: 0
                            }
                        },

                        {
                            $inc: {
                                usedQuota: -1
                            }
                        }
                    );


                    throw new Error(
                        `Failed to generate queue number for booking ${booking._id}`
                    );
                }


                // ==================================================
                // 16. Safety check
                // ==================================================

                if (
                    counter.seq >
                    updatedQuota.quota
                ) {

                    // Rollback counter

                    await Counter.findOneAndUpdate(

                        {
                            _id: counterId,

                            seq: {
                                $gte: counter.seq
                            }
                        },

                        {
                            $inc: {
                                seq: -1
                            }
                        }
                    );


                    // Rollback quota

                    await DailyClinicQuota.findOneAndUpdate(

                        {
                            _id:
                                dailyQuotaRecord._id,

                            usedQuota: {
                                $gt: 0
                            }
                        },

                        {
                            $inc: {
                                usedQuota: -1
                            }
                        }
                    );


                    throw new Error(
                        "Queue number exceeded daily quota"
                    );
                }


                // ==================================================
                // 17. Update booking
                // ==================================================

                booking.queueNumber =
                    counter.seq;

                booking.bookingDate =
                    today;

                booking.status =
                    "approved";


                // ==================================================
                // 18. Save booking
                // ==================================================

                try {

                    await booking.save();

                } catch (error) {

                    // Rollback quota

                    await DailyClinicQuota.findOneAndUpdate(

                        {
                            _id:
                                dailyQuotaRecord._id,

                            usedQuota: {
                                $gt: 0
                            }
                        },

                        {
                            $inc: {
                                usedQuota: -1
                            }
                        }
                    );


                    // Rollback counter

                    await Counter.findOneAndUpdate(

                        {
                            _id: counterId,

                            seq: {
                                $gte: counter.seq
                            }
                        },

                        {
                            $inc: {
                                seq: -1
                            }
                        }
                    );


                    throw error;
                }


                // ==================================================
                // 19. Success
                // ==================================================

                clinicApprovedCount++;

                approvedCount++;
            }


            // ====================================================
            // 20. Get final quota state
            // ====================================================

            const finalQuota =
                await DailyClinicQuota.findById(
                    dailyQuotaRecord._id
                );


            const finalRemainingQuota =
                finalQuota
                    ? Math.max(
                        finalQuota.quota -
                        finalQuota.usedQuota,
                        0
                    )
                    : 0;


            // ====================================================
            // 21. Calculate actual skipped bookings
            // ====================================================

            const actualSkippedBookings =
                Math.max(
                    pendingBookings.length -
                    clinicApprovedCount,
                    0
                );


            clinicResults.push({

                clinicId:
                    clinic._id,

                clinicName:
                    clinic.name,

                dailyQuota:
                    finalQuota.quota,

                usedQuota:
                    finalQuota.usedQuota,

                remainingQuota:
                    finalRemainingQuota,

                pendingBookings:
                    pendingBookings.length,

                approvedBookings:
                    clinicApprovedCount,

                skippedBookings:
                    actualSkippedBookings

            });
        }


        // ========================================================
        // 22. Nothing approved
        // ========================================================

        if (approvedCount === 0) {

            return res.status(400).json({

                error:
                    "No bookings could be approved",

                approvedCount: 0,

                skippedCount,

                bookingDate:
                    today,

                clinics:
                    clinicResults

            });
        }


        // ========================================================
        // 23. Success
        // ========================================================

        return res.status(200).json({

            success: true,

            message:
                "Pending bookings processed successfully",

            approvedCount,

            skippedCount,

            bookingDate:
                today,

            clinics:
                clinicResults

        });


    } catch (error) {

        console.error(
            "Error in approveAllBookings:",
            error
        );


        return res.status(500).json({

            error:
                "An error occurred while approving all bookings",

            message:
                error.message

        });
    }
}

            
// function 11 : reject all pending bookings

async function rejectAllBookings(req, res) {
    try {

        // Reject all pending bookings
        const result = await Booking.updateMany(
            {
                status: "pending"
            },
            {
                $set: {
                    status: "rejected",
                    rejectedAt: new Date()
                }
            }
        );

        // No pending bookings
        if (result.modifiedCount === 0) {
            return res.status(404).json({
                error: "No pending bookings found"
            });
        }

        return res.status(200).json({
            message: "All pending bookings rejected successfully",
            rejectedCount: result.modifiedCount
        });

    } catch (error) {

        return res.status(500).json({
            error: "An error occurred while rejecting all bookings",
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
    deleteBooking,
    getPatientBookings,
    deleteAllBookings,
    approveAllBookings,
    rejectAllBookings
};

