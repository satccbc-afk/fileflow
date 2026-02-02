import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mydrop";

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            connectTimeoutMS: 5000, // Fast fail in 5s
        };

        try {
            cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
                console.log("▲ INFO: Connected to Security Mesh (MongoDB)");
                return mongoose;
            });
        } catch (e: unknown) {
            cached.promise = null;
            throw new Error("MESH_OFFLINE: Could not connect to the global data mesh.");
        }
    }

    try {
        cached.conn = await cached.promise;
    } catch (e: unknown) {
        console.error("❌ MongoDB Connection Error:", e); // Reveal actual error
        cached.promise = null;
        throw new Error("MESH_OFFLINE: Global mesh is currently unreachable.");
    }

    return cached.conn;
}

export default dbConnect;
