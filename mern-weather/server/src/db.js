const mongoose = require('mongoose');

let isConnected = false;

async function connectToMongo(uri) {
  if (!uri) {
    console.warn('[mongo] No MONGODB_URI provided; running without persistence.');
    return null;
  }
  if (isConnected) return mongoose.connection;
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log('[mongo] Connected');
    return mongoose.connection;
  } catch (error) {
    console.warn('[mongo] Could not connect; proceeding without persistence:', error.message);
    return null;
  }
}

module.exports = { connectToMongo };