module.exports.success = (data) => ({
  statusCode: 200,
  body: JSON.stringify({ success: true, data }),
});

module.exports.failure = (message, statusCode = 500) => ({
  statusCode,
  body: JSON.stringify({ success: false, message }),
});
