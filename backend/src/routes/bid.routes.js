const express = require('express');
const router = express.Router();
const { submitBid, getBidsByGig, hireBid } = require('../controllers/bid.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, submitBid);
router.get('/:gigId', protect, getBidsByGig);
router.patch('/:bidId/hire', protect, hireBid);

module.exports = router;
