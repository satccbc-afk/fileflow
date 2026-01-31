import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import { Transfer } from "@/models/Transfer";

export async function GET() {
    try {
        const session = await auth();
        const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL || session?.user?.email === "khushboom099@gmail.com";

        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const transfers = await Transfer.find({})
            .sort({ createdAt: -1 });

        // Calculate aggregated stats
        const stats = {
            totalTransfers: transfers.length,
            totalStorage: transfers.reduce((acc: number, t: any) => acc + (t.files.reduce((s: number, f: any) => s + f.size, 0)), 0),
            activeTransfers: transfers.filter((t: any) => new Date(t.expiresAt) > new Date()).length
        };

        return NextResponse.json({ success: true, transfers, stats });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch transfers" }, { status: 500 });
    }
}
