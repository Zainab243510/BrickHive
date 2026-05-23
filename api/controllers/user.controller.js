import User from "../models/user.js";
import bcryptjs from "bcryptjs";
import Listing from "../models/listing.model.js";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, password } = req.body;
    let avatarUrl;

    // multer-storage-cloudinary populates req.file.path with the full
    // Cloudinary URL (e.g. https://res.cloudinary.com/...).
    if (req.file) {
      avatarUrl = req.file.path;
    }

    const updateData = {
      ...(username && { username }),
      ...(avatarUrl && { avatar: avatarUrl }),
    };


    if (password) {
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: "Profile update failed" });
  }
};


export const test = (req, res) => {
  res.json({ message: "User test route" });
};

export const deleteUser = async (req, res) => {

  console.log("Inside deleteUser controller");
  console.log("User ID:", req.user.id);

  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId);
    res.clearCookie("access_token");
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).json({ message: "User deletion failed" });
  }
};

// GET /api/user/:id — returns public-safe contact info for the listing-detail page.
export const getPublicUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("username phone avatar");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id })
      res.status(200).json(listings)
    } catch (err) {
      next(err)
    }
  }
  else {
    return next(errorHandler("You can only view your own Listings", 403))
  }
}