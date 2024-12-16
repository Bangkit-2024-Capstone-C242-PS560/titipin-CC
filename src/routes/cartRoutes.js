const express = require('express');
const { addToCart, getCart, removeFromCart } = require('../controllers/cartController');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

router.post('/', authenticateToken, addToCart);
router.get('/', authenticateToken, getCart);
router.delete('/:id', authenticateToken, removeFromCart);

module.exports = router;
