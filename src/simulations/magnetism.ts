export const electricFieldSimulation = () => {
  const charges = [
    { x: 0, y: 0, q: 1, color: '#f87171' },
    { x: 0, y: 0, q: -1, color: '#60a5fa' },
  ];

  const update = (_deltaTime: number, width: number, height: number, time?: number) => {
    const t = (time || 0) / 1000;
    // Animate charges in a graceful figure-8
    charges[0].x = width / 2 + Math.cos(t * 0.8) * 120;
    charges[0].y = height / 2 + Math.sin(t * 1.6) * 60;
    charges[1].x = width / 2 - Math.cos(t * 0.8) * 120;
    charges[1].y = height / 2 - Math.sin(t * 1.6) * 60;
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Dark void background
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, '#020617');
    bg.addColorStop(1, '#0f172a');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Grid field vectors
    const spacing = 35;
    for (let x = spacing / 2; x < width; x += spacing) {
      for (let y = spacing / 2; y < height; y += spacing) {
        let ex = 0;
        let ey = 0;

        charges.forEach(c => {
          const dx = x - c.x;
          const dy = y - c.y;
          const distSq = dx * dx + dy * dy + 500;
          const dist = Math.sqrt(distSq);
          const f = (c.q * 8000) / distSq;
          ex += (dx / dist) * f;
          ey += (dy / dist) * f;
        });

        const mag = Math.sqrt(ex * ex + ey * ey);
        const len = Math.min(spacing * 0.8, mag * 0.4);
        const nx = (ex / mag) * len;
        const ny = (ey / mag) * len;

        ctx.strokeStyle = `rgba(148, 163, 184, ${Math.min(0.3, mag * 0.05)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - nx / 2, y - ny / 2);
        ctx.lineTo(x + nx / 2, y + ny / 2);
        ctx.stroke();

        // Arrow head for direction
        if (mag > 0.5) {
            ctx.fillStyle = ctx.strokeStyle;
            ctx.beginPath();
            ctx.arc(x + nx / 2, y + ny / 2, 1, 0, Math.PI * 2);
            ctx.fill();
        }
      }
    }

    // Draw Charges
    charges.forEach(c => {
      // Glow
      const glow = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 40);
      glow.addColorStop(0, c.color.replace(')', ', 0.3)'));
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(c.x, c.y, 40, 0, Math.PI * 2); ctx.fill();

      // Body
      ctx.shadowBlur = 15;
      ctx.shadowColor = c.color;
      ctx.fillStyle = c.color;
      ctx.beginPath(); ctx.arc(c.x, c.y, 12, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;

      // Label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Outfit';
      ctx.textAlign = 'center';
      ctx.fillText(c.q > 0 ? '+' : '-', c.x, c.y + 4);
    });
    ctx.textAlign = 'left';

    // Info panel
    ctx.fillStyle = 'rgba(7, 13, 24, 0.8)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 210, 64, 10) ?? ctx.rect(14, 14, 210, 64);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#f87171';
    ctx.fillText('Electric Dipole Field', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText('Coulomb\'s Law Visualization', 26, 52);
    ctx.fillText('E = kQ / r²', 26, 68);
  };

  return { update, draw };
};
