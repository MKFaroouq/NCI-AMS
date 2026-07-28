const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({

    name: {
        type:     String,
        required: true,
        trim:     true
    },

    quota: {
        type:    Number,
        default: 100
    },

    isActive: {
        type:    Boolean,
        default: true
    }

}, { timestamps: true });

module.exports = mongoose.model('Clinic', clinicSchema);