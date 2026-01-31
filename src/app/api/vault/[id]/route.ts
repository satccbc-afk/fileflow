import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import { Transfer } from "@/models/Transfer";
import { s3Client } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        console.log("Vault Request Received for ID:", id);

        const transfer = await Transfer.findOne({ transferId: id });
        console.log("Database lookup result:", transfer ? "Found" : "Not Found");

        if (!transfer) {
            return NextResponse.json({ success: false, error: "Transfer not found" }, { status: 404 });
        }

        // Check expiry
        if (new Date() > new Date(transfer.expiresAt)) {
            return NextResponse.json({ success: false, error: "Transfer expired" }, { status: 410 });
        }


        // Generate Presigned GET URLs for S3 files
        const transferObj = transfer.toObject();
        const filesWithUrls = await Promise.all(transferObj.files.map(async (file: any) => {
            // Case 1: External Link (Google Drive)
            if (file.externalUrl) {
                return { ...file, url: file.externalUrl };
            }

            // Case 2: S3 File
            if (file.key && file.bucket) {
                try {
                    const command = new GetObjectCommand({
                        Bucket: file.bucket,
                        Key: file.key,
                        ResponseContentDisposition: `attachment; filename="${file.name}"`,
                    });
                    // URL valid for 1 hour
                    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
                    return { ...file, url };
                } catch (e) {
                    console.error("Failed to sign URL for", file.name, e);
                    return file;
                }
            }
            return file;
        }));

        return NextResponse.json({ success: true, transfer: { ...transferObj, files: filesWithUrls } });
    } catch (error) {
        console.error("Vault API Error:", error);

        const message = error instanceof Error ? error.message : "Internal Vault Fault";
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const session = await auth();

        // Only Admin can DELETE (Global Moderate)
        if (session?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
        }

        const result = await Transfer.deleteOne({ transferId: id });

        if (result.deletedCount === 0) {
            return NextResponse.json({ success: false, error: "Transfer not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Transfer nuked successfully" });
    } catch (error) {
        console.error("Vault Delete Error:", error);
        return NextResponse.json({ success: false, error: "Failed to delete transfer" }, { status: 500 });
    }
}
