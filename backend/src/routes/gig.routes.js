const express = require('express');
const router = express.Router();
const { createGig, getAllGigs } = require('../controllers/gig.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, createGig);
router.get('/', getAllGigs);

module.exports = router;
