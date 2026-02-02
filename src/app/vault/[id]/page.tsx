import { VaultContent } from "./VaultContent";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    return {
        title: `FileDash | Secure Vault ${id}`,
        description: "Access your secure cloud transmission through our decentralized mesh network.",
    };
}

export default async function VaultPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <main className="relative min-h-screen text-share font-sans selection:bg-secure/10">
            <div className="content-wrapper">
                <VaultContent id={id} />
            </div>
        </main>
    );
}
