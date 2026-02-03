import mongoose, { Schema, model, models } from "mongoose";

const CommentSchema = new Schema({
    transferId: { type: String, required: true, index: true },
    userId: { type: String }, // Optional for guest comments
    userName: { type: String, default: "Guest" },
    text: { type: String, required: true },
    fileIndex: { type: Number }, // If the comment is linked to a specific file
    annotations: { type: Schema.Types.Mixed }, // For future visual annotations
    createdAt: { type: Date, default: Date.now },
});

export const Comment = models.Comment || model("Comment", CommentSchema);
