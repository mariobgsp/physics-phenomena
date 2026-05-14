export const torricelliSimulation = () => {
  const maxLevel = 320;
  let waterLevel = maxLevel;
  const TANK_W = 160;
  const TANK_H = 340;
  const TANK_X = 100;
  const TANK_BOTTOM = 400;

  const HOLES = [
    { y: TANK_BOTTOM - 60, open: true },
    { y: TANK_BOTTOM - 160, open: true },
    { y: TANK_BOTTOM - 260, open: true },
  ];

  const drops: { x: number; y: number; vx: number; vy: number; hue: number; trail: { x: number; y: number }[] }[] = [];
  let refilling = false;

  const update = (deltaTime: number, _width: number, height: number) => {
    const drainRate = 12;
    const refillRate = 22;

    if (waterLevel < 40) refilling = true;
    if (waterLevel >= maxLevel) refilling = false;

    if (refilling) waterLevel += refillRate * deltaTime;
    else waterLevel -= drainRate * deltaTime;

    const waterTop = TANK_BOTTOM - waterLevel;

    HOLES.forEach(h => {
      if (h.y > waterTop && Math.random() < 0.6) {
        const depth = waterLevel - (TANK_BOTTOM - h.y);
        const velocity = Math.sqrt(2 * 600 * depth) * 0.55;
        drops.push({
          x: TANK_X + TANK_W,
          y: h.y,
          vx: velocity,
          vy: (Math.random() - 0.5) * 12,
          hue: 190 + (depth / maxLevel) * 40,
          trail: [],
        });
      }
    });

    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i];
      d.vy += 700 * deltaTime;
      d.x += d.vx * deltaTime;
      d.y += d.vy * deltaTime;
      d.trail.push({ x: d.x, y: d.y });
      if (d.trail.length > 12) d.trail.shift();

      if (d.y > height - 60 || d.x > _width + 20) drops.splice(i, 1);
    }
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Laboratory background
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#0a0f1d');
    bg.addColorStop(1, '#02040a');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const waterTop = TANK_BOTTOM - waterLevel;

    // Water in tank (gradient fill)
    const waterGrad = ctx.createLinearGradient(TANK_X, waterTop, TANK_X, TANK_BOTTOM);
    waterGrad.addColorStop(0, 'rgba(56, 189, 248, 0.5)');
    waterGrad.addColorStop(1, 'rgba(14, 116, 163, 0.8)');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(TANK_X, waterTop, TANK_W, waterLevel);

    // Water surface line (glowing)
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
    ctx.strokeStyle = '#7dd3fc';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = TANK_X; x <= TANK_X + TANK_W; x += 5) {
      const y = waterTop + Math.sin(x * 0.1 + waterLevel * 0.05) * 2.5;
      if (x === TANK_X) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Tank walls (glowing)
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(100, 116, 139, 0.4)';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    // Left, bottom, back right (with hole gaps)
    ctx.beginPath();
    ctx.moveTo(TANK_X, 30);
    ctx.lineTo(TANK_X, TANK_BOTTOM);
    ctx.lineTo(TANK_X + TANK_W, TANK_BOTTOM);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Right wall with holes
    const sortedHoles = [...HOLES].sort((a, b) => a.y - b.y);
    let prevY = 30;
    sortedHoles.forEach(h => {
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(TANK_X + TANK_W, prevY);
      ctx.lineTo(TANK_X + TANK_W, h.y - 6);
      ctx.stroke();
      prevY = h.y + 6;
    });
    ctx.beginPath();
    ctx.moveTo(TANK_X + TANK_W, prevY);
    ctx.lineTo(TANK_X + TANK_W, TANK_BOTTOM);
    ctx.stroke();

    // Hole glow when active
    HOLES.forEach(h => {
      if (!h.open) return;
      const depth = waterLevel - (TANK_BOTTOM - h.y);
      const alpha = Math.max(0, Math.min(0.6, depth / maxLevel));
      ctx.shadowBlur = 12;
      ctx.shadowColor = `rgba(56, 189, 248, ${alpha})`;
      ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
      ctx.beginPath();
      ctx.arc(TANK_X + TANK_W, h.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Drops with trails
    drops.forEach(d => {
      if (d.trail.length > 1) {
        ctx.strokeStyle = `rgba(56, 189, 248, 0.35)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        d.trail.forEach((t, i) => {
          if (i === 0) ctx.moveTo(t.x, t.y);
          else ctx.lineTo(t.x, t.y);
        });
        ctx.stroke();
      }

      ctx.shadowBlur = 10;
      ctx.shadowColor = `hsl(${d.hue}, 85%, 65%)`;
      ctx.fillStyle = `hsl(${d.hue}, 85%, 65%)`;
      ctx.beginPath();
      ctx.arc(d.x, d.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Labels: h arrows
    HOLES.forEach((h, i) => {
      const depth = waterLevel - (TANK_BOTTOM - h.y);
      if (depth < 0) return;
      const v = Math.sqrt(2 * 600 * depth) * 0.55;
      const labelX = TANK_X + TANK_W + 14;
      ctx.font = '11px Outfit';
      ctx.fillStyle = 'rgba(125, 211, 252, 0.8)';
      ctx.fillText(`h${i + 1}=${depth.toFixed(0)}  v=${(v / 50).toFixed(1)} m/s`, labelX, h.y + 4);
    });

    // Refill indicator
    if (refilling) {
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 11px Outfit';
      ctx.textAlign = 'center';
      ctx.fillText('↑ Refilling…', TANK_X + TANK_W / 2, waterTop - 10);
      ctx.textAlign = 'left';
    }

    // Info panel
    ctx.fillStyle = 'rgba(5, 8, 14, 0.85)';
    ctx.beginPath();
    (ctx as any).roundRect?.(width - 260, 14, 246, 64, 10) ?? ctx.rect(width - 260, 14, 246, 64);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText("Torricelli's Theorem", width - 248, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
    ctx.fillText('v = √(2gh)  —  Deeper hole → faster jet', width - 248, 52);
    ctx.fillText(`Water level: ${waterLevel.toFixed(0)} / ${maxLevel}`, width - 248, 68);
  };

  return { update, draw };
};
