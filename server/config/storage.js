import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'listings',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ 
      width: 1000, 
      crop: 'limit', 
      quality: 'auto',
      f_auto: true  }],
  },
});

const upload = multer({ storage });

export default upload;
