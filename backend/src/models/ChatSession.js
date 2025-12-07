import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            default: "New Chat",
        },
    },
    {
        timestamps: true,
    }
);

const ChatSession = mongoose.model("ChatSession", chatSessionSchema);

export default ChatSession;
