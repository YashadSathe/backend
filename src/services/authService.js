const User = require('../models/user');
const Mentor = require('../models/mentor')
const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const validateInviteCode = async (code) => {
  return code === 'mentor_2025';  // for testing
};

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

exports.signup = async ({ name, email, password,inviteCode }) => {
  if (!email || !password || !name) throw new Error('name, email and password required');

  let role = 'student';
  let Model = User;

  if (inviteCode) {
    const isValid = await validateInviteCode(inviteCode);
    if (!isValid) throw new Error('Invalid or expired invite');
    
    role = 'mentor';
    Model = Mentor;
  }

  const existing = await Model.findOne({ email });
  if (existing) throw new Error(`${role} already exists with this email`);

  const hashed = await bcrypt.hash(password, 10);
  const doc = await Model.create({ name, email, password: hashed, role });

  const token = jwt.sign({ id: doc._id.toString(), email: doc.email, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return { user: { id: doc._id.toString(), name: doc.name, email: doc.email, role }, token };
};

exports.login = async ({ email, password }) => {
  if (!email || !password) throw new Error('email and password required');

  let doc = await Admin.findOne({ email });
  let role = 'admin';

  if (!doc) {
    doc = await Mentor.findOne({ email });
    role = 'mentor';
  }

  if (!doc) {
    doc = await User.findOne({ email });
    role = 'user';
  }

  if (!doc) throw new Error('Invalid credentials');

  const ok = await bcrypt.compare(password, doc.password);
  if (!ok) throw new Error('Invalid credentials');

  const token = jwt.sign({ id: doc._id.toString(), email: doc.email, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return { user: { id: doc._id.toString(), name: doc.name, email: doc.email, role }, token };
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};
