export const electricFieldSimulation = () => {
  let time = 0;

  const cfg = {
    charge1: 1,   // +1 or -1
    charge2: -1,  // +1 or -1
    separation: 0.18, // fraction of min(width,height)
    orbitSpeed: 0.3,
  };

  const setParams = (params: Record<string, number>) => {
    if (params.charge1 !== undefined) cfg.charge1 = params.charge1 > 0 ? 1 : -1;
    if (params.charge2 !== undefined) cfg.charge2 = params.charge2 > 0 ? 1 : -1;
    if (params.separation !== undefined) cfg.separation = Math.max(0.05, Math.min(0.35, params.separation));
    if (params.orbitSpeed !== undefined) cfg.orbitSpeed = params.orbitSpeed;
  };

  const getParams = () => ({ ...cfg });

  const update = (deltaTime: number) => {
    time += deltaTime;
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const bg = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.7);
    bg.addColorStop(0, '#0f0f1a');
    bg.addColorStop(1, '#05050f');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const orbit = time * cfg.orbitSpeed;
    const r = Math.min(width, height) * cfg.separation;
    const cx = width / 2;
    const cy = height / 2;

    const c0x = cx + Math.cos(orbit) * r;
    const c0y = cy + Math.sin(orbit) * r;
    const c1x = cx + Math.cos(orbit + Math.PI) * r;
    const c1y = cy + Math.sin(orbit + Math.PI) * r;

    const c1color = cfg.charge1 > 0 ? '#f87171' : '#60a5fa';
    const c2color = cfg.charge2 > 0 ? '#f87171' : '#60a5fa';

    const positions = [
      { x: c0x, y: c0y, q: cfg.charge1, color: c1color, label: cfg.charge1 > 0 ? '+' : '−' },
      { x: c1x, y: c1y, q: cfg.charge2, color: c2color, label: cfg.charge2 > 0 ? '+' : '−' },
    ];

    // Field line grid
    const spacing = 38;
    for (let gx = spacing / 2; gx < width; gx += spacing) {
      for (let gy = spacing / 2; gy < height; gy += spacing) {
        let ex = 0, ey = 0;
        positions.forEach(c => {
          const dx = gx - c.x;
          const dy = gy - c.y;
          const r2 = dx * dx + dy * dy;
          const rr = Math.sqrt(r2);
          if (rr < 12) return;
          const f = c.q / (r2 / 800 + 1);
          ex += f * (dx / rr);
          ey += f * (dy / rr);
        });

        const mag = Math.sqrt(ex * ex + ey * ey);
        if (mag < 0.001) continue;
        const len = Math.min(spacing * 0.7, mag * 18);
        const alpha = Math.min(0.55, mag * 0.6);
        const nx = ex / mag;
        const ny = ey / mag;

        const flow = ((gx * 0.01 + gy * 0.013 + time * 1.2) % 1);
        const ox = nx * len * flow * 0.3;
        const oy = ny * len * flow * 0.3;

        ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(gx + ox, gy + oy);
        ctx.lineTo(gx + ox + nx * len * 0.7, gy + oy + ny * len * 0.7);
        ctx.stroke();

        if (len > 12) {
          const ax = gx + ox + nx * len * 0.7;
          const ay = gy + oy + ny * len * 0.7;
          ctx.fillStyle = `rgba(148, 163, 184, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(ax - nx * 5 - ny * 3, ay - ny * 5 + nx * 3);
          ctx.lineTo(ax - nx * 5 + ny * 3, ay - ny * 5 - nx * 3);
          ctx.closePath();
          ctx.fill();
        }
      }
    }

    // Equipotential hint arc
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Force vector between charges
    const fdx = c1x - c0x;
    const fdy = c1y - c0y;
    const fdist = Math.sqrt(fdx * fdx + fdy * fdy) || 1;
    const fSign = cfg.charge1 * cfg.charge2; // same sign = repel, opposite = attract
    const fColor = fSign > 0 ? 'rgba(248,113,113,0.6)' : 'rgba(52,211,153,0.6)';
    const fLen = 30;
    ctx.strokeStyle = fColor;
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 6;
    ctx.shadowColor = fColor;
    // Arrow FROM c0 toward/away from c1
    const fn = fSign > 0 ? -1 : 1; // attract: toward, repel: away
    ctx.beginPath();
    ctx.moveTo(c0x, c0y);
    ctx.lineTo(c0x + fn * (fdx / fdist) * fLen, c0y + fn * (fdy / fdist) * fLen);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Charge bodies
    positions.forEach(c => {
      const glowR = 50;
      const glow = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, glowR);
      glow.addColorStop(0, `${c.color}55`);
      glow.addColorStop(1, `${c.color}00`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(c.x, c.y, glowR, 0, Math.PI * 2);
      ctx.fill();

      const grad = ctx.createRadialGradient(c.x - 5, c.y - 5, 1, c.x, c.y, 18);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.4, c.color);
      grad.addColorStop(1, c.q > 0 ? '#7f1d1d' : '#1e3a5f');
      ctx.shadowBlur = 22;
      ctx.shadowColor = c.color;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(c.x, c.y, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.font = 'bold 16px Outfit';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.fillText(c.label, c.x, c.y);
    });
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    const forceLabel = fSign > 0 ? 'Repulsion' : 'Attraction';
    const distPx = fdist;
    const kConst = 8.99e9;

    ctx.fillStyle = 'rgba(5, 5, 15, 0.82)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 260, 80, 10) ?? ctx.rect(14, 14, 260, 80);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Electric Field', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.75)';
    ctx.fillText(`E = kq/r²  |  r = ${distPx.toFixed(0)} px`, 26, 50);
    ctx.fillStyle = fSign > 0 ? '#f87171' : '#34d399';
    ctx.fillText(`${forceLabel} (q₁·q₂ ${fSign > 0 ? '> 0' : '< 0'})`, 26, 66);
    ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
    ctx.fillText(`q₁=${cfg.charge1 > 0 ? '+' : '-'}  q₂=${cfg.charge2 > 0 ? '+' : '-'}  sep=${(cfg.separation * 100).toFixed(0)}%`, 26, 80);
  };

  return { update, draw, setParams, getParams };
};