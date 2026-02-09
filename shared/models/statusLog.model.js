export function createStatusLogModel(mongoose) {
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

  return (
    mongoose.models.StatusLog ||
    mongoose.model("StatusLog", statusLogSchema)
  );
}
