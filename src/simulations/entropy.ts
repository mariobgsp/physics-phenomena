export const entropySimulation = () => {
  const particles: { x: number; y: number; vx: number; vy: number; type: 'A' | 'B' }[] = [];
  const numPerSide = 50;

  const update = (deltaTime: number, width: number, height: number) => {
    if (particles.length === 0) {
      for (let i = 0; i < numPerSide * 2; i++) {
        const type = i < numPerSide ? 'A' : 'B';
        particles.push({
          x: type === 'A' ? Math.random() * (width / 2 - 20) : width / 2 + 20 + Math.random() * (width / 2 - 20),
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 150,
          vy: (Math.random() - 0.5) * 150,
          type,
        });
      }
    }

    particles.forEach(p => {
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    });
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, width, height);

    // Subtle divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(width / 2, 0); ctx.lineTo(width / 2, height); ctx.stroke();
    ctx.setLineDash([]);

    particles.forEach(p => {
      ctx.fillStyle = p.type === 'A' ? '#f87171' : '#60a5fa';
      ctx.shadowBlur = 6;
      ctx.shadowColor = ctx.fillStyle;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // Mixing calculation
    const leftB = particles.filter(p => p.type === 'B' && p.x < width / 2).length;
    const rightA = particles.filter(p => p.type === 'A' && p.x > width / 2).length;
    const mixing = ((leftB + rightA) / numPerSide) * 100;

    // Info panel
    ctx.fillStyle = 'rgba(7, 13, 24, 0.8)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 210, 64, 10) ?? ctx.rect(14, 14, 210, 64);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#f87171';
    ctx.fillText('Entropy & Mixing', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText(`System Mixing: ${mixing.toFixed(1)}%`, 26, 52);
    ctx.fillText('dS ≥ 0 (Second Law)', 26, 68);
  };

  return { update, draw };
};
