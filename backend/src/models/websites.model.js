import mongoose from "mongoose";

const websiteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true
    },

    url:{
        type: String,
        required: true
    },

    checkIntervalMinutes:{
        type: Number,
        default: 10
    },

    lastCheckedAt:{
        type: Date
    },

    lastStatusChangedAt:{
        type: Date
    }
},{
    timestamps: true,
});

export const websiteModel = mongoose.model("Website", websiteSchema);