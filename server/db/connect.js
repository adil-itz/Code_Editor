import mongoose from 'mongoose';
import dns from 'dns';

try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {}

let isConnected = false;

export async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/devspace';
  
  if (isConnected) return true;

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });
    isConnected = true;
    console.log(`Successfully connected to MongoDB Atlas database: ${mongoose.connection.name}`);
    return true;
  } catch (err) {
    console.warn(`MongoDB connection warning: ${err.message}. Using local persistence fallback.`);
    return false;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
