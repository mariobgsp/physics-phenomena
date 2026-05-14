export const lorentzSimulation = () => {
  const particles: { x: number; y: number; vx: number; vy: number; trail: { x: number; y: number }[] }[] = [];
  const bField = 1.2;
  const q = -1;
  const m = 1;

  const spawn = (height: number) => {
    particles.push({
      x: 20,
      y: height / 2 + (Math.random() - 0.5) * 60,
      vx: 450,
      vy: 0,
      trail: [],
    });
  };

  const update = (deltaTime: number, width: number, height: number) => {
    if (Math.random() < 0.12) spawn(height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      
      // Lorentz force: F = q(v x B)
      // Since B is into the screen (z-axis), force is perpendicular to v in x-y plane
      const ax = (q * p.vy * bField) / m;
      const ay = (-q * p.vx * bField) / m;

      p.vx += ax * deltaTime * 100;
      p.vy += ay * deltaTime * 100;
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;

      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 25) p.trail.shift();

      if (p.x > width + 50 || p.x < -50 || p.y > height + 50 || p.y < -50) {
        particles.splice(i, 1);
      }
    }
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Background
    const bg = ctx.createLinearGradient(0, 0, width, 0);
    bg.addColorStop(0, '#0f172a');
    bg.addColorStop(1, '#020617');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // B-Field Background Indicators (X for into page)
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.07)';
    ctx.lineWidth = 1;
    for (let x = 40; x < width; x += 80) {
      for (let y = 40; y < height; y += 80) {
        ctx.beginPath();
        ctx.moveTo(x - 5, y - 5); ctx.lineTo(x + 5, y + 5);
        ctx.moveTo(x + 5, y - 5); ctx.lineTo(x - 5, y + 5);
        ctx.stroke();
      }
    }

    // Particles
    particles.forEach(p => {
      // Trail
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(129, 140, 248, 0.4)';
      ctx.lineWidth = 2;
      p.trail.forEach((t, i) => {
        if (i === 0) ctx.moveTo(t.x, t.y);
        else ctx.lineTo(t.x, t.y);
      });
      ctx.stroke();

      // Electron
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 8);
      grad.addColorStop(0, '#818cf8');
      grad.addColorStop(1, '#3730a3');
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#818cf8';
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Electron gun
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, height / 2 - 40, 30, 80);

    // Info panel
    ctx.fillStyle = 'rgba(7, 13, 24, 0.8)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 210, 64, 10) ?? ctx.rect(14, 14, 210, 64);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#818cf8';
    ctx.fillText('Lorentz Force', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText('B-field into screen (⊗)', 26, 52);
    ctx.fillText('Deflection of moving e⁻', 26, 68);
  };

  return { update, draw };
};
