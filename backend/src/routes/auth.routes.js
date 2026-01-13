const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    logoutUser,
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Temporary protected route for verification
router.get('/me', protect, (req, res) => {
    res.status(200).json(req.user);
});

module.exports = router;
