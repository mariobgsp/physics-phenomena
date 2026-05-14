export const pendulumSimulation = () => {
  const p = {
    origin: { x: 0, y: 0 },
    angle: Math.PI / 4,
    angleV: 0,
    angleA: 0,
    r: 220,
    g: 9.8,
    damping: 0.9992,
    ballColor: '#38bdf8',
    trailAngles: [] as number[],
  };

  // Background star particles
  const stars = Array.from({ length: 60 }, () => ({
    x: Math.random(),
    y: Math.random(),
    size: Math.random() * 1.5 + 0.3,
    alpha: Math.random() * 0.4 + 0.1,
  }));

  const update = (deltaTime: number) => {
    p.angleA = (-p.g / p.r) * Math.sin(p.angle) * 120;
    p.angleV += p.angleA * deltaTime;
    p.angle += p.angleV * deltaTime;
    p.angleV *= p.damping;

    p.trailAngles.push(p.angle);
    if (p.trailAngles.length > 20) p.trailAngles.shift();
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Dark Space Gradient
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#050a14');
    bg.addColorStop(0.5, '#0a1428');
    bg.addColorStop(1, '#050a14');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Stars
    stars.forEach(s => {
      ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
      ctx.beginPath();
      ctx.arc(s.x * width, s.y * height, s.size, 0, Math.PI * 2);
      ctx.fill();
    });

    const cx = width / 2;
    const cy = 100;
    const bx = cx + Math.sin(p.angle) * p.r;
    const by = cy + Math.cos(p.angle) * p.r;

    // Trail with fade
    p.trailAngles.forEach((angle, i) => {
      const tx = cx + Math.sin(angle) * p.r;
      const ty = cy + Math.cos(angle) * p.r;
      ctx.fillStyle = `rgba(56, 189, 248, ${(i / p.trailAngles.length) * 0.2})`;
      ctx.beginPath();
      ctx.arc(tx, ty, 20 * (i / p.trailAngles.length), 0, Math.PI * 2);
      ctx.fill();
    });

    // Pivot glow
    const pivotGlow = ctx.createRadialGradient(cx, cy, 2, cx, cy, 20);
    pivotGlow.addColorStop(0, 'rgba(148, 163, 184, 0.4)');
    pivotGlow.addColorStop(1, 'rgba(148, 163, 184, 0)');
    ctx.fillStyle = pivotGlow;
    ctx.beginPath(); ctx.arc(cx, cy, 20, 0, Math.PI * 2); ctx.fill();

    // Pivot point
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill();

    // String
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(bx, by);
    ctx.stroke();

    // Ball outer glow
    const ballGlow = ctx.createRadialGradient(bx, by, 0, bx, by, 60);
    ballGlow.addColorStop(0, 'rgba(56, 189, 248, 0.2)');
    ballGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = ballGlow;
    ctx.beginPath(); ctx.arc(bx, by, 60, 0, Math.PI * 2); ctx.fill();

    // Ball body
    const ballGrad = ctx.createRadialGradient(bx - 8, by - 8, 4, bx, by, 25);
    ballGrad.addColorStop(0, '#7dd3fc');
    ballGrad.addColorStop(0.5, '#38bdf8');
    ballGrad.addColorStop(1, '#075985');
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#38bdf8';
    ctx.fillStyle = ballGrad;
    ctx.beginPath(); ctx.arc(bx, by, 25, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    // Specular highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.beginPath(); ctx.arc(bx - 10, by - 10, 8, 0, Math.PI * 2); ctx.fill();

    // Energy Bar Readout
    const kineticE = 0.5 * (p.angleV * p.r) ** 2;
    const potentialE = p.g * 100 * p.r * (1 - Math.cos(p.angle));
    
    ctx.fillStyle = 'rgba(7, 13, 24, 0.8)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 220, 85, 10) ?? ctx.rect(14, 14, 220, 85);
    ctx.fill();

    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#7dd3fc';
    ctx.fillText('Simple Pendulum', 26, 34);

    // Bars
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(26, 45, 100, 8);
    ctx.fillRect(26, 62, 100, 8);

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(26, 45, Math.min(100, kineticE / 150), 8); // Kinetic
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(26, 62, Math.min(100, potentialE / 150), 8); // Potential

    ctx.font = '10px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText(`KE: ${(kineticE/1000).toFixed(2)} J`, 134, 52);
    ctx.fillText(`PE: ${(potentialE/1000).toFixed(2)} J`, 134, 69);
  };

  return { update, draw };
};
