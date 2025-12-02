import React, { useEffect, useRef } from 'react';

const StarsBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Particle definition
    interface Star {
      x: number;
      y: number;
      radius: number;
      baseRadius: number;
      color: string;
      vx: number;
      vy: number;
      pulseSpeed: number;
      pulseOffset: number;
    }

    const stars: Star[] = [];
    const count = 100;

    // Palette: Gold, Cream, White (Elegant/Mystic)
    const colors = ['#D4A523', '#F0DEAA', '#FFFFFF', '#AA841C'];

    for (let i = 0; i < count; i++) {
      const baseRadius = Math.random() * 1.5 + 0.5;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: baseRadius,
        baseRadius: baseRadius,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.2, // Slow horizontal drift
        vy: (Math.random() - 0.5) * 0.2, // Slow vertical drift
        pulseSpeed: Math.random() * 0.05 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    const animate = () => {
      // Trail effect
      ctx.fillStyle = 'rgba(5, 5, 10, 0.15)'; 
      ctx.fillRect(0, 0, width, height);

      const time = Date.now() * 0.001;

      stars.forEach((star) => {
        // Update position
        star.x += star.vx;
        star.y += star.vy;

        // Wrap around screen
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        // Pulse size
        star.radius = star.baseRadius + Math.sin(time * star.pulseSpeed + star.pulseOffset) * 0.5;

        // Draw
        ctx.beginPath();
        ctx.arc(star.x, star.y, Math.max(0, star.radius), 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        
        // Add a slight glow
        ctx.shadowBlur = 4;
        ctx.shadowColor = star.color;
        
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      });

      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

export default StarsBackground;