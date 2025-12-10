const { Schema } = require('mongoose');
const { mongoose } = require('../db/mongoose');

const submissionSchema = new Schema({
  assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
  submissionUrl: { type: String, required: true },
  feedback: { type: String },
  
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  submittedAt: { type: Date, default: Date.now }
}, { collection: 'submissions', timestamps: true });

module.exports = mongoose.models.Submission || mongoose.model('Submission', submissionSchema);