import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import { Transfer } from "@/models/Transfer";
import { AdminTerminal } from "./AdminTerminal";

export default async function AdminPage() {
    const session = await auth();
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    // Strict Server-Side Security Check
    const isAdmin = session?.user?.email === adminEmail || session?.user?.email === "khushboom099@gmail.com";
    if (!isAdmin || !session?.user?.email) {
        return redirect("/");
    }

    await dbConnect();
    // Pre-fetch initial count on the server (Optional, but good for SEO/Performance)
    const initialTransfersCount = await Transfer.countDocuments({});

    return <AdminTerminal />;
}
