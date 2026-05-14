export const circularSimulation = () => {
  const p = {
    angle: 0,
    r: 140,
    speed: 1.5,
    ballColor: '#facc15',
  };

  const trail: { x: number; y: number; alpha: number }[] = [];

  const update = (deltaTime: number) => {
    p.angle += p.speed * deltaTime;
    const x = Math.cos(p.angle) * p.r;
    const y = Math.sin(p.angle) * p.r;
    trail.push({ x, y, alpha: 0.6 });
    if (trail.length > 30) trail.shift();
    trail.forEach(t => (t.alpha *= 0.95));
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const bg = ctx.createLinearGradient(width / 2, height / 2, width, height);
    bg.addColorStop(0, '#0f172a');
    bg.addColorStop(1, '#020617');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    // Orbital path
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, p.r, 0, Math.PI * 2); ctx.stroke();

    // Trail
    trail.forEach((t, i) => {
      ctx.fillStyle = `rgba(250, 204, 21, ${(i / trail.length) * 0.3})`;
      ctx.beginPath();
      ctx.arc(cx + t.x, cy + t.y, 18 * (i / trail.length), 0, Math.PI * 2);
      ctx.fill();
    });

    const bx = cx + Math.cos(p.angle) * p.r;
    const by = cy + Math.sin(p.angle) * p.r;

    // Forces (Centripetal and Velocity)
    ctx.lineWidth = 2;
    // Centripetal
    ctx.strokeStyle = '#ef4444';
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(cx, cy); ctx.stroke();
    // Velocity
    ctx.strokeStyle = '#22c55e';
    const vx = -Math.sin(p.angle) * 60;
    const vy = Math.cos(p.angle) * 60;
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + vx, by + vy); ctx.stroke();

    // Ball
    const grad = ctx.createRadialGradient(bx - 6, by - 6, 3, bx, by, 20);
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(1, '#a16207');
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#facc15';
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(bx, by, 20, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    // Info
    ctx.fillStyle = 'rgba(2, 6, 23, 0.8)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 210, 75, 10) ?? ctx.rect(14, 14, 210, 75);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#facc15';
    ctx.fillText('Uniform Circular Motion', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = '#ef4444'; ctx.fillText('■ Centripetal Force (a_c)', 26, 52);
    ctx.fillStyle = '#22c55e'; ctx.fillText('■ Tangential Velocity (v)', 26, 68);
  };

  return { update, draw };
};
