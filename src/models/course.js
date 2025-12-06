const { Schema } = require('mongoose');
const { mongoose } = require('../db/mongoose');

const courseSchema = new Schema({
  title: { type: String, required: true, index: true },
  description: { type: String },
  instructor: { type: String },
  capacity: { type: Number, default: 0 },
  students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  startDate: { type: Date },
  endDate: { type: Date },
  status: { type: String, enum: ['draft','published','archived'], default: 'draft' },
  tags: [{ type: String }],
}, { collection: 'courses', timestamps: true });

module.exports = mongoose.models.Course || mongoose.model('Course', courseSchema);
