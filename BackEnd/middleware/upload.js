const multer   = require('multer');
const path     = require('path');
const Tesseract = require('tesseract.js');
const fs       = require('fs');

// ============================================================
// 1. Storage — فين هتتحط الصور وبأي اسم
// ============================================================
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, 'uploads/');
        // cb = callback
        // null = مفيش error
        // 'uploads/' = المجلد
    },

    filename: function (req, file, cb) {
        // Date.now() بيدي رقم فريد مش بيتكرر
        // path.extname بياخد امتداد الملف (.jpg / .png)
        // مثال: 1234567890.jpg
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

// ============================================================
// 2. Filter — بنقبل صور بس مش أي ملف
// ============================================================
const fileFilter = function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);    // ✅ قبول
    } else {
        cb(new Error('يرجى رفع صورة بصيغة JPG أو PNG فقط'), false); // ❌ رفض
    }
};

// ============================================================
// 3. Upload — بيجمع الـ storage والـ filter والـ size مع بعض
// ============================================================
const upload = multer({
    storage:    storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024  // 5MB
    }
});

// ============================================================
// 4. Tesseract — بيقرأ النص من الصورة
// ============================================================
async function validateNationalIdImage(imagePath, nationalId) {
    try {
        // بيقرأ الصورة ويحول فيها لنص
        // lang: 'ara' = عربي / 'eng' = انجليزي
        // البطاقة المصرية فيها الاتنين فبنحطهم مع بعض
        const result = await Tesseract.recognize(imagePath, 'ara+eng');

        // النص اللي اتقرأ من الصورة
        const extractedText = result.data.text;
        console.log('النص اللي Tesseract قرأه:', extractedText);

        // بنبحث عن الـ 14 رقم بتاع المريض جوه النص
        const isIdFound = extractedText.includes(nationalId);

        // امسح الصورة لو مش بطاقة عشان منملاش السيرفر
        if (!isIdFound) {
            fs.unlinkSync(imagePath);
            // unlinkSync = امسح الملف من السيرفر
        }

        return isIdFound;

    } catch (error) {
        console.error('Error in Tesseract:', error);
        // لو Tesseract فشل من غير سبب — مش هنرفض
        // هنسيب الـ Data Entry يراجع بنفسه
        return true;
    }
}

// ============================================================
module.exports = { upload, validateNationalIdImage };