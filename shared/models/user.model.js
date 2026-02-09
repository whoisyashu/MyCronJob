export function createUserModel(mongoose) {
  const userSchema = new mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
      },
      passwordHash: {
        type: String,
        required: true
      },
      plan: {
        type: String,
        enum: ["FREE", "PRO"],
        default: "FREE"
      }
    },
    { timestamps: true }
  );

  return mongoose.models.User || mongoose.model("User", userSchema);
}
