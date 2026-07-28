const multer = require('multer');
const path   = require('path');

// ============================================================
// Storage — هنحط الصور فين؟
// ============================================================
const storage = multer.diskStorage({

    // المجلد اللي هتتحط فيه الصور
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },

    // اسم الملف — بنضيف timestamp عشان مينكرارش
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname);
        // مثال: 1234567890.jpg
        cb(null, uniqueName);
    }
});

// ============================================================
// Filter — بنقبل صور بس
// ============================================================
const fileFilter = function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);   // ✅ قبول
    } else {
        cb(new Error('يرجى رفع صورة بصيغة JPG أو PNG فقط'), false); // ❌ رفض
    }
};

// ============================================================
// حجم الصورة — 5MB كحد أقصى
// ============================================================
const upload = multer({
    storage:   storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024  // 5MB
        // 5 * 1024 = 5KB
        // 5 * 1024 * 1024 = 5MB
    }
});

module.exports = upload;