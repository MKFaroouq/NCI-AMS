// const mongoose = require('mongoose');
// const queue = require('./models/PatientRequest'); // تأكد من مسار الموديل عندك صح

// //database connection string
// const MONGO_URI = 'mongodb://localhost:27017/patientRequest'; 

// async function seedData() {
//     try {
//         console.log('connecting to database ...');
//         await mongoose.connect(MONGO_URI);
        
//         // delete all existing bookings to start fresh
//         await queue.deleteAllBookings({});
//         console.log('all data has been cleared from the database. Preparing to seed new data...');

//         const fakeBookings = [];
//         const today = new Date().toISOString().split('T')[0];

//         console.log('generating fake bookings , please wait ...');
        
//         for (let i = 1; i <= 50; i++) {
//             // توليد رقم قومي وهمي فريد مكون من 14 رقم لكل حالة عشان نتخطى ليميت الـ 3 حجوزات بالأسبوع
//             const fakeNationalId = `29501011234${String(i).padStart(3, '0')}`; 
            
//             fakeBookings.push({
//                 patientName: `patient number : ${i}`,
//                 nationalId: fakeNationalId,
//                 phoneNumber: `01012345${String(i).padStart(3, '0')}`,
//                 department: i % 2 === 0 ? 'عيادة الأورام' : 'عيادة الجراحة',
//                 bookingDate: today,
//                 status: 'pending',
//                 queueNumber: null,
//                 createdAt: new Date()
//             });
//         }

//         // حقن الـ 101 حجز دفعة واحدة في الداتا بيز في أجزاء من الثانية!
//         await queue.insertMany(fakeBookings);
        
//         console.log('congratulations! 101 fake bookings have been successfully seeded into the database.');
//         process.exit(0);

//     } catch (error) {
//         console.error('error seeding data:', error);
//         process.exit(1);
//     }
// }

// seedData();

const mongoose = require("mongoose");

console.log("SEED FILE STARTED");

const { Booking, Counter } = require("./models/PatientRequest");
const  Clinic  = require("./models/Clinic");

// Database connection
const MONGO_URI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/NCI-AMS";

async function seedData() {
    try {

        console.log("1 - Starting seed");

        console.log("Connecting to database...");

        await mongoose.connect(MONGO_URI);

        console.log("2 - Database connected");

        console.log("Connected to database");


        // =========================================================
        // 1. Clear old bookings
        // =========================================================
        
        console.log("3 - Bookings deleted");

        await Booking.deleteMany({});

        // Clear old queue counters
        await Counter.deleteMany({});

        console.log("4 - Counters deleted");


        console.log("Old bookings and counters have been deleted");


        // =========================================================
        // 2. Get active clinics
        // =========================================================

        const clinics = await Clinic.find({
            isActive: true
        });

        console.log("5 - Clinics found:", clinics.length);

        if (clinics.length === 0) {
            console.log("No active clinics found.");
            console.log("Please create at least one clinic first.");

            process.exit(1);
        }

        console.log(`Found ${clinics.length} active clinic(s)`);


        // =========================================================
        // 3. Generate fake bookings
        // =========================================================

        const fakeBookings = [];

        console.log("Generating fake bookings...");


        for (let i = 1; i <= 200; i++) {

            // Generate unique 14-digit National ID
            const fakeNationalId =
                `29501011234${String(i).padStart(3, "0")}`;


            // Distribute bookings between clinics
            const clinic =
                clinics[(i - 1) % clinics.length];


            fakeBookings.push({

                patientName: `Patient Number ${i}`,

                nationalId: fakeNationalId,

                phoneNumber:
                    `01012345${String(i).padStart(3, "0")}`,

                clinicId: clinic._id,

                status: "pending",

                queueNumber: null,

                bookingDate: null,

                nationalIdImage: null,

                rejectedAt: null

            });
        }


        // =========================================================
        // 4. Insert all bookings
        // =========================================================
            const insertedBookings = await Booking.insertMany(fakeBookings);

            console.log(
                `Successfully inserted ${insertedBookings.length} bookings`
            );

            // Verify data really exists in database
            const totalBookings = await Booking.countDocuments();

            console.log(
                `Bookings currently in database: ${totalBookings}`
            );

            const pendingBookings = await Booking.countDocuments({
                status: "pending"
            });

            console.log(
                `Pending bookings currently in database: ${pendingBookings}`
            );


        // =========================================================
        // 5. Show distribution
        // =========================================================

        console.log("\nBooking distribution:");

        for (const clinic of clinics) {

            const count = await Booking.countDocuments({
                clinicId: clinic._id
            });

            console.log(
                `${clinic.name}: ${count} bookings`
            );
        }


        console.log("\nSeed completed successfully!");

        console.log(
            "\nYou can now test approveAllBookings."
        );


        process.exit(0);

    } catch (error) {

        console.error(
            "Error seeding data:",
            error
        );

        process.exit(1);
    }
}


seedData();