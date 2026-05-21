export const brownianSimulation = () => {
  const cfg = {
    temperature: 1.0,   // 0.1 - 3.0 (scales molecule speed)
    numMolecules: 80,
    pollenSize: 18,
  };

  const pollen = { x: 0, y: 0, radius: 18, trail: [] as { x: number; y: number }[] };

  let molecules = Array.from({ length: cfg.numMolecules }, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 3,
    vy: (Math.random() - 0.5) * 3,
    r: Math.random() * 3 + 2,
    hue: Math.round(Math.random() * 60 + 180),
    alpha: Math.random() * 0.5 + 0.4,
  }));

  let initialized = false;

  const setParams = (params: Record<string, number>) => {
    if (params.temperature !== undefined) {
      const scale = params.temperature / cfg.temperature;
      cfg.temperature = params.temperature;
      molecules.forEach(m => {
        m.vx *= scale;
        m.vy *= scale;
      });
    }
    if (params.pollenSize !== undefined) {
      cfg.pollenSize = params.pollenSize;
      pollen.radius = params.pollenSize;
    }
    if (params.numMolecules !== undefined) {
      const n = Math.round(params.numMolecules);
      cfg.numMolecules = n;
      while (molecules.length < n) {
        molecules.push({
          x: Math.random(), y: Math.random(),
          vx: (Math.random() - 0.5) * 3 * cfg.temperature,
          vy: (Math.random() - 0.5) * 3 * cfg.temperature,
          r: Math.random() * 3 + 2,
          hue: Math.round(Math.random() * 60 + 180),
          alpha: Math.random() * 0.5 + 0.4,
        });
      }
      if (molecules.length > n) molecules = molecules.slice(0, n);
    }
  };

  const getParams = () => ({
    temperature: cfg.temperature,
    numMolecules: cfg.numMolecules,
    pollenSize: cfg.pollenSize,
  });

  const update = (_deltaTime: number, width: number, height: number) => {
    if (!initialized) {
      pollen.x = width / 2;
      pollen.y = height / 2;
      initialized = true;
    }

    // Random walk — scaled by temperature
    const step = 14 * cfg.temperature;
    pollen.x += (Math.random() - 0.5) * step;
    pollen.y += (Math.random() - 0.5) * step;
    pollen.x = Math.max(pollen.radius, Math.min(width - pollen.radius, pollen.x));
    pollen.y = Math.max(pollen.radius, Math.min(height - pollen.radius, pollen.y));

    pollen.trail.push({ x: pollen.x, y: pollen.y });
    if (pollen.trail.length > 150) pollen.trail.shift();

    molecules.forEach(m => {
      m.x += m.vx * 0.01;
      m.y += m.vy * 0.01;
      if (m.x < 0 || m.x > 1) { m.vx *= -1; m.x = Math.max(0, Math.min(1, m.x)); }
      if (m.y < 0 || m.y > 1) { m.vy *= -1; m.y = Math.max(0, Math.min(1, m.y)); }
    });
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const bg = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.7);
    bg.addColorStop(0, '#05131f');
    bg.addColorStop(1, '#010a14');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Molecules
    molecules.forEach(m => {
      const mx = m.x * width;
      const my = m.y * height;
      ctx.shadowBlur = 6;
      ctx.shadowColor = `hsla(${m.hue}, 80%, 65%, 0.5)`;
      ctx.fillStyle = `hsla(${m.hue}, 80%, 65%, ${m.alpha})`;
      ctx.beginPath();
      ctx.arc(mx, my, m.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // Pollen trail
    if (pollen.trail.length > 2) {
      for (let i = 1; i < pollen.trail.length; i++) {
        const alpha = (i / pollen.trail.length) * 0.6;
        const lw = (i / pollen.trail.length) * 3;
        ctx.strokeStyle = `rgba(251, 191, 36, ${alpha})`;
        ctx.lineWidth = lw;
        ctx.beginPath();
        ctx.moveTo(pollen.trail[i - 1].x, pollen.trail[i - 1].y);
        ctx.lineTo(pollen.trail[i].x, pollen.trail[i].y);
        ctx.stroke();
      }
    }

    // Mean displacement indicator
    if (pollen.trail.length > 10) {
      const first = pollen.trail[0];
      const dx = pollen.x - first.x;
      const dy = pollen.y - first.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(first.x, first.y);
      ctx.lineTo(pollen.x, pollen.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(251, 191, 36, 0.5)';
      ctx.font = '10px Outfit';
      ctx.fillText(`Δr=${dist.toFixed(0)}px`, pollen.x + pollen.radius + 4, pollen.y - pollen.radius - 4);
    }

    // Pollen glow
    const pollenGlow = ctx.createRadialGradient(pollen.x, pollen.y, 0, pollen.x, pollen.y, 55);
    pollenGlow.addColorStop(0, 'rgba(251, 191, 36, 0.3)');
    pollenGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = pollenGlow;
    ctx.beginPath();
    ctx.arc(pollen.x, pollen.y, 55, 0, Math.PI * 2);
    ctx.fill();

    // Pollen body
    const pollenGrad = ctx.createRadialGradient(pollen.x - 5, pollen.y - 5, 2, pollen.x, pollen.y, pollen.radius);
    pollenGrad.addColorStop(0, '#fde68a');
    pollenGrad.addColorStop(0.6, '#f59e0b');
    pollenGrad.addColorStop(1, '#92400e');
    ctx.shadowBlur = 18;
    ctx.shadowColor = '#fbbf24';
    ctx.fillStyle = pollenGrad;
    ctx.beginPath();
    ctx.arc(pollen.x, pollen.y, pollen.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.arc(pollen.x - 6, pollen.y - 6, 5, 0, Math.PI * 2);
    ctx.fill();

    // D ≈ temperature proxy (⟨x²⟩ = 2Dt)
    const D = cfg.temperature * 0.5;
    const t_steps = pollen.trail.length;

    ctx.fillStyle = 'rgba(1, 10, 20, 0.78)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 250, 80, 10) ?? ctx.rect(14, 14, 250, 80);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('Brownian Motion', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
    ctx.fillText(`⟨x²⟩ = 2Dt  |  D ∝ T = ${cfg.temperature.toFixed(1)}`, 26, 50);
    ctx.fillText(`Molecules: ${molecules.length}  |  Steps: ${t_steps}`, 26, 64);
    ctx.fillText('Yellow: Pollen  ·  Cyan: H₂O', 26, 78);
  };

  return { update, draw, setParams, getParams };
};