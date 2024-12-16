const express = require('express');
const { getHomePage } = require('../controllers/mainpageController');
const router = express.Router();

router.get('/homepage', getHomePage);

module.exports = router;
