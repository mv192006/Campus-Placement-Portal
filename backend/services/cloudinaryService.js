import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';

const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
};

const saveLocally = (buffer, folder) => {
  const isPDF = buffer.slice(0, 4).toString() === '%PDF';
  const extension = isPDF ? '.pdf' : '.png';
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${extension}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  fs.writeFileSync(path.join(uploadDir, filename), buffer);
  console.log(`Saved file locally at public/uploads/${filename}`);

  return {
    secure_url: `http://localhost:5000/uploads/${filename}`,
    public_id: filename,
  };
};

export const uploadToCloudinary = (buffer, folder, resourceType = 'auto') => {
  const isCloudinaryConfigured =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_KEY !== 'your_api_key';

  if (!isCloudinaryConfigured) {
    console.warn('Cloudinary not configured. Falling back to local storage.');
    return Promise.resolve(saveLocally(buffer, folder));
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: `campus-placement/${folder}`, resource_type: resourceType },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error, falling back to local storage:', error.message);
          resolve(saveLocally(buffer, folder));
        } else {
          resolve(result);
        }
      }
    );
    bufferToStream(buffer).pipe(uploadStream);
  });
};

export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;

  // Check if it's a locally stored file (publicId would be the local filename)
  const localPath = path.join(process.cwd(), 'public', 'uploads', publicId);
  if (fs.existsSync(localPath)) {
    try {
      fs.unlinkSync(localPath);
      console.log(`Deleted local file: ${publicId}`);
      return;
    } catch (err) {
      console.error('Error deleting local file:', err.message);
    }
  }

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Cloudinary delete error:', err.message);
  }
};

