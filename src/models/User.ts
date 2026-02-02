import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        maxlength: [60, "Name cannot be more than 60 characters"],
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid email",
        ],
    },
    password: {
        type: String,
        required: false, // Optional for OAuth users
        minlength: [6, "Password must be at least 6 characters"],
    },
    provider: {
        type: String,
        default: "credentials",
    },
    image: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    plan: {
        type: String,
        enum: ['free', 'pro', 'team'],
        default: 'free',
    },
    storageUsed: {
        type: Number,
        default: 0,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    stripeCustomerId: {
        type: String,
    },
    stripeSubscriptionId: {
        type: String,
    },
    subscriptionStatus: {
        type: String,
    },
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
