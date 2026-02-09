import mongoose from "mongoose";

const statusLogSchema = new mongoose.Schema(
  {
    websiteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Website",
      required: true,
      index: true
    },

    status: {
      type: String,
      enum: ["UP", "DOWN"],
      required: true
    },

    statusCode: {
      type: Number
    },

    responseTimeMs: {
      type: Number
    },

    checkedAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  { timestamps: false }
);

export default mongoose.model("StatusLog", statusLogSchema);
