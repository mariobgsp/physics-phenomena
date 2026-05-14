export const magnusSimulation = () => {
  const ball = { x: 50, y: 0, vx: 220, vy: 0, spin: 8, radius: 25, trail: [] as {x:number, y:number}[] };

  const update = (deltaTime: number, width: number, height: number) => {
    if (ball.y === 0) ball.y = height / 2;

    // Magnus Force: F = S * (ω x v)
    // Simplified: vertical force depends on spin and horizontal velocity
    const magnusAcc = ball.spin * ball.vx * 0.04;
    ball.vy += (magnusAcc + 40) * deltaTime; // +40 for slight gravity
    ball.x += ball.vx * deltaTime;
    ball.y += ball.vy * deltaTime;

    ball.trail.push({ x: ball.x, y: ball.y });
    if (ball.trail.length > 35) ball.trail.shift();

    if (ball.x > width + 50 || ball.y > height + 50 || ball.y < -50) {
      ball.x = -50; ball.y = height / 2; ball.vy = 0;
      ball.trail = [];
    }
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number, time?: number) => {
    const t = (time || 0) / 1000;
    // Windy background
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, '#0c1a2b');
    bg.addColorStop(1, '#020617');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Wind flow lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 15; i++) {
        const wy = (i * height / 14) + Math.sin(t + i) * 20;
        ctx.beginPath(); ctx.moveTo(0, wy); ctx.lineTo(width, wy); ctx.stroke();
    }

    // Trail
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.lineWidth = 3;
    ball.trail.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // Spinning ball
    ctx.save();
    ctx.translate(ball.x, ball.y);
    ctx.rotate(t * ball.spin);
    
    const grad = ctx.createRadialGradient(-5, -5, 2, 0, 0, ball.radius);
    grad.addColorStop(0, '#fbbf24');
    grad.addColorStop(1, '#d97706');
    ctx.shadowBlur = 20; ctx.shadowColor = '#fbbf24';
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(0, 0, ball.radius, 0, Math.PI * 2); ctx.fill();
    
    // Rotation indicator marks
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-15, 0); ctx.lineTo(15, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -15); ctx.lineTo(0, 15); ctx.stroke();
    ctx.restore();
    ctx.shadowBlur = 0;

    // Info panel
    ctx.fillStyle = 'rgba(7, 13, 24, 0.8)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 210, 64, 10) ?? ctx.rect(14, 14, 210, 64);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('Magnus Effect', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText('Curvature due to spin', 26, 52);
    ctx.fillText(`Spin: ${ball.spin} rad/s`, 26, 68);
  };

  return { update, draw };
};
