import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const createDummyBookings = async () => {
  try {
    // Find a property owner
    const owner = await User.findOne({ role: 'property_owner' });
    if (!owner) {
      console.error('No property owner found. Please create a property owner first.');
      process.exit(1);
    }

    // Find a client
    const client = await User.findOne({ role: 'client' });
    if (!client) {
      console.error('No client found. Please create a client first.');
      process.exit(1);
    }

    // Find a property
    const property = await Property.findOne({ owner: owner._id });
    if (!property) {
      console.error('No property found. Please create a property first.');
      process.exit(1);
    }

    // Create dummy bookings
    const bookings = [
      {
        property: property._id,
        client: client._id,
        owner: owner._id,
        checkInDate: new Date('2024-04-15'),
        checkOutDate: new Date('2024-05-15'),
        status: 'pending',
        totalAmount: property.price * 30, // 30 days
        paymentStatus: 'pending'
      },
      {
        property: property._id,
        client: client._id,
        owner: owner._id,
        checkInDate: new Date('2024-05-01'),
        checkOutDate: new Date('2024-06-01'),
        status: 'confirmed',
        totalAmount: property.price * 31, // 31 days
        paymentStatus: 'completed'
      },
      {
        property: property._id,
        client: client._id,
        owner: owner._id,
        checkInDate: new Date('2024-06-15'),
        checkOutDate: new Date('2024-07-15'),
        status: 'cancelled',
        totalAmount: property.price * 30, // 30 days
        paymentStatus: 'refunded'
      }
    ];

    // Insert bookings
    await Booking.insertMany(bookings);
    console.log('Dummy bookings created successfully!');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error creating dummy bookings:', error);
    process.exit(1);
  }
};

createDummyBookings(); 