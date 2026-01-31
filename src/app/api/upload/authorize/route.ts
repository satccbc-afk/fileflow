import { NextResponse } from "next/server";
import { s3Client, BUCKET_NAME } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function POST(req: Request) {
    try {
        const { files } = await req.json();

        if (!files || !Array.isArray(files)) {
            return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
        }

        const presignedData = await Promise.all(files.map(async (file: { name: string, type: string }) => {
            const fileKey = `uploads/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
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
