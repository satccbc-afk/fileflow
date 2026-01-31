import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET() {
    try {
        const session = await auth();
        // Strict Admin Check
        const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL || session?.user?.email === "khushboom099@gmail.com";

        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Fetch all users sorted by newest
        const users = await User.find({}).sort({ createdAt: -1 }).select("-password");

        return NextResponse.json({ success: true, users });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 });
    }
}

// Block/Unblock User
export async function PUT(req: Request) {
    try {
        const session = await auth();
        const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL || session?.user?.email === "khushboom099@gmail.com";

        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { userId, isBlocked } = await req.json();

        await dbConnect();

        const user = await User.findByIdAndUpdate(userId, { isBlocked }, { new: true });

        return NextResponse.json({ success: true, user });

    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 });
    }
}
