"use client";

import { useEffect, useRef } from "react";

export function MinimalBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let gridPoints: GridPoint[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initGrid();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", handleMouseMove);

        // --- GRID SYSTEM (ELASTIC PHYSICS) ---
        const GRID_SPACING = 40;

        class GridPoint {
            x: number;
            y: number;
            baseX: number;
            baseY: number;
            vx: number;
            vy: number;
            targetX: number;
            targetY: number;
            friction: number;
            springFactor: number;

            constructor(x: number, y: number) {
                this.baseX = x;
                this.baseY = y;
                this.x = x;
                this.y = y;
                this.vx = 0;
                this.vy = 0;
                this.targetX = x;
                this.targetY = y;
                this.friction = 0.9;
                this.springFactor = 0.1;
            }

            update(mouseX: number, mouseY: number, time: number) {
                // 1. Calculate Mouse Interaction
                const dx = mouseX - this.baseX;
                const dy = mouseY - this.baseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 300;

                // Reset target to base initially
                this.targetX = this.baseX;
                this.targetY = this.baseY;

                // Apply mouse force to target position
                if (dist < maxDist) {
                    const force = (maxDist - dist) / maxDist;
                    const angle = Math.atan2(dy, dx);
                    // Push away
                    const move = force * 40; // Strength
                    this.targetX -= Math.cos(angle) * move;
                    this.targetY -= Math.sin(angle) * move;
                }

                // 2. Add Organic Breathing Drift (Cosmic float)
                const drift = Math.sin(time * 0.001 + (this.baseX * 0.01) + (this.baseY * 0.01)) * 2;
                this.targetX += drift;

                // 3. Apply Spring Physics
                const ax = (this.targetX - this.x) * this.springFactor;
                const ay = (this.targetY - this.y) * this.springFactor;

                this.vx += ax;
                this.vy += ay;

                // Apply friction
                this.vx *= this.friction;
                this.vy *= this.friction;

                // Update position
                this.x += this.vx;
                this.y += this.vy;
            }
        }

        const initGrid = () => {
            gridPoints = [];
            const spacing = 40;
            for (let x = 0; x <= canvas.width + spacing; x += spacing) {
                for (let y = 0; y <= canvas.height + spacing; y += spacing) {
                    gridPoints.push(new GridPoint(x, y));
                }
            }
        };

        // --- PARTICLE SYSTEM ---
        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = (Math.random() - 0.5) * 1.5;
                this.size = Math.random() * 3 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
            }

            draw() {
                ctx!.beginPath();
                // Gentle soft glow for particles
                ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx!.fillStyle = "rgba(0, 0, 0, 0.1)";
                ctx!.fill();
            }
        }

        resize();
        for (let i = 0; i < 60; i++) particles.push(new Particle());

        // --- ANIMATION LOOP ---
        let time = 0;
        const animate = () => {
            time++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const { x: mx, y: my } = mouseRef.current;

            // 1. Draw Elastic Grid
            gridPoints.forEach(p => {
                p.update(mx, my, time);
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // Clear charcoal
                ctx.fill();
            });

            // 2. Draw Particles & Constellations
            particles.forEach((p, index) => {
                p.update();
                p.draw();

                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 180) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(0, 0, 0, ${0.1 * (1 - dist / 180)})`;
                        ctx.lineWidth = 1.5;
                        ctx.stroke();
                    }
                }
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
            className="fixed inset-0 z-0"
            style={{ pointerEvents: 'none' }}
        />
    );
}
