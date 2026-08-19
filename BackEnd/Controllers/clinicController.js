const Clinic = require("../models/Clinic");
const DailyClinicQuota = require("../models/DailyClinicQuota");
const {
    getTodayDateString
} = require("../utils/dateUtils");
// async function getClinics(req, res) {
//     try {
//         // only active clinics should be fetched
//         const clinics = await Clinic.find({ isActive: true }).sort({ name: 1 }); // Sort by name in ascending order

//         if (clinics.length === 0) {
//             return res.status(404).json({ error: "No active clinics found" });
//         }

//             const result = clinics.map((clinic) => ({
//             ...clinic.toObject(),
//             remainingQuota: Math.max(
//                 clinic.dailyQuota - clinic.usedQuota,
//                 0
//             ),
//             }));
//         return res.status(200).json({ clinics: result });

//     } catch (error) {
//         console.error('Error in getClinics:', error);
//         return res.status(500).json({ error: "An error occurred while fetching clinics" });
//     }
// }

// async function getClinics(req, res) {
//     try {

//         // ========================================================
//         // 1. Get today's date
//         // ========================================================

//         const dateString = getTodayDateString();

//         // ========================================================
//         // 2. Get active clinics
//         // ========================================================

//         const clinics = await Clinic
//             .find({ isActive: true })
//             .sort({ name: 1 });

//         if (clinics.length === 0) {
//             return res.status(404).json({
//                 error: "No active clinics found"
//             });
//         }

//         // ========================================================
//         // 3. Get today's quota records
//         // ========================================================

//         const clinicIds = clinics.map(
//             clinic => clinic._id
//         );

//         const dailyQuotas = await DailyClinicQuota.find({
//             clinicId: { $in: clinicIds },
//             date: dateString
//         });

//         // ========================================================
//         // 4. Create lookup map
//         // ========================================================

//         const quotaMap = new Map();

//         dailyQuotas.forEach(quota => {
//             quotaMap.set(
//                 quota.clinicId.toString(),
//                 quota
//             );
//         });

//         // ========================================================
//         // 5. Build response
//         // ========================================================

//         const result = clinics.map(clinic => {

//             const quotaRecord = quotaMap.get(
//                 clinic._id.toString()
//             );

//             const usedQuota = quotaRecord
//                 ? quotaRecord.usedQuota
//                 : 0;

//             const dailyQuota = quotaRecord
//                 ? quotaRecord.quota
//                 : clinic.dailyQuota;

//             const remainingQuota = Math.max(
//                 dailyQuota - usedQuota,
//                 0
//             );

//             return {
//                 _id: clinic._id,
//                 name: clinic.name,
//                 dailyQuota,
//                 usedQuota,
//                 remainingQuota,
//                 isActive: clinic.isActive
//             };
//         });

//         // ========================================================
//         // 6. Response
//         // ========================================================

//         return res.status(200).json({
//             success: true,
//             date: dateString,
//             clinics: result
//         });

// } catch (error) {

//     console.error("=================================");
//     console.error("getClinics ERROR");
//     console.error("Message:", error.message);
//     console.error("Stack:", error.stack);
//     console.error("=================================");

//     return res.status(500).json({
//         error: "An error occurred while fetching clinics",
//         message: error.message
//     });
// }
// }

// const {
//     getTodayDateString
// } = require("../utils/dateUtils");

// const {
//     getOrCreateDailyQuota
// } = require("../utils/dailyClinicQuota");


async function getClinics(req, res) {

    try {

        // ========================================================
        // 1. Today's date
        // ========================================================

        const dateString = getTodayDateString();


        // ========================================================
        // 2. Get active clinics
        // ========================================================

        const clinics = await Clinic
            .find({ isActive: true })
            .sort({ name: 1 });


        if (clinics.length === 0) {

            return res.status(404).json({
                error: "No active clinics found"
            });
        }


        // ========================================================
        // 3. Get / create today's quota for each clinic
        // ========================================================

        const result = await Promise.all(

            clinics.map(async (clinic) => {

                const quotaRecord =
                    await getOrCreateDailyQuota(
                        clinic._id,
                        dateString
                    );


                const remainingQuota = Math.max(
                    quotaRecord.quota -
                    quotaRecord.usedQuota,
                    0
                );


                return {

                    _id: clinic._id,

                    name: clinic.name,

                    dailyQuota: quotaRecord.quota,

                    usedQuota: quotaRecord.usedQuota,

                    remainingQuota,

                    isActive: clinic.isActive

                };

            })

        );


        // ========================================================
        // 4. Response
        // ========================================================

        return res.status(200).json({

            success: true,

            date: dateString,

            clinics: result

        });


    } catch (error) {

        console.error("=================================");
        console.error("getClinics ERROR");
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);
        console.error("=================================");


        return res.status(500).json({

            error: "An error occurred while fetching clinics",

            message: error.message

        });

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
        const { name, dailyQuota } = req.body;

        // 3. التحقق من الاسم
        if (!name) {
            return res.status(400).json({ error: 'يرجى إدخال اسم العيادة' });
        }

        // check if quota is provided and is a valid number
        // if (quota && (typeof quota !== 'number' || quota <= 0)) {
        //     return res.status(400).json({ error: 'يرجى إدخال قيمة صحيحة للـ quota' });
        // }        


        // 4. التحقق من إن العيادة مش موجودة قبل كده
        const existingClinic = await Clinic.findOne({ name: name });
        if (existingClinic) {
            return res.status(400).json({ error: 'العيادة دي موجودة بالفعل' });
        }

        // check if dailyQuota is provided and is a valid number
        if (dailyQuota && (!Number.isInteger(dailyQuota) || dailyQuota <= 0)) {
            return res.status(400).json({ error: "dailyQuota must be a positive integer" });
        }


// if ( !Number.isInteger(clinicQuota) || clinicQuota <= 0 ) 
// { return res.status(400).json({ error: "Quota must be a positive integer" }); }
       
// 5. إنشاء العيادة
        const newClinic = new Clinic({
            name,
            dailyQuota: dailyQuota || 100,  // لو مش بعت dailyQuota هيبقى 100
            isActive: true,
            usedQuota: 0 // Initialize usedQuota to 0

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

// toggle clinc status (active/inactive) // Admin only
async function toggleClinicStatus(req, res) {
    try {
        const { clinicId } = req.params;

        const clinic = await Clinic.findById(clinicId);
        if (!clinic) {
            return res.status(404).json({ error: 'العيادة غير موجودة' });
        }

        clinic.isActive = !clinic.isActive;
        await clinic.save();

        return res.status(200).json({
            message: clinic.isActive ? "clinic active status updated successfully" : "clinic inactive status updated successfully",
            clinic
        });
    } catch (error) {
        console.error('Error in toggleClinicStatus:', error);
        return res.status(500).json({ error: 'حدث خطأ أثناء تحديث حالة العيادة' });
    }
}

// Get All Clinics // Admin only // Includes active + inactive clinics // ============================================================ 
async function getAllClinics(req, res){
     try { const clinics = await Clinic.find() .sort({ createdAt: -1 });
      return res.status(200).json({ count: clinics.length, clinics }); }
       catch (error) { 
        console.error("Error in getAllClinics:", error); 
        return res.status(500).json({ error: "An error occurred while fetching all clinics" }); } }


module.exports = { getClinics, addClinic, getAllClinics , toggleClinicStatus };
