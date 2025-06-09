import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const createTestUsers = async () => {
  try {
    // Check if test owner exists
    let owner = await User.findOne({ email: 'testowner@example.com' });
    if (!owner) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      owner = await User.create({
        name: 'Test Owner',
        email: 'testowner@example.com',
        password: hashedPassword,
        role: 'property_owner',
        phone: '1234567890'
      });
      console.log('Test owner created:', owner._id);
    }

    // Check if test client exists
    let client = await User.findOne({ email: 'testclient@example.com' });
    if (!client) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      client = await User.create({
        name: 'Test Client',
        email: 'testclient@example.com',
        password: hashedPassword,
        role: 'client',
        phone: '0987654321'
      });
      console.log('Test client created:', client._id);
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error creating test users:', error);
    process.exit(1);
  }
};

createTestUsers(); 