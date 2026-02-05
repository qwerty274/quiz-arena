import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedBackgroundProps {
  variant?: "default" | "particles" | "gradient" | "mesh";
  className?: string;
}

const AnimatedBackground = ({ variant = "default", className }: AnimatedBackgroundProps) => {
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

    // Particles
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      hue: number;
    }> = [];

    const createParticles = () => {
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.2,
          hue: Math.random() * 60 + 220, // Blue to purple range
        });
      }
    };
    createParticles();

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;
        ctx.fill();
      });

      // Draw connections
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
    return (
      <canvas
        ref={canvasRef}
        className={cn("fixed inset-0 -z-10 pointer-events-none", className)}
      />
    );
  }

  if (variant === "mesh") {
    return (
      <div className={cn("fixed inset-0 -z-10 overflow-hidden", className)}>
        {/* Animated mesh gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/20 blur-[100px] animate-float" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 rounded-full bg-accent/15 blur-[120px] animate-float-delayed" />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 rounded-full bg-game-daily/20 blur-[100px] animate-float-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[150px] animate-pulse-slow" />
      </div>
    );
  }

  if (variant === "gradient") {
    return (
      <div className={cn("fixed inset-0 -z-10", className)}>
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 animate-gradient-shift" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-game-daily/10 via-transparent to-transparent" />
      </div>
    );
  }

  // Default: combines mesh + subtle grid pattern
  return (
    <div className={cn("fixed inset-0 -z-10 overflow-hidden", className)}>
      {/* Animated gradient orbs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/30 blur-[100px] animate-float" />
      <div className="absolute top-1/3 -left-40 w-96 h-96 rounded-full bg-accent/20 blur-[120px] animate-float-delayed" />
      <div className="absolute -bottom-40 right-1/3 w-72 h-72 rounded-full bg-game-daily/25 blur-[100px] animate-float-slow" />
      
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015] bg-noise" />
    </div>
  );
};

export default AnimatedBackground;
