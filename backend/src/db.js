const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/micron_auth';

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ Connected to MongoDB successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error('⚠️ MongoDB connection warning / error:', error.message);
    console.log('💡 Note: Ensure MongoDB is running locally (e.g., mongod or MongoDB Compass) or set MONGODB_URI in backend/.env');
  }
};

module.exports = {
  connectDb,
};
