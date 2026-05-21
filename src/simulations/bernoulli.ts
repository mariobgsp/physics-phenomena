export const bernoulliSimulation = () => {
  const cfg = {
    neckRatio: 0.35, // 0.15 - 0.55 (how narrow the throat is, as fraction of wide radius)
    flowSpeed: 80,   // base flow speed in wide section
    particleCount: 140,
  };

  const particles: { x: number; y: number; vy: number; trail: { x: number; y: number }[]; alpha: number }[] = [];

  const initParticle = (xPos?: number) => ({
    x: xPos !== undefined ? xPos : -Math.random() * 200,
    y: (Math.random() - 0.5) * 140,
    vy: 0,
    trail: [] as { x: number; y: number }[],
    alpha: 0.5 + Math.random() * 0.5,
  });

  for (let i = 0; i < cfg.particleCount; i++) particles.push(initParticle(Math.random() * 800));

  let waveTime = 0;

  const setParams = (params: Record<string, number>) => {
    if (params.neckRatio !== undefined) cfg.neckRatio = params.neckRatio;
    if (params.flowSpeed !== undefined) cfg.flowSpeed = params.flowSpeed;
  };

  const getParams = () => ({ ...cfg });

  const getMaxOffset = (x: number, width: number): number => {
    const wideR = 80;
    const narrowR = Math.round(wideR * cfg.neckRatio);
    const narrowStart = width * 0.35;
    const narrowEnd = width * 0.65;
    const transitionLen = width * 0.12;
    if (x > narrowStart && x < narrowEnd) return narrowR;
    if (x > narrowStart - transitionLen && x <= narrowStart) {
      const t = (x - (narrowStart - transitionLen)) / transitionLen;
      return wideR - (wideR - narrowR) * t;
    }
    if (x >= narrowEnd && x < narrowEnd + transitionLen) {
      const t = (x - narrowEnd) / transitionLen;
      return narrowR + (wideR - narrowR) * t;
    }
    return wideR;
  };

  const getVelocity = (x: number, width: number): number => {
    const wideR = 80;
    const narrowR = Math.round(wideR * cfg.neckRatio);
    // Continuity: A1*v1 = A2*v2  => v_narrow = v_wide * (wideR/narrowR)
    const vWide = cfg.flowSpeed;
    const vNarrow = vWide * (wideR / narrowR);
    const narrowStart = width * 0.35;
    const narrowEnd = width * 0.65;
    const transitionLen = width * 0.12;
    if (x > narrowStart && x < narrowEnd) return vNarrow;
    if (x > narrowStart - transitionLen && x <= narrowStart) {
      const t = (x - (narrowStart - transitionLen)) / transitionLen;
      return vWide + (vNarrow - vWide) * t;
    }
    if (x >= narrowEnd && x < narrowEnd + transitionLen) {
      const t = (x - narrowEnd) / transitionLen;
      return vNarrow + (vWide - vNarrow) * t;
    }
    return vWide;
  };

  const update = (deltaTime: number, width: number, _height: number) => {
    waveTime += deltaTime;
    particles.forEach(p => {
      const v = getVelocity(p.x, width);
      const maxOffset = getMaxOffset(p.x, width);

      p.x += v * deltaTime;

      if (p.y > maxOffset - 5) p.y -= 80 * deltaTime;
      if (p.y < -maxOffset + 5) p.y += 80 * deltaTime;

      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 8) p.trail.shift();

      if (p.x > width + 50) Object.assign(p, initParticle());
    });
  };

  const drawPipePath = (ctx: CanvasRenderingContext2D, width: number, cy: number, sign: number) => {
    const wideR = 80;
    const narrowR = Math.round(wideR * cfg.neckRatio);
    const narrowStart = width * 0.35;
    const narrowEnd = width * 0.65;
    const transitionLen = width * 0.12;
    const outer = wideR * sign;
    const inner = narrowR * sign;

    ctx.beginPath();
    ctx.moveTo(0, cy + outer);
    ctx.lineTo(narrowStart - transitionLen, cy + outer);
    ctx.bezierCurveTo(
      narrowStart, cy + outer,
      narrowStart - transitionLen / 2, cy + inner,
      narrowStart, cy + inner,
    );
    ctx.lineTo(narrowEnd, cy + inner);
    ctx.bezierCurveTo(
      narrowEnd + transitionLen / 2, cy + inner,
      narrowEnd, cy + outer,
      narrowEnd + transitionLen, cy + outer,
    );
    ctx.lineTo(width, cy + outer);
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const cy = height / 2;
    const wideR = 80;
    const narrowR = Math.round(wideR * cfg.neckRatio);
    const narrowStart = width * 0.35;
    const narrowEnd = width * 0.65;
    const transitionLen = width * 0.12;
    const vNarrow = cfg.flowSpeed * (wideR / narrowR);
    const pDrop = 0.5 * 1000 * (vNarrow * vNarrow - cfg.flowSpeed * cfg.flowSpeed) / 1e4;

    ctx.fillStyle = '#04060c';
    ctx.fillRect(0, 0, width, height);

    // Pressure gradient inside
    const pgGrad = ctx.createLinearGradient(0, 0, width, 0);
    pgGrad.addColorStop(0, 'rgba(59, 130, 246, 0.18)');
    pgGrad.addColorStop((narrowStart - transitionLen / 2) / width, 'rgba(59, 130, 246, 0.16)');
    pgGrad.addColorStop((narrowStart + narrowEnd) / 2 / width, 'rgba(239, 68, 68, 0.18)');
    pgGrad.addColorStop((narrowEnd + transitionLen / 2) / width, 'rgba(59, 130, 246, 0.16)');
    pgGrad.addColorStop(1, 'rgba(59, 130, 246, 0.18)');

    ctx.save();
    drawPipePath(ctx, width, cy, 1);
    ctx.lineTo(width, cy - wideR);
    ctx.lineTo(narrowEnd + transitionLen, cy - wideR);
    ctx.bezierCurveTo(narrowEnd, cy - wideR, narrowEnd + transitionLen / 2, cy - narrowR, narrowEnd, cy - narrowR);
    ctx.lineTo(narrowStart, cy - narrowR);
    ctx.bezierCurveTo(narrowStart - transitionLen / 2, cy - narrowR, narrowStart, cy - wideR, narrowStart - transitionLen, cy - wideR);
    ctx.lineTo(0, cy - wideR);
    ctx.closePath();
    ctx.fillStyle = pgGrad;
    ctx.fill();
    ctx.restore();

    // Pipe walls
    [1, -1].forEach(sign => {
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(100, 116, 139, 0.4)';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      drawPipePath(ctx, width, cy, sign);
      ctx.stroke();
    });
    ctx.shadowBlur = 0;

    // Particles
    particles.forEach(p => {
      const isFast = p.x > narrowStart && p.x < narrowEnd;
      const hue = isFast ? 0 : 210;
      const col = `hsl(${hue}, 85%, 65%)`;

      if (p.trail.length > 1) {
        ctx.strokeStyle = `hsla(${hue}, 85%, 65%, 0.3)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        p.trail.forEach((t, i) => {
          if (i === 0) ctx.moveTo(t.x, cy + t.y);
          else ctx.lineTo(t.x, cy + t.y);
        });
        ctx.stroke();
      }

      ctx.shadowBlur = isFast ? 10 : 0;
      ctx.shadowColor = col;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(p.x, cy + p.y, isFast ? 3.5 : 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // Pressure gauge tubes
    const gaugePositions = [
      { x: width * 0.15, label: 'P₁ (high)', v: cfg.flowSpeed, isFast: false },
      { x: width * 0.5, label: 'P₂ (low)', v: vNarrow, isFast: true },
      { x: width * 0.85, label: 'P₁ (high)', v: cfg.flowSpeed, isFast: false },
    ];
    gaugePositions.forEach(g => {
      const tubeH = 70;
      const maxV = vNarrow;
      const ratio = Math.min(1, g.v / maxV);
      const fluidH = g.isFast ? tubeH * 0.2 : tubeH * Math.min(0.95, ratio * 1.2);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(g.x - 8, cy - wideR - tubeH, 16, tubeH);

      const fGrad = ctx.createLinearGradient(0, cy - wideR - fluidH, 0, cy - wideR);
      fGrad.addColorStop(0, g.isFast ? 'rgba(248,113,113,0.5)' : 'rgba(96,165,250,0.7)');
      fGrad.addColorStop(1, g.isFast ? 'rgba(248,113,113,0.8)' : 'rgba(37,99,235,0.9)');
      ctx.fillStyle = fGrad;
      ctx.fillRect(g.x - 7, cy - wideR - fluidH, 14, fluidH);

      ctx.font = '10px Outfit';
      ctx.textAlign = 'center';
      ctx.fillStyle = g.isFast ? '#f87171' : '#60a5fa';
      ctx.fillText(g.label, g.x, cy - wideR - tubeH - 6);
      ctx.fillStyle = 'rgba(148,163,184,0.6)';
      ctx.fillText(`v=${g.v.toFixed(0)}`, g.x, cy - wideR - tubeH - 18);
    });
    ctx.textAlign = 'left';

    // Info panel
    ctx.fillStyle = 'rgba(4, 6, 12, 0.85)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 300, 80, 10) ?? ctx.rect(14, 14, 300, 80);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#60a5fa';
    ctx.fillText("Bernoulli's Principle", 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
    ctx.fillText(`A₁v₁ = A₂v₂ (continuity)`, 26, 50);
    ctx.fillText(`v₁=${cfg.flowSpeed.toFixed(0)}  v₂=${vNarrow.toFixed(0)} px/s`, 26, 64);
    ctx.fillStyle = Math.abs(pDrop) > 0 ? '#f87171' : '#60a5fa';
    ctx.fillText(`ΔP ∝ ½ρ(v₂²-v₁²) = ${pDrop.toFixed(2)} units`, 26, 78);
  };

  return { update, draw, setParams, getParams };
};