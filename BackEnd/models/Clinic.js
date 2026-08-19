const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({

    name: {
        type:     String,
        required: true,
        trim:     true,
        unique:   true,

    },

    dailyQuota: {
        type:    Number,
        default: 100,
        min:     1,
    },



    isActive: {
        type:    Boolean,
        default: true
    }

}, { timestamps: true });

module.exports = mongoose.model('Clinic', clinicSchema);