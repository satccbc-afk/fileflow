import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { firstName, lastName, email, password } = await req.json();

        // Validation
        if (!firstName || !email || !password) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json(
                { success: false, error: "User already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name: `${firstName} ${lastName || ""}`.trim(),
            email,
            password: hashedPassword,
        });

        return NextResponse.json({ success: true, user: { name: user.name, email: user.email } });

    } catch (error: any) {
        console.error("Registration Error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Server Error" },
            { status: 500 }
        );
    }
}
