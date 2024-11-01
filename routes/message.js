const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../utils/authMiddleware');

// Route to send a message
router.post('/send', authMiddleware, messageController.sendMessage);

// Route to get all messages between two users (for one-on-one conversations)
router.get('/conversation/:userId', authMiddleware, messageController.getConversation);

// Route to get all messages in a group/community (if applicable)
router.get('/group/:groupId', authMiddleware, messageController.getGroupMessages);

module.exports = router;