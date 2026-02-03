import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";
import { auth } from "@/auth";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = await req.json();

        const secret = process.env.RAZORPAY_KEY_SECRET || "";
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            await dbConnect();
            await User.findOneAndUpdate(
                { email: session.user.email },
                {
                    plan: "pro",
                    subscriptionStatus: "active",
                    razorpayPaymentId: razorpay_payment_id,
                    razorpayOrderId: razorpay_order_id,
                }
            );

            return NextResponse.json({
                success: true,
                message: "Payment verified successfully",
            });
        } else {
            return NextResponse.json(
                { success: false, message: "Invalid signature" },
                { status: 400 }
            );
        }
    } catch (error: any) {
        console.error("[RAZORPAY_VERIFY_ERROR]", error);
        return NextResponse.json(
            { error: error.message || "Verification failed" },
            { status: 500 }
        );
    }
}
