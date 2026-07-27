const mongoose = require('mongoose');
const queue = require('./models/PatientRequest'); // تأكد من مسار الموديل عندك صح

//database connection string
const MONGO_URI = 'mongodb://localhost:27017/patientRequest'; 

async function seedData() {
    try {
        console.log('connecting to database ...');
        await mongoose.connect(MONGO_URI);
        
        // delete all existing bookings to start fresh
        await queue.deleteMany({});
        console.log('all data has been cleared from the database. Preparing to seed new data...');

        const fakeBookings = [];
        const today = new Date().toISOString().split('T')[0];

        console.log('generating fake bookings , please wait ...');
        
        for (let i = 1; i <= 101; i++) {
            // توليد رقم قومي وهمي فريد مكون من 14 رقم لكل حالة عشان نتخطى ليميت الـ 3 حجوزات بالأسبوع
            const fakeNationalId = `29501011234${String(i).padStart(3, '0')}`; 
            
            fakeBookings.push({
                patientName: `patient number : ${i}`,
                nationalId: fakeNationalId,
                phoneNumber: `01012345${String(i).padStart(3, '0')}`,
                department: i % 2 === 0 ? 'عيادة الأورام' : 'عيادة الجراحة',
                bookingDate: today,
                status: 'pending',
                queueNumber: null,
                createdAt: new Date()
            });
        }

        // حقن الـ 101 حجز دفعة واحدة في الداتا بيز في أجزاء من الثانية!
        await queue.insertMany(fakeBookings);
        
        console.log('congratulations! 101 fake bookings have been successfully seeded into the database.');
        process.exit(0);

    } catch (error) {
        console.error('error seeding data:', error);
        process.exit(1);
    }
}

seedData();