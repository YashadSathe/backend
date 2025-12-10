const { Schema } = require('mongoose');
const { mongoose } = require('../db/mongoose');

const mentorSchema = new Schema({
  // Identity
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  phone: { type: String },
  avatar: { type: String },
  
  // Information
  bio: { type: String },
  experience: { type: String },
  expertise: [{ type: String }],
  linkedIn: { type: String },
  
  // Data
  assignedCourses: [{ type: String }],
  role: { type: String, default: 'mentor', immutable: true },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'pending'], 
    default: 'pending' 
  },

  // Settings 
  notifications: {
    newSubmissions: { type: Boolean, default: true },
    studentMessages: { type: Boolean, default: true },
    sessionReminders: { type: Boolean, default: true },
    platformUpdates: { type: Boolean, default: false },
  },
  security: {
    twoFactorEnabled: { type: Boolean, default: false },
  },

  lastActive: { type: Date }
}, { 
  collection: 'mentors', 
  timestamps: true 
});

module.exports = mongoose.models.Mentor || mongoose.model('Mentor', mentorSchema);