import mongoose, { Schema, model, models } from "mongoose";

const TransferSchema = new Schema({
    transferId: { type: String, required: true, unique: true },
    files: [{
        name: { type: String, required: true },
        size: { type: Number, required: true },
        type: { type: String },
        key: { type: String }, // S3 Key
        bucket: { type: String }, // S3 Bucket
        externalUrl: { type: String }, // Google Drive / External Link
    }],
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    ownerEmail: { type: String }, // Link to User
    downloadCount: { type: Number, default: 0 },
    maxDownloads: { type: Number },
    password: { type: String, select: false }, // Not exposed by default
});

export const Transfer = models.Transfer || model("Transfer", TransferSchema);
