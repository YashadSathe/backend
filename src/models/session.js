const { Schema } = require('mongoose');
const { mongoose } = require('../db/mongoose');

const sessionSchema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  mentorId: { type: Schema.Types.ObjectId, ref: 'Mentor', required: true },
  
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  duration: { type: String },
  meetingLink: { type: String },
  
  status: { 
    type: String, 
    enum: ['scheduled', 'live', 'completed', 'cancelled'], 
    default: 'scheduled' 
  }
}, { collection: 'sessions', timestamps: true });

module.exports = mongoose.models.Session || mongoose.model('Session', sessionSchema);