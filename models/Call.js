const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Call schema
const callSchema = new Schema({
  caller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  callType: {
    type: String,
    enum: ['audio', 'video'],
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number, // Duration in seconds
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'ongoing', 'completed', 'missed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update the updatedAt field on save
callSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create the Call model
const Call = mongoose.model('Call', callSchema);

module.exports = Call;