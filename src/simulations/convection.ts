export const convectionSimulation = () => {
  const particles: { x: number; y: number; vx: number; vy: number; hue: number }[] = [];
  const numParticles = 140;

  const update = (deltaTime: number, width: number, height: number) => {
    if (particles.length === 0) {
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: 0,
          vy: 0,
          hue: 200,
        });
      }
    }

    const midX = width / 2;
    const hotSourceY = height - 20;

    particles.forEach(p => {
      // Hot fluid rises in center, cold sinks at edges
      const distToCenter = Math.abs(p.x - midX);
      const isHot = distToCenter < width / 4;
      
      const buoyancy = isHot ? -80 : 60;
      const horizontal = p.y < height / 4 ? (p.x < midX ? 50 : -50) : (p.y > height * 0.75 ? (p.x < midX ? -50 : 50) : 0);

      p.vy += buoyancy * deltaTime;
      p.vx += horizontal * deltaTime;

      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;

      p.vx *= 0.98;
      p.vy *= 0.98;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Color by Y position and proximity to center (heat)
      const heatFactor = (height - p.y) / height + (1 - distToCenter / (width / 2));
      p.hue = Math.max(0, 240 - heatFactor * 120);
    });
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#020617');
    bg.addColorStop(1, '#0f172a');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Heat source at bottom center
    const heatGlow = ctx.createRadialGradient(width/2, height, 20, width/2, height, 150);
    heatGlow.addColorStop(0, 'rgba(239, 68, 68, 0.3)');
    heatGlow.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = heatGlow;
    ctx.fillRect(0, height - 100, width, 100);

    particles.forEach(p => {
      ctx.fillStyle = `hsl(${p.hue}, 85%, 60%)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Info panel
    ctx.fillStyle = 'rgba(7, 13, 24, 0.8)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 210, 64, 10) ?? ctx.rect(14, 14, 210, 64);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('Convection Currents', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText('Hot fluid rises (lower density)', 26, 52);
    ctx.fillText('Cold fluid sinks (higher density)', 26, 68);
  };

  return { update, draw };
};
