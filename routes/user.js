const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const authMiddleware = require('../utils/authMiddleware');

// Route to get the user's profile
router.get('/profile', authMiddleware, userController.getUserProfile);

// Route to update the user's profile
router.put('/profile', authMiddleware, userController.updateUserProfile);

// Route to get skill progress for the logged-in user
router.get('/skill-progress', authMiddleware, userController.getSkillProgress);

// Route to update skill progress
router.put('/skill-progress', authMiddleware, userController.updateSkillProgress);

// Route to join a community/group
router.post('/join-community', authMiddleware, userController.joinCommunity);

// Route to leave a community/group
router.post('/leave-community', authMiddleware, userController.leaveCommunity);

// Route to get user-specific dashboard data
router.get('/dashboard', authMiddleware, userController.getUserDashboard);

module.exports = router;