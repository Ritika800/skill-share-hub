// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Ensure this path is correct

// User registration route
router.post('/register', authController.registerUser); // Ensure this matches the export

// User login route
router.post('/login', authController.loginUser); // Ensure this matches the export

module.exports = router;
