const { connect } = require('../db/mongoose');
const { success, failure } = require('../utils/response');
const mentorService = require('./services/mentorService');

module.exports.createMentor = async (event) => {
  try {
    await connect();
    const body = event.body ? JSON.parse(event.body) : {};
    const mentor = await mentorService.createMentor(body);
    return success(mentor, 201);
  } catch (error) {
    console.error('Create mentor error:', error);
    return failure(error.message || 'Error creating mentor', 400);
  }
};

module.exports.getMentor = async (event) => {
  try {
    await connect();
    const { id } = event.pathParameters || {};
    if (!id) return failure('ID parameter is required', 400);

    const mentor = await mentorService.getMentorById(id);
    if (!mentor) return failure('Mentor not found', 404);

    return success(mentor);
  } catch (error) {
    return failure('Error fetching mentor details');
  }
};

module.exports.updateMentor = async (event) => {
  try {
    await connect();
    const { id } = event.pathParameters || {};
    const body = event.body ? JSON.parse(event.body) : {};
    
    if (!id) return failure('ID parameter is required', 400);

    const updatedMentor = await mentorService.updateMentor(id, body);
    return success(updatedMentor);
  } catch (error) {
    return failure(error.message || 'Error updating mentor', 400);
  }
};

module.exports.deleteMentor = async (event) => {
  try {
    await connect();
    const { id } = event.pathParameters || {};
    if (!id) return failure('ID parameter is required', 400);

    await mentorService.deleteMentor(id);
    return success({ message: 'Mentor deleted successfully' });
  } catch (error) {
    return failure(error.message || 'Error deleting mentor', 400);
  }
};

module.exports.listMentors = async (event) => {
  try {
    await connect();
    const qs = event.queryStringParameters || {};
    
    const params = {
      page: qs.page ? Number(qs.page) : 1,
      limit: qs.limit ? Number(qs.limit) : 10,
      sortBy: qs.sortBy || 'createdAt',
      sortOrder: qs.sortOrder || 'ASC',
      filters: {
        name: qs.name,
        email: qs.email,
        status: qs.status,
        expertise: qs.expertise
      }
    };

    const result = await listMentors(params);
    return success(result);
  } catch (error) {
    console.error('List mentors error:', error);
    return failure('Error fetching mentors list');
  }
};