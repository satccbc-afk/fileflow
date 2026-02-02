import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/auth";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    fileUploader: f({
        blob: {
            maxFileSize: "2GB",
            maxFileCount: 10,
        },
        pdf: {
            maxFileSize: "64MB",
            maxFileCount: 5,
        },
        image: {
            maxFileSize: "32MB",
            maxFileCount: 5,
        },
        text: {
            maxFileSize: "64MB",
            maxFileCount: 5
        },
        video: {
            maxFileSize: "2GB",
            maxFileCount: 5
        },
        audio: {
            maxFileSize: "512MB",
            maxFileCount: 5
        }
    })
        // Set permissions and file types for this FileRoute
        .middleware(async ({ req }) => {
            // This code runs on your server before upload
            const session = await auth();

            // If you throw, the user will not be able to upload
            if (!session) throw new UploadThingError("Unauthorized");

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: session.user?.email };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId);
            console.log("file url", file.url);

            // !!! IMPORTANT: The file URL is here. 
            // You would normally save this to your database now.
            return { uploadedBy: metadata.userId };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
