import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["customer", "admin"],
      default: "customer",
    },
    phone: {
      type: String, // ✅ fixed typo
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  },
);

// Create model
export const User = mongoose.model("User", userSchema);
