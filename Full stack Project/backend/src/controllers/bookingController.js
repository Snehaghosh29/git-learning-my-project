import Booking from '../models/Booking.js';
import Property from '../models/Property.js';

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { propertyId, checkInDate, checkOutDate } = req.body;
    const clientId = req.user._id;

    // Get property details
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Calculate total amount (you can add more complex pricing logic here)
    const days = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
    const totalAmount = property.price * days;

    const booking = new Booking({
      property: propertyId,
      client: clientId,
      owner: property.owner,
      checkInDate,
      checkOutDate,
      totalAmount
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
};

// Get all bookings for a property owner
export const getOwnerBookings = async (req, res) => {
  try {
    const ownerId = req.user._id;
    console.log('Fetching bookings for owner:', ownerId);

    const bookings = await Booking.find({ owner: ownerId })
      .populate('property', 'name images')
      .populate('client', 'name email')
      .sort({ createdAt: -1 });

    console.log('Found bookings:', bookings.length);
    res.json(bookings);
  } catch (error) {
    console.error('Error in getOwnerBookings:', error);
    res.status(500).json({ 
      message: 'Error fetching bookings',
      error: error.message 
    });
  }
};

// Get all bookings for a client
export const getClientBookings = async (req, res) => {
  try {
    const clientId = req.user._id;
    const bookings = await Booking.find({ client: clientId })
      .populate('property', 'name images')
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching client bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

// Update booking status (confirm/cancel)
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, action } = req.params;
    const ownerId = req.user._id;

    const booking = await Booking.findOne({
      _id: bookingId,
      owner: ownerId
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (action === 'confirm') {
      booking.status = 'confirmed';
    } else if (action === 'cancel') {
      booking.status = 'cancelled';
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await booking.save();
    res.json(booking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Error updating booking status' });
  }
};

// Get booking details
export const getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findOne({
      _id: bookingId,
      $or: [{ client: userId }, { owner: userId }]
    })
      .populate('property', 'name images price')
      .populate('client', 'name email')
      .populate('owner', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({ message: 'Error fetching booking details' });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('property', 'name')
      .populate('user', 'name email');
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

export const getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    res.json({
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings
    });
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    res.status(500).json({ message: 'Error fetching booking statistics' });
  }
}; 