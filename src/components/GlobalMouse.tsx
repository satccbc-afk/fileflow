"use client";

import { useEffect } from "react";

export function GlobalMouse() {
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;

            document.documentElement.style.setProperty("--mouse-x", `${x}%`);
            document.documentElement.style.setProperty("--mouse-y", `${y}%`);

            // Local mouse position for bento cards
            const cards = document.querySelectorAll(".bento-card");
            cards.forEach((card) => {
                const rect = (card as HTMLElement).getBoundingClientRect();
                const localX = ((e.clientX - rect.left) / rect.width) * 100;
                const localY = ((e.clientY - rect.top) / rect.height) * 100;
                (card as HTMLElement).style.setProperty("--mouse-x-local", `${localX}%`);
                (card as HTMLElement).style.setProperty("--mouse-y-local", `${localY}%`);
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <>
            <div className="aura-bg" aria-hidden="true" />
            <div className="atmospheric-bg" aria-hidden="true">
                <div className="silk-orb orb-1" />
                <div className="silk-orb orb-2" />
                <div className="silk-orb orb-3" />
            </div>
        </>
    );
}
