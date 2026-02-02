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
        iv: { type: String }, // AES-GCM IV
    }],
    expiresAt: { type: Date, required: true },
    password: { type: String, select: false }, // Password protection (optional)
    createdAt: { type: Date, default: Date.now },
    ownerEmail: { type: String }, // Link to User
    downloadCount: { type: Number, default: 0 },
    maxDownloads: { type: Number },
});

export const Transfer = models.Transfer || model("Transfer", TransferSchema);
