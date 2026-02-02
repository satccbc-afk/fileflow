import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import { User } from "@/models/User";
import dbConnect from "@/lib/mongodb";

export async function POST() {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await dbConnect();
        let user = await User.findOne({ email: session.user.email });
        console.log("Stripe Checkout Session User:", user?.email);

        if (!user) {
            console.log("User missing from DB. Creating now...");
            user = await User.create({
                email: session.user.email,
                name: session.user.name || "User",
                image: session.user.image,
                plan: "free",
                storageUsed: 0,
            });
        }

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: `${process.env.AUTH_URL}/dashboard?success=true`,
            cancel_url: `${process.env.AUTH_URL}/dashboard?canceled=true`,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: user.email,
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "MyDrop Transfer Pro Plan",
                            description: "1TB Storage, Password Protection, and Priority Support",
                        },
                        unit_amount: 1000, // $10.00
                        recurring: {
                            interval: "month",
                        },
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                userId: user._id.toString(),
            },
        });

        return NextResponse.json({ url: stripeSession.url });
    } catch (error) {
        console.error("[STRIPE_CHECKOUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
