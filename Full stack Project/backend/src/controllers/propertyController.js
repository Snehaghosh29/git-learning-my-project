import Property from '../models/Property.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const createProperty = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    // Validate required fields
    if (!req.body.name || !req.body.description || !req.body.type || !req.body.price || !req.body.location) {
      return res.status(400).json({ 
        message: 'All required fields must be provided',
        missingFields: {
          name: !req.body.name,
          description: !req.body.description,
          type: !req.body.type,
          price: !req.body.price,
          location: !req.body.location
        }
      });
    }

    // Process uploaded images
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      try {
        // Upload each image to Cloudinary
        for (const file of req.files) {
          const imageUrl = await uploadToCloudinary(file);
          if (imageUrl) {
            imageUrls.push(imageUrl);
          }
        }
      } catch (error) {
        console.error('Error uploading images to Cloudinary:', error);
        return res.status(500).json({ message: 'Error uploading images' });
      }
    }

    // Create the property with the form data
    const property = new Property({
      name: req.body.name,
      description: req.body.description,
      type: req.body.type,
      price: Number(req.body.price),
      location: req.body.location,
      amenities: req.body.amenities ? req.body.amenities.split(',').map(item => item.trim()) : [],
      rules: req.body.rules || '',
      images: imageUrls,
      owner: req.user._id,
      status: 'available',
      isApproved: false
    });

    await property.save();
    res.status(201).json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(400).json({ message: error.message });
  }
};

export const getProperties = async (req, res) => {
  try {
    // Only return approved and available properties for public listing
    const properties = await Property.find({ 
      isApproved: true,
      status: 'available'
    })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      owner: req.user._id,
    }).populate('owner', 'name email');
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Process uploaded images if any
    if (req.files && req.files.length > 0) {
      const newImageUrls = await Promise.all(
        req.files.map(file => uploadToCloudinary(file))
      );
      property.images = [...property.images, ...newImageUrls];
    }

    // Update other fields
    const { name, description, type, price, location, amenities, rules } = req.body;
    if (name) property.name = name;
    if (description) property.description = description;
    if (type) property.type = type;
    if (price) property.price = Number(price);
    if (location) property.location = location;
    if (amenities) property.amenities = Array.isArray(amenities) ? amenities : [];
    if (rules) property.rules = rules;

    await property.save();
    res.json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Delete the property
    await Property.deleteOne({ _id: req.params.id });
    
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all properties (admin)
export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    console.error('Error fetching all properties:', error);
    res.status(500).json({ message: 'Error fetching properties' });
  }
};

// Approve property (admin)
export const approveProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property.isApproved = true;
    property.rejectionReason = undefined;
    await property.save();

    res.json({ message: 'Property approved successfully', property });
  } catch (error) {
    console.error('Error approving property:', error);
    res.status(500).json({ message: 'Error approving property' });
  }
};

// Reject property (admin)
export const rejectProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property.isApproved = false;
    property.rejectionReason = req.body.reason || 'Property rejected by admin';
    await property.save();

    res.json({ message: 'Property rejected successfully', property });
  } catch (error) {
    console.error('Error rejecting property:', error);
    res.status(500).json({ message: 'Error rejecting property' });
  }
};

export const getPendingProperties = async (req, res) => {
  try {
    const properties = await Property.find({ isApproved: false })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    console.error('Error fetching pending properties:', error);
    res.status(500).json({ message: 'Error fetching pending properties' });
  }
};

export const getApprovedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ isApproved: true })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    console.error('Error fetching approved properties:', error);
    res.status(500).json({ message: 'Error fetching approved properties' });
  }
};

export const getOwnerProperties = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      console.error('User not authenticated in getOwnerProperties');
      return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }

    console.log('Fetching properties for user:', req.user._id);

    // Find properties owned by the authenticated user
    const properties = await Property.find({ owner: req.user._id })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    console.log(`Found ${properties.length} properties for user ${req.user._id}`);

    res.json(properties);
  } catch (error) {
    console.error('Error in getOwnerProperties:', {
      message: error.message,
      stack: error.stack,
      user: req.user ? req.user._id : 'no user'
    });

    // Handle specific error types
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid property ID format',
        error: error.message 
      });
    }

    res.status(500).json({ 
      message: 'Error fetching owner properties',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}; 