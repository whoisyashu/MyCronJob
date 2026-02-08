import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        index: true
    },

    hashPassword:{
        type: String,
        required: true
    },

    plan: {
        type: String,
        enum: ["FREE", "PRO"],
        default: "FREE"
    }
},{
    timestamps: true,
});

export const userModel = mongoose.model("User", userSchema);