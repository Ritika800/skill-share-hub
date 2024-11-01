require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/message');
const userRoutes = require('./routes/user');
const User = require('./models/user'); // Import User model
const Skill = require('./models/skillProgress'); // Import Skill model

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

// Socket.io for real-time messaging
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('sendMessage', (message) => {
    io.emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Sample Data Insertion Function
const insertSampleData = async () => {
  // Clear existing data
  await User.deleteMany({});
  await Skill.deleteMany({});

  // Sample users
  const users = await User.insertMany([
    { name: 'Alice', email: 'alice@example.com', password: 'hashed_password_1' },
    { name: 'Bob', email: 'bob@example.com', password: 'hashed_password_2' },
  ]);

  // Sample skills
  await Skill.insertMany([
    { name: 'JavaScript', progressStatus: 'Beginner', level: 1 },
    { name: 'Python', progressStatus: 'Intermediate', level: 2 },
  ]);

  console.log('Sample data inserted successfully');
};
//sample communities
db.communities.insertMany([
    {
      name: 'JavaScript Learners',
      description: 'A community for those who want to learn JavaScript together.',
      members: [],
      createdAt: new Date()
    }
  ])

  // sample feedback
  db.feedbacks.insertMany([
    {
      userId: ObjectId("6724a75944674d6d7ae07666"), 
      rating: 5,
      comment: 'Great experience!',
      createdAt: new Date()
    },

    {
        userId: ObjectId("6724a75944674d6d7ae07667"), 
        rating: 4,
        comment: 'Very helpful!',
        createdAt: new Date()
      }
  ])

  //sample messages
  db.messages.insertMany([
    {
      senderId: ObjectId("6724a75944674d6d7ae07667"), 
      receiverId: ObjectId("6724a75944674d6d7ae07666"), 
      content: 'Hello, how can I help you with your skill?',
      timestamp: new Date()
    }
  ])
  
  
// Connect to MongoDB and start server
const startServer = async () => {
  await connectDB();
  await insertSampleData(); // Call sample data insertion
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer().catch(err => {
  console.error(err);
  process.exit(1);
});
