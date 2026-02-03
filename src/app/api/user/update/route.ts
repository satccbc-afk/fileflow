import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";

export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name } = await req.json();

        if (!name || name.trim().length < 2) {
            return NextResponse.json({ error: "Invalid name" }, { status: 400 });
        }

        await dbConnect();

        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            { name: name.trim() },
            { new: true }
        ).select("-password");

        return NextResponse.json({ success: true, user: updatedUser });

    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 });
    }
}
