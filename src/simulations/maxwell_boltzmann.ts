export const maxwellBoltzmannSimulation = () => {
  const particles: { x: number; y: number; vx: number; vy: number }[] = [];
  const numParticles = 100;
  const temp = 200;

  const update = (deltaTime: number, width: number, height: number) => {
    if (particles.length === 0) {
      for (let i = 0; i < numParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.sqrt(-2 * Math.log(Math.random())) * 100; // Rayleigh distribution (2D speed)
        particles.push({
          x: Math.random() * width,
          y: Math.random() * (height - 150),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
        });
      }
    }

    particles.forEach(p => {
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height - 150) p.vy *= -1;
    });
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, width, height);

    // Top view: Particles
    particles.forEach(p => {
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      const hue = Math.max(0, 220 - speed * 0.8);
      ctx.fillStyle = `hsl(${hue}, 85%, 65%)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Bottom: Distribution Histogram
    const chartY = height - 100;
    const chartH = 80;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath(); ctx.moveTo(50, chartY); ctx.lineTo(width - 50, chartY); ctx.stroke();

    const bins = new Array(40).fill(0);
    particles.forEach(p => {
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      const binIdx = Math.floor(speed / 10);
      if (binIdx < bins.length) bins[binIdx]++;
    });

    bins.forEach((count, i) => {
      const x = 50 + i * ((width - 100) / bins.length);
      const h = (count / numParticles) * chartH * 10;
      ctx.fillStyle = `hsl(${Math.max(0, 220 - i * 8)}, 85%, 55%)`;
      ctx.fillRect(x, chartY - h, (width - 100) / bins.length - 2, h);
    });

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Outfit';
    ctx.fillText('Speed (v) →', width - 100, chartY + 15);
    ctx.fillText('Frequency (f) ↑', 10, chartY - chartH);

    // Info panel
    ctx.fillStyle = 'rgba(7, 13, 24, 0.8)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 230, 64, 10) ?? ctx.rect(14, 14, 230, 64);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Maxwell-Boltzmann Distribution', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText('Statistical distribution of molecular speeds', 26, 52);
    ctx.fillText('f(v) ∝ v² exp(-mv²/2kT)', 26, 68);
  };

  return { update, draw };
};
