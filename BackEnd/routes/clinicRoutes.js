const express       = require('express');
const router        = express.Router();
const { getClinics, addClinic } = require('../controllers/clinicController');
const auth               = require('../middleware/auth');


// Public — المريض مش محتاج Token
router.get('/', getClinics);

router.post('/', auth, addClinic);

module.exports = router;