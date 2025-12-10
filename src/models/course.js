const { Schema } = require('mongoose');
const { mongoose } = require('../db/mongoose');

const topicSchema = new Schema({
  title: { type: String, required: true },
  duration: { type: String },
  order: { type: Number }
});

const moduleSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  order: { type: Number },
  topics: [topicSchema]
});

const courseSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  description: { type: String },
  thumbnail: { type: String },
  price: { type: Number },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  category: { type: String },
  mentorId: { type: Schema.Types.ObjectId, ref: 'Mentor', required: true },
  curriculum: [moduleSchema],
  status: { type: String, enum: ['active', 'draft', 'archived'], default: 'draft' }, // keep the course on or off website
  totalStudents: { type: Number, default: 0 },
}, { collection: 'courses', timestamps: true });

module.exports = mongoose.models.Course || mongoose.model('Course', courseSchema);