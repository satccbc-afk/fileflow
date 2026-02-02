import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Transfer } from "@/models/Transfer";
import { auth } from "@/auth";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const session = await auth(); // Get Session
        const { files, transferId, expiresIn, password } = await req.json();

        const expiresAt = new Date();
        const days = parseInt(expiresIn) || 1;
        expiresAt.setDate(expiresAt.getDate() + days);

        const transfer = await Transfer.create({
            transferId,
            files,
            expiresAt,
            ownerEmail: session?.user?.email || null,
            password: password || null,
        });

        if (session?.user?.email) {
            const totalSize = files.reduce((acc: number, f: any) => acc + f.size, 0);
            const { User } = require("@/models/User"); // Dynamic import to avoid circular dependency issues if any
            await User.findOneAndUpdate(
                { email: session.user.email },
                { $inc: { storageUsed: totalSize } }
            );
        }

        return NextResponse.json({ success: true, transfer });
    } catch (error) {
        console.error("Upload API Error:", error);

        const message = error instanceof Error ? error.message : "Internal Transfer Fault";
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
