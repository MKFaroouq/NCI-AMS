// const mongoose = require("mongoose");

// const dailyClinicQuotaSchema = new mongoose.Schema(
//     {
//         clinicId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Clinic",
//             required: true,
//         },

//         date: {
//             type: String,
//             required: true,
//         },

//         quota: {
//             type: Number,
//             required: true,
//             min: 1,
//         },

//         usedQuota: {
//             type: Number,
//             default: 0,
//             min: 0,
//         },

//         expiresAt: {
//             type: Date,
//             required: true,
//         },
//     },
//     {
//         timestamps: true,
//     }
// );

// dailyClinicQuotaSchema.index(
//     {
//         clinicId: 1,
//         date: 1,
//     },
//     {
//         unique: true,
//     }
// );

// dailyClinicQuotaSchema.index(
//     {
//         expiresAt: 1,
//     },
//     {
//         expireAfterSeconds: 0,
//     }
// );

// module.exports = mongoose.model(
//     "DailyClinicQuota",
//     dailyClinicQuotaSchema
// );
const mongoose = require("mongoose");

const dailyClinicQuotaSchema = new mongoose.Schema(
    {
        clinicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clinic",
            required: true,
        },

        date: {
            type: String,
            required: true,
        },

        quota: {
            type: Number,
            required: true,
            min: 1,
        },

        usedQuota: {
            type: Number,
            default: 0,
            min: 0,
        },

        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);


// ========================================================
// Unique quota record per clinic per day
// ========================================================

dailyClinicQuotaSchema.index(
    {
        clinicId: 1,
        date: 1,
    },
    {
        unique: true,
    }
);


// ========================================================
// MongoDB TTL
// Delete the record automatically at expiresAt
// ========================================================

dailyClinicQuotaSchema.index(
    {
        expiresAt: 1,
    },
    {
        expireAfterSeconds: 0,
    }
);


// ========================================================
// Automatically calculate expiration time
// ========================================================

dailyClinicQuotaSchema.pre("validate", function (next) {

    if (this.date && !this.expiresAt) {

        const [year, month, day] =
            this.date.split("-").map(Number);

        // Next day at 00:00
        this.expiresAt = new Date(
            year,
            month - 1,
            day + 1,
            0,
            0,
            0,
            0
        );
    }

    next();
});


// ========================================================
// Prevent OverwriteModelError during development
// ========================================================

module.exports =
    mongoose.models.DailyClinicQuota ||
    mongoose.model(
        "DailyClinicQuota",
        dailyClinicQuotaSchema
    );