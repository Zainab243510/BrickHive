import express from 'express';
import { createListing, uploadImages,deleteListing,updateListing, getListing,getListings,getAllListings,getTopListings } from '../controllers/listing.controller.js';
import { verifyToken } from '../middleware/auth.js';
import upload from '../config/storage.js';

const router = express.Router();

router.post('/upload-images', verifyToken, upload.array('images', 6), uploadImages);


router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing); 
router.get('/get/:id',verifyToken, getListing);
router.post('/editListing/:id', verifyToken, updateListing);
router.get('/get', getListings); 
router.get('/', getAllListings); 
router.get("/top", verifyToken, getTopListings);
export default router;
