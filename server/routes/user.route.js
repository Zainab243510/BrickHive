import express from "express";
import { test, updateProfile,getUserListings, getPublicUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.js";  
import upload from "../middleware/upload.js";
import { deleteUser } from "../controllers/user.controller.js";  
const router = express.Router();

router.get("/test", test);

router.put("/update", verifyToken, upload.single('avatar'), updateProfile);
router.delete("/delete", verifyToken, deleteUser);
router.get('/listings/:id',verifyToken,getUserListings)
router.get('/:id', verifyToken, getPublicUser);

export default router;
