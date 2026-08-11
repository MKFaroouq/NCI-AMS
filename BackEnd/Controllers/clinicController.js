const Clinic = require('../models/Clinic');

async function getClinics(req, res) {
    try {
        // only active clinics should be fetched
        const clinics = await Clinic.find({ isActive: true }).sort({ name: 1 }); // Sort by name in ascending order

        if (clinics.length === 0) {
            return res.status(404).json({ error: "No active clinics found" });
        }

        return res.status(200).json({ clinics });

    } catch (error) {
        console.error('Error in getClinics:', error);
        return res.status(500).json({ error: "An error occurred while fetching clinics" });
    }
}

// add clinic function (for admin use)

async function addClinic(req, res) {
    try {
        // 1. التحقق من الـ Body
        if (!req.body) {
            return res.status(400).json({ error: 'يرجى إدخال بيانات العيادة' });
        }

        // 2. جيب البيانات
        const { name, quota } = req.body;

        // 3. التحقق من الاسم
        if (!name) {
            return res.status(400).json({ error: 'يرجى إدخال اسم العيادة' });
        }

        // 4. التحقق من إن العيادة مش موجودة قبل كده
        const existingClinic = await Clinic.findOne({ name: name });
        if (existingClinic) {
            return res.status(400).json({ error: 'العيادة دي موجودة بالفعل' });
        }

        // 5. إنشاء العيادة
        const newClinic = new Clinic({
            name,
            quota:    quota || 100,  // لو مش بعت quota هيبقى 100
            isActive: true
        });

        await newClinic.save();

        return res.status(201).json({
            message: 'تم إضافة العيادة بنجاح',
            clinic:  newClinic
        });

    } catch (error) {
        console.error('Error in addClinic:', error);
        return res.status(500).json({ error: 'حدث خطأ أثناء إضافة العيادة' });
    }
}


module.exports = { getClinics, addClinic };
