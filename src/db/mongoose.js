const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

let connection = null;

async function connect() {
  if (connection && mongoose.connection.readyState === 1) return mongoose.connection;
  connection = await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('✓ MongoDB connected successfully to:', MONGO_URI);
  return connection;
}

module.exports = { connect, mongoose };
