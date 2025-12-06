const { connect } = require('../db/mongoose');
const { success, failure } = require('../utils/response');
const {
  createAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  listAdmins,
} = require('../services/adminService');
const { verifyToken } = require('../services/authService');

const requireAdmin = (event) => {
  const hdr = event.headers && (event.headers.Authorization || event.headers.authorization);
  if (!hdr) throw new Error('Unauthorized');
  const token = hdr.replace('Bearer ', '');
  const payload = verifyToken(token);
  if (!payload || payload.role !== 'admin') throw new Error('Forbidden');
  return payload;
};

module.exports.createAdmin = async (event) => {
  try {
    await connect();
    requireAdmin(event);
    const body = event.body ? JSON.parse(event.body) : {};
    const admin = await createAdmin(body);
    return success(admin);
  } catch (err) {
    console.error('createAdmin error', err.message || err);
    return failure(err.message || 'Error creating admin', 400);
  }
};

module.exports.listAdmins = async (event) => {
  try {
    await connect();
    requireAdmin(event);
    const qs = event.queryStringParameters || {};
    const page = qs.page ? Number(qs.page) : 1;
    const limit = qs.limit ? Number(qs.limit) : 10;
    const filters = {};
    if (qs.name) filters.name = qs.name;
    if (qs.email) filters.email = qs.email;
    const result = await listAdmins({ page, limit, filters });
    return success(result);
  } catch (err) {
    console.error('listAdmins error', err.message || err);
    return failure(err.message || 'Error listing admins');
  }
};

module.exports.getAdmin = async (event) => {
  try {
    await connect();
    requireAdmin(event);
    const id = event.pathParameters && event.pathParameters.id;
    if (!id) return failure('id required', 400);
    const admin = await getAdminById(id);
    if (!admin) return failure('Not found', 404);
    return success(admin);
  } catch (err) {
    console.error('getAdmin error', err.message || err);
    return failure(err.message || 'Error fetching admin');
  }
};

module.exports.updateAdmin = async (event) => {
  try {
    await connect();
    requireAdmin(event);
    const id = event.pathParameters && event.pathParameters.id;
    const body = event.body ? JSON.parse(event.body) : {};
    const updated = await updateAdmin(id, body);
    return success(updated);
  } catch (err) {
    console.error('updateAdmin error', err.message || err);
    return failure(err.message || 'Error updating admin', 400);
  }
};

module.exports.deleteAdmin = async (event) => {
  try {
    await connect();
    requireAdmin(event);
    const id = event.pathParameters && event.pathParameters.id;
    await deleteAdmin(id);
    return success({ deleted: true });
  } catch (err) {
    console.error('deleteAdmin error', err.message || err);
    return failure(err.message || 'Error deleting admin', 400);
  }
};
