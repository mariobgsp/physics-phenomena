export const phaseChangeSimulation = () => {
  const particles: { x: number; y: number; vx: number; vy: number; ox: number; oy: number }[] = [];
  const numParticles = 64;
  let temp = 0.5; // 0 (solid) to 1 (gas)

  const update = (deltaTime: number, width: number, height: number, time?: number) => {
    temp = (Math.sin((time || 0) / 3000) + 1) / 2; // Cycle temp

    if (particles.length === 0) {
      const grid = 8;
      const spacing = 35;
      const sx = (width - grid * spacing) / 2;
      const sy = (height - grid * spacing) / 2;
      for (let i = 0; i < grid; i++) {
        for (let j = 0; j < grid; j++) {
          particles.push({
            x: sx + i * spacing, y: sy + j * spacing,
            ox: sx + i * spacing, oy: sy + j * spacing,
            vx: 0, vy: 0
          });
        }
      }
    }

    particles.forEach(p => {
      if (temp < 0.3) { // Solid: Vibrations
        const vibe = temp * 15;
        p.x = p.ox + (Math.random() - 0.5) * vibe;
        p.y = p.oy + (Math.random() - 0.5) * vibe;
      } else if (temp < 0.7) { // Liquid: Flow
        p.vx += (Math.random() - 0.5) * temp * 400 * deltaTime;
        p.vy += (Math.random() - 0.5) * temp * 400 * deltaTime;
        p.x += p.vx * deltaTime;
        p.y += p.vy * deltaTime;
        // Gravity pull for liquid
        p.vy += 80 * deltaTime;
        if (p.x < 50 || p.x > width - 50) p.vx *= -1;
        if (p.y > height - 50) p.y = height - 50;
      } else { // Gas: Expansion
        p.vx += (Math.random() - 0.5) * temp * 1200 * deltaTime;
        p.vy += (Math.random() - 0.5) * temp * 1200 * deltaTime;
        p.x += p.vx * deltaTime;
        p.y += p.vy * deltaTime;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }
      p.vx *= 0.98; p.vy *= 0.98;
    });
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#0f172a');
    bg.addColorStop(1, '#020617');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const phaseName = temp < 0.3 ? 'Solid' : (temp < 0.7 ? 'Liquid' : 'Gas');
    const phaseColor = temp < 0.3 ? '#60a5fa' : (temp < 0.7 ? '#fbbf24' : '#ef4444');

    particles.forEach(p => {
      ctx.fillStyle = phaseColor;
      ctx.shadowBlur = 8;
      ctx.shadowColor = phaseColor;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // Info panel
    ctx.fillStyle = 'rgba(7, 13, 24, 0.8)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 210, 64, 10) ?? ctx.rect(14, 14, 210, 64);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = phaseColor;
    ctx.fillText(`State: ${phaseName}`, 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText(`Temp: ${(temp * 100).toFixed(0)}°C`, 26, 52);
    ctx.fillText('Kinetic Energy vs Intermolecular Forces', 26, 68);
  };

  return { update, draw };
};
