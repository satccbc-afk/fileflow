import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { razorpay } from "@/lib/razorpay";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { amount, currency = "INR" } = await req.json();

        await dbConnect();
        let user = await User.findOne({ email: session.user.email });

        if (!user) {
            user = await User.create({
                email: session.user.email,
                name: session.user.name || "User",
                image: session.user.image,
                plan: "free",
                storageUsed: 0,
            });
        }

        // Razorpay expects amount in paise (e.g., 500.00 INR = 50000 paise)
        const options = {
            amount: Math.round(amount * 100),
            currency,
            receipt: `receipt_${Date.now()}`,
            metadata: {
                userId: user._id.toString(),
            },
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
        });

    } catch (error: any) {
        console.error("[RAZORPAY_ORDER_ERROR]:", error);

        // Detailed error reporting for debugging
        const errorMessage = error.message || "Unknown Razorpay error";
        const errorDetails = error.description || (error.error ? error.error.description : null);

        return NextResponse.json(
            {
                error: errorMessage,
                details: errorDetails,
                code: error.code || "RAZORPAY_FAILURE"
            },
            { status: 500 }
        );
    }
}

