const { Schema } = require('mongoose');
const { mongoose } = require('../db/mongoose');

const adminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
}, { collection: 'admins', timestamps: true });

module.exports = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
