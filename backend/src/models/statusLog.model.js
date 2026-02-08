import mongoose from "mongoose";

const statusLogSchema = new mongoose.Schema({
    websiteId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Website",
        required: true,
        index: true,
    },

    status:{
        type: String,
        enum: ["UP", "DOWN", "UNKNOWN"],
        default: "UNKNOWN"
    },

    statusCode:{
        type: Number
    },

    resposeTimeMs:{
        type: Number
    },

    checkedAt:{
        type: Date,
        default: Date.now,
        index: true
    }
})