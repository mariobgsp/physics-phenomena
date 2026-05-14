export const idealGasSimulation = () => {
  const particles: { x: number; y: number; vx: number; vy: number; hue: number }[] = [];
  const numParticles = 85;
  const temp = 250;

  const update = (deltaTime: number, width: number, height: number) => {
    if (particles.length === 0) {
      for (let i = 0; i < numParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * temp + 50;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          hue: 200,
        });
      }
    }

    particles.forEach(p => {
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Color by speed (kinetic energy)
      const speedSq = p.vx * p.vx + p.vy * p.vy;
      p.hue = Math.max(0, 220 - speedSq / 800);
    });
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Dark pressurized container
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, '#0f172a');
    bg.addColorStop(1, '#020617');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Wall glow
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, width - 4, height - 4);

    particles.forEach(p => {
      ctx.shadowBlur = 8;
      ctx.shadowColor = `hsla(${p.hue}, 85%, 65%, 0.5)`;
      ctx.fillStyle = `hsl(${p.hue}, 85%, 65%)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // Pressure gauge
    ctx.fillStyle = 'rgba(7, 13, 24, 0.8)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 180, 64, 10) ?? ctx.rect(14, 14, 180, 64);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Ideal Gas Law', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText('PV = nRT', 26, 52);
    ctx.fillText(`Particles: ${particles.length}`, 26, 68);
  };

  return { update, draw };
};
