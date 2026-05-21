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
    // Interactive params
    length: 220,    // px (visual)
    gravity: 9.8,   // m/s²
    dampingFactor: 0.9992,
    initialAngle: 45, // degrees
  };

  // Stars background
  const stars = Array.from({ length: 60 }, () => ({
    x: Math.random(),
    y: Math.random(),
    size: Math.random() * 1.5 + 0.3,
    alpha: Math.random() * 0.4 + 0.1,
  }));

  const setParams = (params: Record<string, number>) => {
    if (params.length !== undefined) {
      p.r = params.length;
      p.length = params.length;
    }
    if (params.gravity !== undefined) {
      p.g = params.gravity;
      p.gravity = params.gravity;
    }
    if (params.damping !== undefined) {
      p.damping = params.damping;
      p.dampingFactor = params.damping;
    }
    if (params.initialAngle !== undefined) {
      p.initialAngle = params.initialAngle;
      p.angle = (params.initialAngle * Math.PI) / 180;
      p.angleV = 0;
      p.trailAngles = [];
    }
  };

  const getParams = () => ({
    length: p.length,
    gravity: p.gravity,
    damping: p.dampingFactor,
    initialAngle: p.initialAngle,
  });

  const update = (deltaTime: number) => {
    const visualG = p.g * 120;
    p.angleA = (-1 * visualG / p.r) * Math.sin(p.angle);
    p.angleV += p.angleA * deltaTime;
    p.angle += p.angleV * deltaTime;
    p.angleV *= p.damping;

    p.trailAngles.push(p.angle);
    if (p.trailAngles.length > 30) p.trailAngles.shift();
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const bg = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.7);
    bg.addColorStop(0, '#0c1a2e');
    bg.addColorStop(1, '#060d1a');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    stars.forEach(s => {
      ctx.fillStyle = `rgba(148, 163, 184, ${s.alpha})`;
      ctx.beginPath();
      ctx.arc(s.x * width, s.y * height, s.size, 0, Math.PI * 2);
      ctx.fill();
    });

    p.origin.x = width / 2;
    p.origin.y = height * 0.15;

    const x = p.r * Math.sin(p.angle) + p.origin.x;
    const y = p.r * Math.cos(p.angle) + p.origin.y;

    // Draw angle arc indicator
    const arcR = 50;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(p.origin.x, p.origin.y, arcR, -Math.PI / 2, -Math.PI / 2 + p.angle, p.angle < 0);
    ctx.stroke();
    ctx.setLineDash([]);
    // Vertical dashed reference line
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(p.origin.x, p.origin.y);
    ctx.lineTo(p.origin.x, p.origin.y + p.r + 40);
    ctx.stroke();
    ctx.setLineDash([]);

    // Trail
    if (p.trailAngles.length > 2) {
      for (let i = 1; i < p.trailAngles.length; i++) {
        const ta = p.trailAngles[i - 1];
        const tb = p.trailAngles[i];
        const tx1 = p.r * Math.sin(ta) + p.origin.x;
        const ty1 = p.r * Math.cos(ta) + p.origin.y;
        const tx2 = p.r * Math.sin(tb) + p.origin.x;
        const ty2 = p.r * Math.cos(tb) + p.origin.y;
        const alpha = (i / p.trailAngles.length) * 0.35;
        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
        ctx.lineWidth = 3 * (i / p.trailAngles.length);
        ctx.beginPath();
        ctx.moveTo(tx1, ty1);
        ctx.lineTo(tx2, ty2);
        ctx.stroke();
      }
    }

    // Rope
    const ropeGrad = ctx.createLinearGradient(p.origin.x, p.origin.y, x, y);
    ropeGrad.addColorStop(0, 'rgba(203, 213, 225, 0.8)');
    ropeGrad.addColorStop(1, 'rgba(100, 116, 139, 0.3)');
    ctx.strokeStyle = ropeGrad;
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(p.origin.x, p.origin.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Pivot
    const pivotGlow = ctx.createRadialGradient(p.origin.x, p.origin.y, 0, p.origin.x, p.origin.y, 14);
    pivotGlow.addColorStop(0, 'rgba(148, 163, 184, 0.9)');
    pivotGlow.addColorStop(1, 'rgba(148, 163, 184, 0)');
    ctx.fillStyle = pivotGlow;
    ctx.beginPath();
    ctx.arc(p.origin.x, p.origin.y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(p.origin.x, p.origin.y, 5, 0, Math.PI * 2);
    ctx.fill();

    // Ball glow
    const outerGlow = ctx.createRadialGradient(x, y, 0, x, y, 70);
    outerGlow.addColorStop(0, 'rgba(56, 189, 248, 0.18)');
    outerGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(x, y, 70, 0, Math.PI * 2);
    ctx.fill();

    // Ball body
    const ballGrad = ctx.createRadialGradient(x - 8, y - 8, 2, x, y, 28);
    ballGrad.addColorStop(0, '#bae6fd');
    ballGrad.addColorStop(0.4, '#38bdf8');
    ballGrad.addColorStop(1, '#0369a1');
    ctx.shadowBlur = 25;
    ctx.shadowColor = '#38bdf8';
    ctx.fillStyle = ballGrad;
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(x - 9, y - 9, 9, 0, Math.PI * 2);
    ctx.fill();

    // Velocity vector
    const vx = p.angleV * p.r * Math.cos(p.angle);
    const vy = -p.angleV * p.r * Math.sin(p.angle);
    const vScale = 0.15;
    if (Math.abs(p.angleV) > 0.01) {
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#34d399';
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + vx * vScale, y + vy * vScale);
      ctx.stroke();
      // Arrowhead
      const vlen = Math.sqrt(vx * vx + vy * vy) * vScale;
      if (vlen > 5) {
        const nx = (vx * vScale) / vlen;
        const ny = (vy * vScale) / vlen;
        ctx.fillStyle = 'rgba(52, 211, 153, 0.8)';
        ctx.beginPath();
        ctx.moveTo(x + vx * vScale, y + vy * vScale);
        ctx.lineTo(x + vx * vScale - nx * 8 - ny * 4, y + vy * vScale - ny * 8 + nx * 4);
        ctx.lineTo(x + vx * vScale - nx * 8 + ny * 4, y + vy * vScale - ny * 8 - nx * 4);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(52, 211, 153, 0.7)';
        ctx.font = '10px Outfit';
        ctx.fillText('v', x + vx * vScale + nx * 6, y + vy * vScale + ny * 6);
      }
      ctx.shadowBlur = 0;
    }

    // Period display
    const T = 2 * Math.PI * Math.sqrt(p.r / (p.g * 120));
    const energy = 0.5 * p.angleV * p.angleV + (p.g * 120 / p.r) * (1 - Math.cos(p.angle));

    // Info panel
    ctx.fillStyle = 'rgba(6, 13, 26, 0.7)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 235, 90, 10) ?? ctx.rect(14, 14, 235, 90);
    ctx.fill();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.9)';
    ctx.font = 'bold 12px Outfit';
    ctx.fillText(`θ: ${(p.angle * 180 / Math.PI).toFixed(2)}°`, 26, 36);
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.font = '11px Outfit';
    ctx.fillText(`ω: ${p.angleV.toFixed(4)} rad/s`, 26, 54);
    ctx.fillText(`T = 2π√(L/g) = ${T.toFixed(3)} s`, 26, 70);
    ctx.fillText(`E: ${energy.toFixed(4)} J`, 26, 86);
    ctx.fillText(`L = ${(p.r / 100).toFixed(2)} m  |  g = ${p.g.toFixed(1)} m/s²`, 26, 102);
  };

  return { update, draw, setParams, getParams };
};