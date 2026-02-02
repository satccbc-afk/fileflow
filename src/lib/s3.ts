import { S3Client } from "@aws-sdk/client-s3";

const region = process.env.AWS_REGION || "us-east-1";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey) {
    console.warn("⚠ AWS Credentials missing. S3 uploads will fail in production.");
}

export const s3Client = new S3Client({
    region,
    credentials: {
        accessKeyId: accessKeyId || "mock",
        secretAccessKey: secretAccessKey || "mock",
    },
});

export const BUCKET_NAME = process.env.AWS_BUCKET_NAME || "mydrop-uploads";
