import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pg_booking',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  }
});

// Create multer upload middleware
export const upload = multer({ storage: storage });

// Function to upload a single file to Cloudinary
export const uploadToCloudinary = async (file) => {
  try {
    // If the file is already a Cloudinary URL, return it
    if (typeof file === 'string' && file.startsWith('http')) {
      return file;
    }

    // If the file is a Cloudinary object with a path, return that path
    if (file && file.path) {
      return file.path;
    }

    // If the file is a local file object, upload it
    if (file && file.buffer) {
      const result = await cloudinary.uploader.upload(file.buffer, {
        folder: 'pg_booking',
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
      });
      return result.secure_url;
    }

    throw new Error('Invalid file format');
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Error deleting image from Cloudinary');
  }
}; 