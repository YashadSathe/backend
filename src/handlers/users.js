const { connect } = require('../db/mongoose');
const { success, failure } = require('../utils/response');
const {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  listUsers,
} = require('../services/userService');

module.exports.createUser = async (event) => {
  try {
    await connect();
    const body = event.body ? JSON.parse(event.body) : {};
    const { name, email, password } = body;
    const user = await createUser({ name, email, password });
    return success(user);
  } catch (error) {
    console.error('Create user error:', error.message || error);
    return failure(error.message || 'Error creating user', 400);
  }
};

module.exports.listUsers = async (event) => {
  try {
    await connect();
    const qs = event.queryStringParameters || {};
    const page = qs.page ? Number(qs.page) : 1;
    const limit = qs.limit ? Number(qs.limit) : 10;
    const filters = {};
    if (qs.name) filters.name = qs.name;
    if (qs.email) filters.email = qs.email;
    const sortBy = qs.sortBy || 'id';
    const sortOrder = qs.sortOrder || 'ASC';

    const result = await listUsers({ page, limit, filters, sortBy, sortOrder });
    return success(result);
  } catch (error) {
    console.error('List users error:', error.message || error);
    return failure(error.message || 'Error listing users');
  }
};

module.exports.getUser = async (event) => {
  try {
    await connect();
    const id = event.pathParameters && event.pathParameters.id;
    if (!id) return failure('id parameter required', 400);
    const user = await getUserById(id);
    if (!user) return failure('User not found', 404);
    return success(user);
  } catch (error) {
    console.error('Get user error:', error.message || error);
    return failure(error.message || 'Error fetching user');
  }
};

module.exports.updateUser = async (event) => {
  try {
    await connect();
    const id = event.pathParameters && event.pathParameters.id;
    if (!id) return failure('id parameter required', 400);
    const body = event.body ? JSON.parse(event.body) : {};
    const updated = await updateUser(id, body);
    return success(updated);
  } catch (error) {
    console.error('Update user error:', error.message || error);
    return failure(error.message || 'Error updating user', 400);
  }
};

module.exports.deleteUser = async (event) => {
  try {
    await connect();
    const id = event.pathParameters && event.pathParameters.id;
    if (!id) return failure('id parameter required', 400);
    await deleteUser(id);
    return success({ deleted: true });
  } catch (error) {
    console.error('Delete user error:', error.message || error);
    return failure(error.message || 'Error deleting user', 400);
  }
};
