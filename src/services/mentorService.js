const Mentor = require('../models/mentor');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Create a new mentor
exports.createMentor = async (data) => {
  const { name, email, password } = data;
  if (!name || !email || !password) {
    throw new Error('Name, email, and password are required');
  }

  const existing = await Mentor.findOne({ email });
  if (existing) throw new Error('Mentor with this email already exists');

  const hashed = await bcrypt.hash(password, 10);
  
  // Initialize with default settings
  const mentor = await Mentor.create({
    ...data,
    password: hashed,
    role: 'mentor',
    notifications: data.notifications || {
      newSubmissions: true,
      studentMessages: true,
      sessionReminders: true,
      platformUpdates: false,
    }
  });

  const obj = mentor.toObject();
  delete obj.password;
  return obj;
};

// Get mentor profile (for Profile.tsx and Dashboard.tsx)
exports.getMentorById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Mentor.findById(id).select('-password');
};

// Update mentor (Supports Profile.tsx form & Settings.tsx toggles)
exports.updateMentor = async (id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid ID');
  
  const mentor = await Mentor.findById(id);
  if (!mentor) throw new Error('Mentor not found');

  // Handle Password Change (Settings.tsx)
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  // Handle Email Change Safety
  if (data.email && data.email !== mentor.email) {
    const emailExists = await Mentor.findOne({ email: data.email });
    if (emailExists) throw new Error('Email already in use');
  }

  // Handle Nested Updates (e.g., updating just one notification setting)
  if (data.notifications) {
    data.notifications = { ...mentor.notifications, ...data.notifications };
  }
  if (data.security) {
    data.security = { ...mentor.security, ...data.security };
  }

  Object.assign(mentor, data);
  await mentor.save();
  
  return await Mentor.findById(id).select('-password');
};

// Delete mentor
exports.deleteMentor = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid ID');
  const result = await Mentor.findByIdAndDelete(id);
  if (!result) throw new Error('Mentor not found');
  return true;
};

// List mentors (For Admin Users page)
exports.listMentors = async ({ page = 1, limit = 10, filters = {}, sortBy = 'createdAt', sortOrder = 'ASC' } = {}) => {
  const q = {};
  
  if (filters.name) q.name = { $regex: filters.name, $options: 'i' };
  if (filters.email) q.email = { $regex: filters.email, $options: 'i' };
  if (filters.status) q.status = filters.status;
  if (filters.expertise) {
    q.expertise = { $in: [new RegExp(filters.expertise, 'i')] };
  }

  const skip = (Math.max(page, 1) - 1) * limit;
  const sort = { [sortBy]: sortOrder.toUpperCase() === 'DESC' ? -1 : 1 };

  const [total, data] = await Promise.all([
    Mentor.countDocuments(q),
    Mentor.find(q).select('-password').sort(sort).skip(skip).limit(Number(limit)),
  ]);

  return {
    data,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit) || 0,
    },
  };
};