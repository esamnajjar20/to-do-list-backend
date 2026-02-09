import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGO_URL || process.env.DB_URI;
  if (!uri) {
    throw new Error('Missing MONGO_URL or DB_URI in environment variables');
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};




