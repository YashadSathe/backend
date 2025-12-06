const { Schema } = require('mongoose');
const { mongoose } = require('../db/mongoose');

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
}, { collection: 'users', timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
