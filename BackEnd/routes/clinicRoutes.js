// const express       = require('express');
// const router        = express.Router();
// const { getClinics, addClinic , toggleClinicStatus , getAllClinics } = require('../controllers/clinicController');
// const auth= require('../middleware/auth');


// // Public — المريض مش محتاج Token
// router.get('/', getClinics);

// router.post('/', auth, addClinic);

// //active/inactive toggle for clinic // Admin only
// router.patch('/:clinicId/status', auth, toggleClinicStatus);

// // Get All Clinics // Admin only // Includes active + inactive clinics
// router.get('/all', auth, getAllClinics);

// module.exports = router;

const express = require('express');
const router = express.Router();

const {
    getClinics,
    addClinic,
    toggleClinicStatus,
    getAllClinics
} = require('../controllers/clinicController');

const auth = require('../middleware/auth');


// ========================================================
// PUBLIC ROUTES
// ========================================================

// Get active clinics
router.get('/', getClinics);


// ========================================================
// ADMIN ROUTES
// ========================================================

// Add new clinic
router.post('/', auth, addClinic);

// Get all clinics
// Includes active + inactive
router.get('/all', auth, getAllClinics);

// Toggle clinic active/inactive
router.patch('/:clinicId/status', auth, toggleClinicStatus);


module.exports = router;