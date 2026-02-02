import { NextResponse } from "next/server";
import { s3Client, BUCKET_NAME } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";

const FREE_LIMIT = 100 * 1024 * 1024 * 1024; // 100GB
const PRO_LIMIT = 1024 * 1024 * 1024 * 1024; // 1TB

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { files } = await req.json();

        if (!files || !Array.isArray(files)) {
            return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
        }

        await dbConnect();
        const user = await User.findOne({ email: session.user.email });
        if (!user) return new NextResponse("User not found", { status: 404 });

        const uploadSize = files.reduce((acc: number, f: any) => acc + (f.size || 0), 0);
        const limit = user.plan === 'pro' ? PRO_LIMIT : FREE_LIMIT;

        if ((user.storageUsed || 0) + uploadSize > limit) {
            return NextResponse.json({
                success: false,
                error: `Storage Quota Exceeded. You have ${user.plan} plan with ${(limit / (1024 ** 3)).toFixed(0)}GB limit.`
            }, { status: 403 });
        }

        const presignedData = await Promise.all(files.map(async (file: { name: string, type: string }) => {
            const fileKey = `uploads/${user._id}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
            const command = new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: fileKey,
                ContentType: file.type,
            });

            const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
            return {
                name: file.name,
                key: fileKey,
                url,
                bucket: BUCKET_NAME
            };
        }));

        return NextResponse.json({ success: true, files: presignedData });

    } catch (error) {
        console.error("S3 Presign Error:", error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to authorize upload"
        }, { status: 500 });
    }
}
