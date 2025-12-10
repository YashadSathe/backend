const { Schema } = require('mongoose');
const { mongoose } = require('../db/mongoose');

const assignmentSchema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  mentorId: { type: Schema.Types.ObjectId, ref: 'Mentor', required: true },
  
  title: { type: String, required: true },
  description: { type: String },
  instructions: { type: String },   
  dueDate: { type: Date },
  
  status: { type: String, enum: ['draft', 'published'], default: 'draft' }
}, { collection: 'assignments', timestamps: true });

module.exports = mongoose.models.Assignment || mongoose.model('Assignment', assignmentSchema);