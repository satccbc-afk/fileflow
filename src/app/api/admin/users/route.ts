import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET(req: Request) {
    try {
        const session = await auth();
        // Strict Admin Check
        const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL || session?.user?.email === "khushboom099@gmail.com";

        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";
        const plan = searchParams.get("plan") || "all";
        const status = searchParams.get("status") || "all";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const query: any = {};

        // Search Logic
        if (search) {
            const searchRegex = new RegExp(search, "i");
            query.$or = [
                { name: searchRegex },
                { email: searchRegex },
            ];
        }

        // Filter Logic
        if (plan !== "all") {
            query.plan = plan;
        }

        if (status !== "all") {
            if (status === "blocked") query.isBlocked = true;
            if (status === "active") query.isBlocked = false;
        }

        // Fetch users with filters, pagination, and sorting
        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("-password");

        const totalUsers = await User.countDocuments(query);

        return NextResponse.json({
            success: true,
            users,
            pagination: {
                total: totalUsers,
                page,
                limit,
                totalPages: Math.ceil(totalUsers / limit)
            }
        });
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
