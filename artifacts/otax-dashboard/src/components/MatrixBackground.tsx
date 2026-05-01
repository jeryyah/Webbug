import { useEffect, useRef } from "react";

export default function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const cols = Math.floor(canvas.width / 20);
    const drops: number[] = Array(cols).fill(1);
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEFX<>{}[];=+-*".split("");

    let frame = 0;
    const draw = () => {
      frame++;
      ctx.fillStyle = "rgba(6,9,19,0.07)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = "13px 'Share Tech Mono', monospace";

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 20;
        const y = drops[i] * 20;

        const brightness = Math.random();
        if (brightness > 0.96) {
          ctx.fillStyle = "#ffffff";
        } else if (brightness > 0.88) {
          ctx.fillStyle = "rgba(0,240,200,0.9)";
        } else {
          ctx.fillStyle = `rgba(0,${Math.floor(80 + Math.random()*80)},${Math.floor(80 + Math.random()*60)},${0.25 + Math.random()*0.2})`;
        }

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 55);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed", inset: 0, zIndex: 0,
          pointerEvents: "none", opacity: 0.35,
          width: "100%", height: "100%"
        }}
      />
      <div className="bg-grid-overlay" />
      <div className="bg-radial-glow" />
      <div className="floating-orb" style={{
        width: 300, height: 300,
        background: "rgba(0,240,200,0.08)",
        top: "5%", left: "60%",
        animationDuration: "18s",
      }} />
      <div className="floating-orb" style={{
        width: 200, height: 200,
        background: "rgba(255,45,85,0.07)",
        top: "55%", left: "10%",
        animationDuration: "14s",
        animationDelay: "-5s",
      }} />
      <div className="floating-orb" style={{
        width: 150, height: 150,
        background: "rgba(0,100,255,0.05)",
        top: "80%", left: "70%",
        animationDuration: "20s",
        animationDelay: "-10s",
      }} />
    </>
  );
}
