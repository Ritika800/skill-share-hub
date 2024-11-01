const Message = require('../models/Message');
const User = require('../models/user');

// Send a Message
exports.sendMessage = async (req, res) => {
  try {
    const { receiver, content } = req.body;
    const sender = req.user.userId;

    // Check if the receiver exists
    const receiverUser = await User.findById(receiver);
    if (!receiverUser) return res.status(404).json({ message: 'Receiver not found' });

    // Create and save the message
    const message = new Message({ sender, receiver, content });
    await message.save();

    res.status(201).json({ message: 'Message sent successfully', message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Conversation History
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params; // ID of the other user in the conversation
    const currentUserId = req.user.userId;

    // Find messages between the current user and the specified user
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    }).sort({ createdAt: 1 }); // Ensure your schema has a `createdAt` field, or replace with `timestamp` if used

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Recent Messages for User's Inbox
exports.getRecentMessages = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find the latest message in each conversation
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { receiver: userId }
          ]
        }
      },
      {
        $sort: { createdAt: -1 } // Ensure `createdAt` field exists in Message schema
      },
      {
        $group: {
          _id: {
            otherUser: {
              $cond: {
                if: { $eq: ['$sender', userId] },
                then: '$receiver',
                else: '$sender'
              }
            }
          },
          latestMessage: { $first: '$$ROOT' }
        }
      },
      { $replaceRoot: { newRoot: '$latestMessage' } },
      { $sort: { createdAt: -1 } }
    ]);

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
