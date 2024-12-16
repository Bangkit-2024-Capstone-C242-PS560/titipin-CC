const express = require('express');
const { registerUser, loginUser, getUserDetails } = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticateToken, getUserDetails); 

module.exports = router;
