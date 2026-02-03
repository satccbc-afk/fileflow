import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import { Comment } from "@/models/Comment";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const comments = await Comment.find({ transferId: id }).sort({ createdAt: 1 });
        return NextResponse.json({ success: true, comments });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch comments" }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        const { id } = await params;
        const { text, fileIndex, userName } = await req.json();

        await dbConnect();
        const comment = await Comment.create({
            transferId: id,
            userId: session?.user?.id,
            userName: session?.user?.name || userName || "Guest",
            text,
            fileIndex
        });

        return NextResponse.json({ success: true, comment });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to post comment" }, { status: 500 });
    }
}
