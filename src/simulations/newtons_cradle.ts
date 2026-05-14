export const newtonsCradleSimulation = () => {
  const numBalls = 5;
  const radius = 25;
  const length = 220;
  const balls = Array.from({ length: numBalls }, (_, i) => ({
    angle: 0,
    angleV: 0,
    x: 0, y: 0,
    baseX: 0,
  }));

  let leftSwinging = true;
  balls[0].angle = -Math.PI / 4;

  const update = (deltaTime: number) => {
    const g = 9.8 * 140;
    const damping = 0.9995;

    balls.forEach((b, i) => {
      const angleA = (-g / length) * Math.sin(b.angle);
      b.angleV += angleA * deltaTime;
      b.angle += b.angleV * deltaTime;
      b.angleV *= damping;

      // Elastic collisions between balls
      if (i > 0) {
        const prev = balls[i-1];
        if (prev.angle > b.angle) {
            const tempV = prev.angleV;
            prev.angleV = b.angleV;
            b.angleV = tempV;
            prev.angle = b.angle;
        }
      }
    });
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#0f172a');
    bg.addColorStop(1, '#020617');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = 80;
    const startX = cx - ((numBalls - 1) * radius);

    // Frame
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 6;
    ctx.strokeRect(cx - 150, cy - 20, 300, 20);

    balls.forEach((b, i) => {
      const bx = startX + i * radius * 2;
      const x = bx + Math.sin(b.angle) * length;
      const y = cy + Math.cos(b.angle) * length;

      // Strings
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(bx, cy); ctx.lineTo(x, y); ctx.stroke();

      // Steel ball gradient
      const grad = ctx.createRadialGradient(x - 8, y - 8, 4, x, y, radius);
      grad.addColorStop(0, '#f8fafc');
      grad.addColorStop(0.4, '#94a3b8');
      grad.addColorStop(1, '#1e293b');
      
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(148, 163, 184, 0.3)';
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;

      // Specular
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath(); ctx.arc(x - 8, y - 8, 8, 0, Math.PI * 2); ctx.fill();
    });

    // Info panel
    ctx.fillStyle = 'rgba(7, 13, 24, 0.8)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 210, 64, 10) ?? ctx.rect(14, 14, 210, 64);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Newton\'s Cradle', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText('Conservation of Momentum', 26, 52);
    ctx.fillText('Elastic energy transfer', 26, 68);
  };

  return { update, draw };
};
