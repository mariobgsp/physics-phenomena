export const projectileSimulation = () => {
  const particles: { x: number; y: number; vx: number; vy: number; trail: { x: number; y: number }[] }[] = [];
  const g = 980;
  let time = 0;

  const spawn = (width: number, height: number) => {
    const angle = -(Math.PI / 4 + Math.random() * Math.PI / 6);
    const speed = 600 + Math.random() * 200;
    particles.push({
      x: 50,
      y: height - 100,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      trail: [],
    });
  };

  const update = (deltaTime: number, width: number, height: number) => {
    time += deltaTime;
    if (time > 1.2) {
      spawn(width, height);
      time = 0;
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vy += g * deltaTime;
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 25) p.trail.shift();

      if (p.y > height + 100 || p.x > width + 100) {
        particles.splice(i, 1);
      }
    }
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#020617');
    bg.addColorStop(1, '#0f172a');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Ground glow
    const groundY = height - 100;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, groundY); ctx.lineTo(i, height); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(width, groundY); ctx.stroke();

    particles.forEach(p => {
      // Trail
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.lineWidth = 2;
      p.trail.forEach((t, i) => {
        if (i === 0) ctx.moveTo(t.x, t.y);
        else ctx.lineTo(t.x, t.y);
      });
      ctx.stroke();

      // Ball
      const grad = ctx.createRadialGradient(p.x - 4, p.y - 4, 2, p.x, p.y, 8);
      grad.addColorStop(0, '#7dd3fc');
      grad.addColorStop(1, '#0369a1');
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#38bdf8';
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Launcher base
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(50, groundY, 15, Math.PI, 0);
    ctx.fill();

    // Info
    ctx.fillStyle = 'rgba(7, 13, 24, 0.8)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 180, 56, 10) ?? ctx.rect(14, 14, 180, 56);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Projectile Paths', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText('v₀ = 600-800 px/s, θ = 45-75°', 26, 52);
  };

  return { update, draw };
};
