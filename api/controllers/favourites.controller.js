import User from "../models/user.js";
import Listing from "../models/listing.model.js"

// Add listing to favorites
export const addFavorite = async (req, res) => {
  try {
    const { listingId } = req.params; 

    const userId = req.user.id; 

    console.log("Backend received listingId:", listingId);
    console.log("Backend userId:", userId);
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json("Listing not found");

    const user = await User.findById(userId);
    if (!user) return res.status(404).json("User not found");

    if (user.favorites.includes(listingId)) {
      return res.status(400).json("Already favorited");
    }

    user.favorites.push(listingId);
    await user.save();

    res.status(200).send("Listing added to favorites");
  } catch (err) {
    console.log("Server error in addFavorite:", err);
    res.status(500).send("Server error");
  }
};

export const removeFavorite = async (req, res) => {
  try {
   const { listingId } = req.params; 
   console.log("Listing to favorite:", listingId);


    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    user.favorites = user.favorites.filter(id => id.toString() !== listingId);
    await user.save();

    res.status(200).send("Listing removed from favorites");
  } catch (err) {
    res.status(500).send("Server error");
  }
};

export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("favorites");
    if (!user) return res.status(404).send("User not found");

    res.status(200).json(user.favorites);
  } catch (err) {
    
    res.status(500).send(`Server error ${err}`);
  }
};
