const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

exports.createAdmin = async ({ name, email, password }) => {
  if (!name || !email || !password) throw new Error('name,email,password required');
  const existing = await Admin.findOne({ email });
  if (existing) throw new Error('Admin already exists');
  const hashed = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ name, email, password: hashed, role: 'admin' });
  const obj = admin.toObject(); delete obj.password; return obj;
};

exports.getAdminById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Admin.findById(id).select('-password');
};

exports.updateAdmin = async (id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid id');
  const admin = await Admin.findById(id);
  if (!admin) throw new Error('Admin not found');
  if (data.password) data.password = await bcrypt.hash(data.password, 10);
  Object.assign(admin, data);
  await admin.save();
  return await Admin.findById(id).select('-password');
};

exports.deleteAdmin = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid id');
  const admin = await Admin.findById(id);
  if (!admin) throw new Error('Admin not found');
  await admin.remove();
  return true;
};

exports.listAdmins = async ({ page = 1, limit = 10, filters = {} } = {}) => {
  const q = {};
  if (filters.name) q.name = { $regex: filters.name, $options: 'i' };
  if (filters.email) q.email = { $regex: filters.email, $options: 'i' };
  const skip = (Math.max(page, 1) - 1) * limit;
  const [total, data] = await Promise.all([
    Admin.countDocuments(q),
    Admin.find(q).select('-password').skip(skip).limit(Number(limit)),
  ]);
  return { data, meta: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) || 0 } };
};
