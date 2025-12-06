const { connect } = require('../db/mongoose');
const { success, failure } = require('../utils/response');
const {
  createCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
  listCourses,
  enrollStudent,
} = require('../services/courseService');
const { verifyToken } = require('../services/authService');

const requireAuth = (event) => {
  const hdr = event.headers && (event.headers.Authorization || event.headers.authorization);
  if (!hdr) throw new Error('Unauthorized');
  const token = hdr.replace('Bearer ', '');
  const payload = verifyToken(token);
  if (!payload) throw new Error('Forbidden');
  return payload;
};

module.exports.createCourse = async (event) => {
  try {
    await connect();
    requireAuth(event);
    const body = event.body ? JSON.parse(event.body) : {};
    const course = await createCourse(body);
    return success(course);
  } catch (err) {
    console.error('createCourse error', err.message || err);
    return failure(err.message || 'Error creating course', 400);
  }
};

module.exports.listCourses = async (event) => {
  try {
    await connect();
    const qs = event.queryStringParameters || {};
    const page = qs.page ? Number(qs.page) : 1;
    const limit = qs.limit ? Number(qs.limit) : 10;
    const filters = {};
    if (qs.title) filters.title = qs.title;
    if (qs.instructor) filters.instructor = qs.instructor;
    if (qs.status) filters.status = qs.status;
    const result = await listCourses({ page, limit, filters, sortBy: qs.sortBy, sortOrder: qs.sortOrder });
    return success(result);
  } catch (err) {
    console.error('listCourses error', err.message || err);
    return failure(err.message || 'Error listing courses');
  }
};

module.exports.getCourse = async (event) => {
  try {
    await connect();
    const id = event.pathParameters && event.pathParameters.id;
    if (!id) return failure('id required', 400);
    const course = await getCourseById(id);
    if (!course) return failure('Not found', 404);
    return success(course);
  } catch (err) {
    console.error('getCourse error', err.message || err);
    return failure(err.message || 'Error fetching course');
  }
};

module.exports.updateCourse = async (event) => {
  try {
    await connect();
    requireAuth(event);
    const id = event.pathParameters && event.pathParameters.id;
    const body = event.body ? JSON.parse(event.body) : {};
    const updated = await updateCourse(id, body);
    return success(updated);
  } catch (err) {
    console.error('updateCourse error', err.message || err);
    return failure(err.message || 'Error updating course', 400);
  }
};

module.exports.deleteCourse = async (event) => {
  try {
    await connect();
    requireAuth(event);
    const id = event.pathParameters && event.pathParameters.id;
    await deleteCourse(id);
    return success({ deleted: true });
  } catch (err) {
    console.error('deleteCourse error', err.message || err);
    return failure(err.message || 'Error deleting course', 400);
  }
};

module.exports.enroll = async (event) => {
  try {
    await connect();
    const payload = requireAuth(event);
    const id = event.pathParameters && event.pathParameters.id;
    if (!id) return failure('id required', 400);
    const result = await enrollStudent(id, payload.id);
    return success(result);
  } catch (err) {
    console.error('enroll error', err.message || err);
    return failure(err.message || 'Error enrolling', 400);
  }
};
