import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import dbConnect from "@/lib/mongodb"
import { User } from "@/models/User"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                await dbConnect();

                const user = await User.findOne({ email: credentials.email });
                if (!user) return null;

                const isMatch = await bcrypt.compare(credentials.password as string, user.password);
                if (!isMatch) return null;

                return { id: user._id.toString(), email: user.email, name: user.name, image: user.image };
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                console.log("GOOGLE_SIGNIN_ATTEMPT: Starting...");
                try {
                    // Check if URI appears valid (safety check)
                    const uri = process.env.MONGODB_URI || "";
                    console.log("MONGODB_CONFIG: " + (uri.includes("mongodb+srv") ? "Cloud Cluster" : "Likely Localhost/Invalid"));

                    await dbConnect();
                    console.log("DB_CONNECTED: Checking for user...");

                    const existingUser = await User.findOne({ email: user.email });
                    if (!existingUser) {
                        console.log("USER_NOT_FOUND: Creating new user...");
                        await User.create({
                            email: user.email,
                            name: user.name,
                            image: user.image,
                            plan: "free",
                            provider: "google",
                        });
                        console.log("USER_CREATED_SUCCESSFULLY");
                    } else {
                        console.log("USER_FOUND: " + existingUser._id);
                    }
                } catch (error) {
                    console.error("CRITICAL_AUTH_ERROR:", error);
                    return false;
                }
            }
            return true;
        },
        async session({ session, token }) {
            if (session.user && token.sub) {
                // @ts-ignore
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        }
    }
})
