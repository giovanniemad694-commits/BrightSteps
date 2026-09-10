import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  hue: 'gold' | 'burgundy';
}

const DARK_GOLD = [224, 189, 118];
const DARK_BURGUNDY = [138, 40, 40];
const LIGHT_GOLD = [154, 117, 48];
const LIGHT_BURGUNDY = [107, 26, 26];

export default function AdminParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initParticles = () => {
      const count = Math.min(Math.floor((width * height) / 14000), 60);
      particlesRef.current = Array.from({ length: count }, () => createParticle());
    };

    const createParticle = (): Particle => {
      const isGold = Math.random() > 0.3;
      const sizeRoll = Math.random();
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: sizeRoll < 0.6 ? Math.random() * 1.5 + 0.5 : Math.random() * 3.5 + 1.5,
        speedX: (Math.random() - 0.5) * 0.12,
        speedY: -(Math.random() * 0.2 + 0.03),
        opacity: Math.random() * 0.4 + 0.06,
        hue: isGold ? 'gold' : 'burgundy',
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const particles = particlesRef.current;
      const isLight = document.documentElement.classList.contains('light');
      const gold = isLight ? LIGHT_GOLD : DARK_GOLD;
      const burgundy = isLight ? LIGHT_BURGUNDY : DARK_BURGUNDY;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const [r, g, b] = p.hue === 'gold' ? gold : burgundy;
        const radius = Math.max(0.1, p.size);

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
        ctx.fill();

        const glowRadius = Math.max(0.1, p.size * 3);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${p.opacity * 0.3})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    initParticles();
    draw();

    const handleResize = () => {
      resize();
      initParticles();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
