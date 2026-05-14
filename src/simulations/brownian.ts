export const brownianSimulation = () => {
  const particles: { x: number; y: number; vx: number; vy: number; radius: number; color: string; trail: { x: number; y: number }[] }[] = [];
  const numParticles = 45;

  const update = (deltaTime: number, width: number, height: number) => {
    if (particles.length === 0) {
      for (let i = 0; i < numParticles; i++) {
        const isPollen = i === 0;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 200,
          vy: (Math.random() - 0.5) * 200,
          radius: isPollen ? 12 : 2.5,
          color: isPollen ? '#fbbf24' : '#60a5fa',
          trail: [],
        });
      }
    }

    particles.forEach(p => {
      // Brownian "kicks" (simplified as random force)
      p.vx += (Math.random() - 0.5) * 600 * deltaTime;
      p.vy += (Math.random() - 0.5) * 600 * deltaTime;
      
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;

      if (p.radius > 5) { // Only trail for the pollen grain
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 50) p.trail.shift();
      }

      // Bounce
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      p.vx *= 0.99; p.vy *= 0.99;
    });
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Dark fluid background
    const bg = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width*0.7);
    bg.addColorStop(0, '#0f172a');
    bg.addColorStop(1, '#020617');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Subtle fluid "noise"
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
    }

    particles.forEach(p => {
      if (p.trail.length > 1) {
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        p.trail.forEach((t, i) => {
          if (i === 0) ctx.moveTo(t.x, t.y);
          else ctx.lineTo(t.x, t.y);
        });
        ctx.stroke();
      }

      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      
      ctx.shadowBlur = p.radius > 5 ? 15 : 0;
      ctx.shadowColor = p.color;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Info panel
    ctx.fillStyle = 'rgba(7, 13, 24, 0.8)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 210, 64, 10) ?? ctx.rect(14, 14, 210, 64);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('Brownian Motion', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText('Random walk of large particles', 26, 52);
    ctx.fillText('Collisions with fluid molecules', 26, 68);
  };

  return { update, draw };
};
