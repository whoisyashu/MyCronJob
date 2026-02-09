import mongoose from "mongoose";

const websiteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    url: {
      type: String,
      required: true
    },

    currentStatus: {
      type: String,
      enum: ["UP", "DOWN", "UNKNOWN"],
      default: "UNKNOWN"
    },

    checkIntervalMinutes: {
      type: Number,
      default: 10
    },

    lastCheckedAt: {
      type: Date
    },

    lastStatusChangeAt: {
      type: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model("Website", websiteSchema);
