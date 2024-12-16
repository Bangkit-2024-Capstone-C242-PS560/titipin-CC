const express = require('express');
const { addReview, getProductReviews } = require('../controllers/reviewController');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

router.post('/', authenticateToken, addReview);
router.get('/:productId', getProductReviews);

module.exports = router;
