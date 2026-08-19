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


// One quota record per clinic per day
dailyClinicQuotaSchema.index(
    {
        clinicId: 1,
        date: 1,
    },
    {
        unique: true,
    }
);


// Automatically delete expired daily quota records
dailyClinicQuotaSchema.index(
    {
        expiresAt: 1,
    },
    {
        expireAfterSeconds: 0,
    }
);


module.exports =
    mongoose.models.DailyClinicQuota ||
    mongoose.model(
        "DailyClinicQuota",
        dailyClinicQuotaSchema
    );