import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9+\s\-]{7,20}$/, "Invalid phone number"],
    },
    avatar: {
      type: String,
      default:
        "https://cdn-icons-png.flaticon.com/512/12225/12225935.png",
    },
    favorites: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Listing",
      default: [],
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
