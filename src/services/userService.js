const User = require('../models/user');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

exports.createUser = async ({ name, email, password }) => {
  if (!name || !email || !password) throw new Error('name, email and password required');

  const existing = await User.findOne({ email });
  if (existing) throw new Error('User already exists');

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  const obj = user.toObject();
  delete obj.password;
  return obj;
};

exports.getUserById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const user = await User.findById(id).select('-password');
  return user;
};

exports.updateUser = async (id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid id');
  const user = await User.findById(id);
  if (!user) throw new Error('User not found');

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  Object.assign(user, data);
  await user.save();
  const updated = await User.findById(id).select('-password');
  return updated;
};

exports.deleteUser = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid id');
  const user = await User.findById(id);
  if (!user) throw new Error('User not found');
  await user.remove();
  return true;
};

exports.listUsers = async ({ page = 1, limit = 10, filters = {}, sortBy = 'createdAt', sortOrder = 'ASC' } = {}) => {
  const q = {};
  if (filters.name) q.name = { $regex: filters.name, $options: 'i' };
  if (filters.email) q.email = { $regex: filters.email, $options: 'i' };

  const skip = (Math.max(page, 1) - 1) * limit;
  const sort = { [sortBy]: sortOrder.toUpperCase() === 'DESC' ? -1 : 1 };

  const [total, data] = await Promise.all([
    User.countDocuments(q),
    User.find(q).select('-password').sort(sort).skip(skip).limit(Number(limit)),
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
