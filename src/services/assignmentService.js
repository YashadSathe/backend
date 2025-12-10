const Assignment = require('../models/assignment');
const Submission = require('../models/submission');

// Assignment CRUD
exports.createAssignment = async (data) => {
  return await Assignment.create(data);
};

exports.getMentorAssignments = async (mentorId) => {
  return await Assignment.find({ mentorId }).sort({ createdAt: -1 });
};

// Submission Logic
exports.getPendingSubmissions = async (mentorId) => {
  const assignments = await Assignment.find({ mentorId }).select('_id');
  const assignmentIds = assignments.map(a => a._id);

  return await Submission.find({ 
    assignmentId: { $in: assignmentIds },
    status: 'pending'
  })
  .populate('assignmentId', 'title')
  .populate('studentId', 'name email avatar');
};

exports.reviewSubmission = async (submissionId, { status, feedback }) => {
  return await Submission.findByIdAndUpdate(
    submissionId, 
    { status, feedback }, 
    { new: true }
  );
};