const mongoose = require('mongoose');

// ============================================================
// Counter Schema
// بيخزن آخر رقم طابور لكل عيادة في كل يوم
// مثال على الـ _id: "64abc123ef_2024-01-15"
//                     clinicId  _ التاريخ
// ============================================================
const counterSchema = new mongoose.Schema({
    _id:  { type: String,  required: true }, // هو المفتاح نفسه
    seq:  { type: Number,  default: 0     }
});

const Counter = mongoose.model('Counter', counterSchema);


// ============================================================
// Booking Schema
// الـ Primary Entity في النظام كله
// ============================================================
const bookingSchema = new mongoose.Schema({

    // ---------- بيانات المريض ----------
    patientName: {
        type:     String,
        required: true,
        trim:     true
    },
    nationalId: {
        type:     String,
        required: true,
        trim:     true,
        match:    [/^\d{14}$/, 'National ID must be exactly 14 digits']
    },
    phoneNumber: {
        type:     String,
        required: true,
        trim:     true,
        match:    [/^01[0125]\d{8}$/, 'Phone number must be a valid Egyptian mobile number']
    },
    governorate: {
        type:     String,
        required: true,
        trim:     true,
        default:  'menoufia' // default value, can't be changed later
    },
    nationalIdImage: {
        type:     String,   // المسار بعد رفع الصورة بـ Multer
        // required: true,
        default:  null
    },

    // ---------- بيانات الحجز ----------
    clinicId: {
        type:     mongoose.Schema.Types.ObjectId,
        ref:      'Clinic',  // reference للـ Clinic collection
        required: true
    },

    // ---------- الحالة ----------
    // pending  → استنى مراجعة Data Entry
    // approved → اتوافق عليه وأخد رقم طابور
    // exported → اتصدّر لـ Excel وراح HIS
    // rejected → اترفض
    status: {
        type:    String,
        enum:    ['pending', 'approved' , 'rejected' , 'exported'],
        default: 'pending'
    },

    // ---------- بيانات الطابور ----------
    // الـ 3 fields دول بيتملوا مع بعض عند الـ Approval بس
    queueNumber: {
        type:    Number,
        default: null
    },
    bookingDate: {
        type:    String,   // format: "YYYY-MM-DD"
        default: null      // ❌ مش required — بيتملى عند الـ Approval
    },
    rejectedAt: {
    type: Date,
    default: null
    },
    qrCode: {
        type:    String,
        default: null
    },

    // ---------- بيانات الرفض ----------
    rejectionReason: {
        type:    String,
        default: null      // بيتملى بس لو status = rejected
    },

    // ---------- optional: ربط بـ request سابق ----------
    // لو المريض اتعمله reject قبل كده وعمل request جديد
    previousRequestId: {
        type:    mongoose.Schema.Types.ObjectId,
        ref:     'Booking',
        default: null
    }

}, { timestamps: true }); // بيضيف createdAt و updatedAt أوتوماتيك


// ============================================================
// Indexes — مهمة جداً للأداء والـ Business Rules
// ============================================================

// 1. Duplicate check
//    مريض مايبعتش أكتر من request واحد active لنفس العيادة
//    "active" = pending أو approved بس
bookingSchema.index(
    { nationalId: 1, clinicId: 1 },
    {
        unique: true,
        partialFilterExpression: {
            status: { $in: ['pending', 'approved'] }
        },
        name: 'unique_active_booking_per_clinic'
    }
);

// 2. Rate limit check (Rule #4)
//    بنستخدمه لما بنعد requests المريض في آخر 7 أيام
bookingSchema.index(
    { nationalId: 1, createdAt: -1 },
    { name: 'booking_rate_limit' }
);

// 3. Data Entry workspace
//    بيجيب الـ pending requests مرتبة من الأقدم للأحدث
bookingSchema.index(
    { status: 1, createdAt: 1 },
    { name: 'pending_queue_lookup' }
);

// 4. Daily queue per clinic
//    بيجيب أرقام الطابور لعيادة معينة في يوم معين
bookingSchema.index(
    { clinicId: 1, bookingDate: 1, status: 1 },
    { name: 'daily_clinic_queue' }
);


// ============================================================
module.exports = {
    Booking: mongoose.model('Booking', bookingSchema),
    Counter
};