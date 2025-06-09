const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Property = require('../models/Property');
const Booking = require('../models/Booking');

// Apply auth middleware to all routes
router.use(auth);
router.use(authorize('client'));

// Get all approved properties
router.get('/properties', async (req, res) => {
  try {
    const { city, minPrice, maxPrice, capacity } = req.query;
    const query = { isApproved: true, status: 'available' };

    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }
    if (minPrice) {
      query.price = { ...query.price, $gte: minPrice };
    }
    if (maxPrice) {
      query.price = { ...query.price, $lte: maxPrice };
    }
    if (capacity) {
      query.capacity = { $gte: capacity };
    }

    const properties = await Property.find(query)
      .populate('owner', 'name email phone');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get property details
router.get('/properties/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'name email phone');
    
    if (!property || !property.isApproved) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create booking
router.post('/bookings', async (req, res) => {
  try {
    const { propertyId, startDate, endDate } = req.body;

    const property = await Property.findById(propertyId);
    if (!property || !property.isApproved || property.status !== 'available') {
      return res.status(400).json({ message: 'Property not available for booking' });
    }

    // Calculate total amount
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const totalAmount = property.price * days;

    const booking = new Booking({
      property: propertyId,
      client: req.user._id,
      owner: property.owner,
      startDate,
      endDate,
      totalAmount,
      status: 'pending'
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get client's bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find({ client: req.user._id })
      .populate('property', 'title location images')
      .populate('owner', 'name email phone');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel booking
router.put('/bookings/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      client: req.user._id
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 