import express from "express";
import { addFavorite, removeFavorite, getFavorites } from "../controllers/favourites.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/:listingId", verifyToken, addFavorite);
router.delete("/:listingId", verifyToken, removeFavorite);
router.get("/",verifyToken, getFavorites);

export default router;
