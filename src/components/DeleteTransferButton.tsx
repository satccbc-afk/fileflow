"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteTransferButton({ transferId }: { transferId: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to permanently delete this transfer? This cannot be undone.")) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/vault/${transferId}`, { method: "DELETE" });
            if (res.ok) {
                router.refresh();
            } else {
                alert("Failed to delete transfer");
            }
        } catch (error) {
            console.error(error);
            alert("Error deleting transfer");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-3 rounded-xl bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all group disabled:opacity-50"
            title="Delete Transfer"
        >
            <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
    );
}
