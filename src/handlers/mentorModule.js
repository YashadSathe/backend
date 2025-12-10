const { connect } = require('../db/mongoose');
const { success, failure } = require('../utils/response');
const courseService = require('../services/courseService');
const sessionService = require('../services/sessionService');
const assignmentService = require('../services/assignmentService');

// Courses
module.exports.createCourse = async (event) => {
  await connect();
  const body = JSON.parse(event.body);
  const course = await courseService.createCourse(body);
  return success(course, 201);
};

module.exports.getMyCourses = async (event) => {
  await connect();
  const { mentorId } = event.queryStringParameters;
  const courses = await courseService.getMentorCourses(mentorId);
  return success(courses);
};

module.exports.updateCurriculum = async (event) => {
  await connect();
  const { id } = event.pathParameters;
  const body = JSON.parse(event.body);
  const updated = await courseService.updateCurriculum(id, body.curriculum);
  return success(updated);
};

// Session
module.exports.scheduleSession = async (event) => {
  await connect();
  const body = JSON.parse(event.body);
  const session = await sessionService.createSession(body);
  return success(session, 201);
};

module.exports.getMySessions = async (event) => {
  await connect();
  const { mentorId } = event.queryStringParameters;
  const sessions = await sessionService.getMentorSessions(mentorId);
  return success(sessions);
};

// Assignments
module.exports.createAssignment = async (event) => {
  await connect();
  const body = JSON.parse(event.body);
  const assignment = await assignmentService.createAssignment(body);
  return success(assignment, 201);
};

module.exports.getPendingSubmissions = async (event) => {
  await connect();
  const { mentorId } = event.queryStringParameters;
  const submissions = await assignmentService.getPendingSubmissions(mentorId);
  return success(submissions);
};

module.exports.reviewSubmission = async (event) => {
  await connect();
  const { id } = event.pathParameters;
  const body = JSON.parse(event.body);
  const result = await assignmentService.reviewSubmission(id, body);
  return success(result);
};