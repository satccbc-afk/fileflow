"use client";

import { useEffect, useRef } from "react";

export function CyberpunkBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0.5, y: 0.5 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        // Mouse tracking
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = {
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight,
            };
        };
        window.addEventListener("mousemove", handleMouseMove);

        // Particle system
        class Particle {
            x: number;
            y: number;
            z: number;
            vx: number;
            vy: number;
            vz: number;
            size: number;
            opacity: number;
            canvas: HTMLCanvasElement;

            constructor(canvas: HTMLCanvasElement) {
                this.canvas = canvas;
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.z = Math.random() * 1000;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.vz = Math.random() * 2 + 1;
                this.size = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                // React to mouse
                const dx = mouseRef.current.x * this.canvas.width - this.x;
                const dy = mouseRef.current.y * this.canvas.height - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    this.vx += dx * 0.00005;
                    this.vy += dy * 0.00005;
                }

                this.x += this.vx;
                this.y += this.vy;
                this.z -= this.vz;

                if (this.z < 1) {
                    this.z = 1000;
                    this.x = Math.random() * this.canvas.width;
                    this.y = Math.random() * this.canvas.height;
                }

                // Boundaries
                if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
            }

            draw() {
                const scale = 1000 / (1000 - this.z);
                const x2d = (this.x - this.canvas.width / 2) * scale + this.canvas.width / 2;
                const y2d = (this.y - this.canvas.height / 2) * scale + this.canvas.height / 2;
                const size2d = this.size * scale;

                if (!ctx) return;

                ctx.beginPath();
                ctx.arc(x2d, y2d, size2d, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity * (1 - this.z / 1000)})`;
                ctx.fill();
            }
        }

        // Create particles
        for (let i = 0; i < 100; i++) {
            particles.push(new Particle(canvas));
        }

        let gridOffset = 0;
        let auroraTime = 0;

        const animate = () => {
            ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Aurora gradient
            auroraTime += 0.002;
            const gradient = ctx.createLinearGradient(
                0,
                0,
                Math.cos(auroraTime) * canvas.width,
                Math.sin(auroraTime) * canvas.height
            );
            gradient.addColorStop(0, "rgba(99, 102, 241, 0.03)");
            gradient.addColorStop(0.5, "rgba(139, 92, 246, 0.05)");
            gradient.addColorStop(1, "rgba(59, 130, 246, 0.03)");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Perspective grid
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.strokeStyle = "rgba(99, 102, 241, 0.15)";
            ctx.lineWidth = 1;

            gridOffset += 2;
            if (gridOffset > 50) gridOffset = 0;

            // Horizontal lines
            for (let i = -10; i < 20; i++) {
                const y = (i * 50 + gridOffset) * 2;
                const scale = 1 + y / canvas.height;
                ctx.beginPath();
                ctx.moveTo(-canvas.width * scale, y);
                ctx.lineTo(canvas.width * scale, y);
                ctx.globalAlpha = Math.max(0, 1 - y / canvas.height);
                ctx.stroke();
            }

            // Vertical lines
            for (let i = -20; i < 20; i++) {
                const x = i * 80;
                ctx.beginPath();
                ctx.moveTo(x, -canvas.height);
                ctx.lineTo(x * 3, canvas.height * 2);
                ctx.globalAlpha = 0.3;
                ctx.stroke();
            }

            ctx.restore();

            // Particles
            particles.forEach((p) => {
                p.update();
                p.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 opacity-80"
            style={{ mixBlendMode: "screen" }}
        />
    );
}
