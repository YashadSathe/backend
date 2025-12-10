const Session = require('../models/session');

exports.createSession = async (data) => {
  return await Session.create(data);
};

exports.getMentorSessions = async (mentorId) => {
  return await Session.find({ mentorId }).populate('courseId', 'title');
};

exports.updateSession = async (id, data) => {
  return await Session.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteSession = async (id) => {
  return await Session.findByIdAndDelete(id);
};