const express = require('express');
const { createEvent, updateEvent, getAllEvents, getEventById, addProductToEvent, getProductsByEvent } = require('../controllers/eventController');
const authenticateToken = require('../middleware/authenticateToken'); 
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();
const { getMainPage } = require('../controllers/mainpageController');


//router.get('/homepage', authenticateToken, getMainPage);
router.post('/', authenticateToken, upload.single('image'), createEvent);
router.put('/:id', authenticateToken, updateEvent);
router.get('/', getAllEvents);
router.get('/:id', authenticateToken, getEventById);
router.post('/:id/products', authenticateToken, upload.single('image'), addProductToEvent);
router.get('/:id/products', authenticateToken, getProductsByEvent);


module.exports = router;
