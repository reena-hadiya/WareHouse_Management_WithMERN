const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, resetPassword, changePassword, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/changepassword', protect, changePassword);
router.get('/me', protect, getMe);

module.exports = router;
