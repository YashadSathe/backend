module.exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Lambda with MongoDB (Mongoose)!' }),
  };
};
