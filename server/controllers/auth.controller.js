import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { errorhandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password || !phone) {
      return next(errorhandler(400, "All fields are required."));
    }

    if (!/^[0-9+\s\-]{7,20}$/.test(phone)) {
      return next(errorhandler(400, "Please enter a valid phone number."));
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return next(errorhandler(409, "Username is already taken."));
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return next(errorhandler(409, "User with this email already exists."));
    }

    const hashPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashPassword,
      phone: phone.trim(),
    });

    await newUser.save();

    res.status(201).json({ success: true, message: "User has been created." });

  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password: inputPassword } = req.body;

    if (!email || !inputPassword) {
      return next(errorhandler(400, "Email and password are required."));
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return next(errorhandler(404, "User not found."));
    }

    const isPasswordCorrect = bcrypt.compareSync(inputPassword, existingUser.password);
    if (!isPasswordCorrect) {
      return next(errorhandler(401, "Invalid credentials!"));
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn:  "7d" });

    const { password: _, ...userWithoutPassword } = existingUser._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ ...userWithoutPassword, token }); 

  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const { email, name, photo, phone } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
      const { password, ...rest } = user._doc;

      return res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json({ ...rest, token });
    }

    // First-time Google sign-up: phone is required by the User schema, but
    // Google doesn't provide one. Ask the client to collect it on a separate
    // page, then call this endpoint again with `phone` populated.
    if (!phone) {
      return res.status(200).json({
        needsPhone: true,
        googleData: { email, name, photo },
      });
    }

    if (!/^[0-9+\s\-]{7,20}$/.test(phone)) {
      return next(errorhandler(400, "Please enter a valid phone number."));
    }

    const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashPassword = bcrypt.hashSync(generatedPassword, 10);

    const newUser = new User({
      username: name.split(" ").join("").toLowerCase() + Math.floor(100 + Math.random() * 900),
      email,
      password: hashPassword,
      avatar: photo,
      phone: phone.trim(),
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    const { password, ...rest } = newUser._doc;

    return res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ ...rest, token });
  } catch (error) {
    next(error);
  }
};
