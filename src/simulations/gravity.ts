export const gravitySimulation = () => {
  const p = {
    y: 50,
    vy: 0,
    g: 9.8,
    damping: 0.72,
    radius: 30,
    ballColor: '#f87171',
  };

  let stars = Array.from({ length: 50 }, () => ({
    x: Math.random(),
    y: Math.random(),
    size: Math.random() * 1.8 + 0.2,
    alpha: Math.random() * 0.5 + 0.1,
  }));

  const update = (deltaTime: number, _width: number, height: number) => {
    p.vy += p.g * 100 * deltaTime;
    p.y += p.vy * deltaTime;

    const floor = height - 120;
    if (p.y + p.radius > floor) {
      p.y = floor - p.radius;
      p.vy *= -p.damping;
    }
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Atmospheric dark gradient
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#020617');
    bg.addColorStop(0.5, '#0f172a');
    bg.addColorStop(1, '#020617');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Stars
    stars.forEach(s => {
      ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
      ctx.beginPath();
      ctx.arc(s.x * width, s.y * height, s.size, 0, Math.PI * 2);
      ctx.fill();
    });

    const floorY = height - 120;
    const cx = width / 2;

    // Floor glow
    const floorGlow = ctx.createRadialGradient(cx, floorY, 10, cx, floorY, 200);
    floorGlow.addColorStop(0, 'rgba(248, 113, 113, 0.08)');
    floorGlow.addColorStop(1, 'rgba(248, 113, 113, 0)');
    ctx.fillStyle = floorGlow;
    ctx.fillRect(0, floorY, width, 120);

    // Floor line
    ctx.strokeStyle = 'rgba(248, 113, 113, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, floorY);
    ctx.lineTo(width, floorY);
    ctx.stroke();

    // Squash and stretch logic
    let scaleY = 1;
    let scaleX = 1;
    if (Math.abs(p.vy) > 200) {
      const stretch = Math.min(0.25, Math.abs(p.vy) / 4000);
      scaleY = 1 + stretch;
      scaleX = 1 - stretch;
    }

    // Ball outer glow
    const ballGlow = ctx.createRadialGradient(cx, p.y, 0, cx, p.y, p.radius * 2.5);
    ballGlow.addColorStop(0, 'rgba(248, 113, 113, 0.25)');
    ballGlow.addColorStop(1, 'rgba(248, 113, 113, 0)');
    ctx.fillStyle = ballGlow;
    ctx.beginPath();
    ctx.ellipse(cx, p.y, p.radius * 2.5 * scaleX, p.radius * 2.5 * scaleY, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ball body
    const grad = ctx.createRadialGradient(cx - p.radius * 0.3, p.y - p.radius * 0.3, 5, cx, p.y, p.radius);
    grad.addColorStop(0, '#fca5a5');
    grad.addColorStop(0.5, '#f87171');
    grad.addColorStop(1, '#991b1b');

    ctx.save();
    ctx.translate(cx, p.y);
    ctx.scale(scaleX, scaleY);
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#f87171';
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Info Panel
    ctx.fillStyle = 'rgba(2, 6, 23, 0.8)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 200, 70, 10) ?? ctx.rect(14, 14, 200, 70);
    ctx.fill();

    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#fca5a5';
    ctx.fillText('Gravity (Earth)', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
    ctx.fillText(`g = 9.8 m/s²`, 26, 52);
    ctx.fillText(`v = ${(Math.abs(p.vy) / 10).toFixed(1)} m/s`, 26, 68);
  };

  return { update, draw };
};
