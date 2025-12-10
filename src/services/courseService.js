const Course = require('../models/course');
const mongoose = require('mongoose');

exports.createCourse = async (data) => {
  const course = await Course.create(data);
  return course.toObject();
};

exports.getMentorCourses = async (mentorId) => {
  return await Course.find({ mentorId }).sort({ createdAt: -1 });
};

exports.getCourseById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Course.findById(id).populate('students', '-password');
};

exports.updateCourse = async (id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid id');
  const course = await Course.findById(id);
  if (!course) throw new Error('Course not found');
  Object.assign(course, data);
  await course.save();
  return await Course.findById(id).populate('students', '-password');
};

exports.deleteCourse = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid id');
  const course = await Course.findById(id);
  if (!course) throw new Error('Course not found');
  await course.remove();
  return true;
};

exports.updateCurriculum = async (courseId, curriculum) => {
  return await Course.findByIdAndUpdate(
    courseId, 
    { curriculum }, 
    { new: true }
  );
};

exports.listCourses = async ({ page = 1, limit = 10, filters = {}, sortBy = 'createdAt', sortOrder = 'ASC' } = {}) => {
  const q = {};
  if (filters.title) q.title = { $regex: filters.title, $options: 'i' };
  if (filters.instructor) q.instructor = { $regex: filters.instructor, $options: 'i' };
  if (filters.status) q.status = filters.status;
  if (filters.tag) q.tags = filters.tag;

  const skip = (Math.max(page, 1) - 1) * limit;
  const sort = { [sortBy]: sortOrder.toUpperCase() === 'DESC' ? -1 : 1 };

  const [total, data] = await Promise.all([
    Course.countDocuments(q),
    Course.find(q).sort(sort).skip(skip).limit(Number(limit)).populate('students', '-password'),
  ]);

  return {
    data,
    meta: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) || 0 },
  };
};

exports.enrollStudent = async (courseId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(userId)) throw new Error('Invalid id');
  const course = await Course.findById(courseId);
  if (!course) throw new Error('Course not found');
  if (course.capacity && course.students.length >= course.capacity) throw new Error('Course is full');
  if (course.students.includes(userId)) return course;
  course.students.push(userId);
  await course.save();
  return await course.populate('students', '-password');
};
