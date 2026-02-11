import { useEffect, useRef } from "react";

interface AnimatedBackgroundProps {
  variant?: "default" | "particles" | "gradient" | "mesh";
}

const AnimatedBackground = ({ variant = "default" }: AnimatedBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (variant !== "particles") return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles: Array<{
      x: number; y: number; size: number;
      speedX: number; speedY: number; opacity: number; hue: number;
    }> = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        hue: Math.random() * 60 + 220,
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${p.opacity})`;
        ctx.fill();
      });

      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach((b) => {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `hsla(240, 70%, 60%, ${0.1 * (1 - dist / 150)})`;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [variant]);

  if (variant === "particles") {
    return <canvas ref={canvasRef} className="bg-animated" />;
  }

  if (variant === "mesh") {
    return (
      <div className="bg-animated">
        <div className="bg-orb animate-float" style={{ top: "-10rem", right: "-10rem", width: "20rem", height: "20rem", background: "hsla(250, 90%, 65%, 0.2)" }} />
        <div className="bg-orb animate-float-delayed" style={{ top: "33%", left: "-10rem", width: "24rem", height: "24rem", background: "hsla(340, 85%, 60%, 0.15)", filter: "blur(120px)" }} />
        <div className="bg-orb animate-float-slow" style={{ bottom: "-10rem", right: "33%", width: "18rem", height: "18rem", background: "hsla(280, 85%, 65%, 0.2)" }} />
        <div className="bg-orb animate-pulse-slow" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "37rem", height: "37rem", background: "hsla(250, 90%, 65%, 0.1)", filter: "blur(150px)" }} />
      </div>
    );
  }

  if (variant === "gradient") {
    return (
      <div className="bg-animated">
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom right, var(--background), var(--background), hsla(250, 90%, 65%, 0.05))" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at top right, hsla(340, 85%, 60%, 0.1), transparent, transparent)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at bottom left, hsla(280, 85%, 65%, 0.1), transparent, transparent)" }} />
      </div>
    );
  }

  // Default
  return (
    <div className="bg-animated">
      <div className="bg-orb animate-float" style={{ top: "-10rem", right: "-10rem", width: "20rem", height: "20rem", background: "hsla(250, 90%, 65%, 0.3)" }} />
      <div className="bg-orb animate-float-delayed" style={{ top: "33%", left: "-10rem", width: "24rem", height: "24rem", background: "hsla(340, 85%, 60%, 0.2)", filter: "blur(120px)" }} />
      <div className="bg-orb animate-float-slow" style={{ bottom: "-10rem", right: "33%", width: "18rem", height: "18rem", background: "hsla(280, 85%, 65%, 0.25)" }} />
      <div className="bg-grid" />
    </div>
  );
};

export default AnimatedBackground;
