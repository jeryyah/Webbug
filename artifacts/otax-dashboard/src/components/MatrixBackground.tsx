import { useEffect, useRef } from "react";

interface Props {
  variant?: "cyan" | "red";
}

export default function MatrixBackground({ variant = "cyan" }: Props) {
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

    const cols = Math.floor(canvas.width / 18);
    const drops: number[] = Array(cols).fill(1);
    const chars = "01アイウエオカキクケコABCDEFX<>{}[]=+-*".split("");

    const draw = () => {
      ctx.fillStyle = "rgba(5,4,12,0.09)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "12px 'Share Tech Mono', monospace";

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 18;
        const y = drops[i] * 18;
        const bright = Math.random();

        if (variant === "red") {
          if (bright > 0.97) ctx.fillStyle = "#ffffff";
          else if (bright > 0.90) ctx.fillStyle = "rgba(255,45,85,0.75)";
          else ctx.fillStyle = `rgba(${140 + Math.floor(Math.random() * 60)},0,${Math.floor(Math.random() * 30)},${0.15 + Math.random() * 0.18})`;
        } else {
          if (bright > 0.97) ctx.fillStyle = "#ffffff";
          else if (bright > 0.90) ctx.fillStyle = "rgba(0,240,200,0.7)";
          else ctx.fillStyle = `rgba(0,${Math.floor(60 + Math.random() * 80)},${Math.floor(60 + Math.random() * 60)},${0.15 + Math.random() * 0.18})`;
        }

        ctx.fillText(char, x, y);
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 60);
    return () => { clearInterval(interval); window.removeEventListener("resize", resize); };
  }, [variant]);

  const glowColor = variant === "red" ? "rgba(255,45,85,0.07)" : "rgba(0,240,200,0.07)";
  const orb2Color = variant === "red" ? "rgba(255,45,85,0.09)" : "rgba(255,45,85,0.07)";

  return (
    <>
      <canvas ref={canvasRef} style={{
        position: "fixed", inset: 0, zIndex: 0,
        pointerEvents: "none", opacity: 0.45,
        width: "100%", height: "100%",
      }} />
      <div className="bg-grid-overlay" />
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: variant === "red"
          ? "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,10,40,0.12) 0%, transparent 70%)"
          : "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,240,200,0.09) 0%, transparent 70%)",
      }} />
      <div className="floating-orb" style={{ width: 280, height: 280, background: glowColor, top: "5%", left: "55%", animationDuration: "18s" }} />
      <div className="floating-orb" style={{ width: 200, height: 200, background: orb2Color, top: "60%", left: "5%", animationDuration: "15s", animationDelay: "-5s" }} />
    </>
  );
}
