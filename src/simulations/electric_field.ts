export const magnetismSimulation = () => {
  const particles: { x: number; y: number; vx: number; vy: number; hue: number }[] = [];
  const numParticles = 120;

  const update = (deltaTime: number, width: number, height: number) => {
    if (particles.length < numParticles) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0, vy: 0,
        hue: 200 + Math.random() * 40
      });
    }

    const mx = width / 2;
    const my = height / 2;

    particles.forEach(p => {
      const dx = mx - p.x;
      const dy = my - p.y;
      const distSq = dx * dx + dy * dy + 1000;
      const dist = Math.sqrt(distSq);
      
      // Magnetic field simulation: tangential force
      const force = 1200000 / distSq;
      p.vx += (dy / dist) * force * deltaTime;
      p.vy -= (dx / dist) * force * deltaTime;

      // Radial pull
      p.vx += (dx / dist) * 15 * deltaTime;
      p.vy += (dy / dist) * 15 * deltaTime;

      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      p.vx *= 0.985;
      p.vy *= 0.985;

      if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
        p.x = Math.random() * width;
        p.y = Math.random() * height;
        p.vx = 0; p.vy = 0;
      }
    });
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Dark electromagnetic void background
    const bg = ctx.createRadialGradient(width/2, height/2, 50, width/2, height/2, width*0.8);
    bg.addColorStop(0, '#0a1428');
    bg.addColorStop(1, '#020617');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Magnetic field lines (static/faint)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.03)';
    ctx.lineWidth = 1;
    for (let r = 40; r < width; r += 60) {
      ctx.beginPath(); ctx.arc(width/2, height/2, r, 0, Math.PI * 2); ctx.stroke();
    }

    // Magnet at center
    const mx = width / 2;
    const my = height / 2;
    const magGlow = ctx.createRadialGradient(mx, my, 0, mx, my, 80);
    magGlow.addColorStop(0, 'rgba(248, 113, 113, 0.3)');
    magGlow.addColorStop(1, 'rgba(248, 113, 113, 0)');
    ctx.fillStyle = magGlow;
    ctx.beginPath(); ctx.arc(mx, my, 80, 0, Math.PI * 2); ctx.fill();

    // B-field particles
    particles.forEach(p => {
      ctx.fillStyle = `hsla(${p.hue}, 85%, 65%, 0.6)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();

      // Velocity streaks
      ctx.strokeStyle = `hsla(${p.hue}, 85%, 65%, 0.15)`;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * 0.1, p.y - p.vy * 0.1);
      ctx.stroke();
    });

    // Central magnet labels
    ctx.font = 'bold 14px Outfit';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f87171';
    ctx.fillText('N', mx, my - 15);
    ctx.fillStyle = '#60a5fa';
    ctx.fillText('S', mx, my + 25);
    ctx.textAlign = 'left';

    // Info panel
    ctx.fillStyle = 'rgba(2, 6, 23, 0.8)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 190, 64, 10) ?? ctx.rect(14, 14, 190, 64);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Magnetic Flux', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText('Dipole B-Field Lines', 26, 52);
    ctx.fillText(`Particles: ${particles.length}`, 26, 68);
  };

  return { update, draw };
};
