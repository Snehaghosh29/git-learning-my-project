const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const Property = require('../models/Property');
const Booking = require('../models/Booking');

// Apply auth middleware to all routes
router.use(auth);
router.use(authorize('property_owner'));

// Add new property
router.post('/properties', upload.array('images', 5), async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      price,
      capacity,
      availableRooms,
      amenities
    } = req.body;

    const images = req.files.map(file => ({
      url: file.path,
      public_id: file.filename
    }));

    const property = new Property({
      owner: req.user._id,
      title,
      description,
      location: JSON.parse(location),
      price,
      capacity,
      availableRooms,
      amenities: JSON.parse(amenities),
      images
    });

    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get owner's properties
router.get('/properties', async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update property
router.put('/properties/:id', upload.array('images', 5), async (req, res) => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const updates = req.body;
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map(file => ({
        url: file.path,
        public_id: file.filename
      }));
    }

    Object.assign(property, updates);
    await property.save();

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete property
router.delete('/properties/:id', async (req, res) => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    await property.remove();
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get property bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id })
      .populate('property', 'title location')
      .populate('client', 'name email phone');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status
router.put('/bookings/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 