export const collisionSimulation = () => {
  const balls = [
    { x: 100, y: 200, vx: 200, vy: 0, radius: 25, mass: 2, hue: 10 },
    { x: 400, y: 220, vx: -100, vy: 0, radius: 35, mass: 5, hue: 210 },
  ];

  const trails: { x: number; y: number; r: number; alpha: number; hue: number }[][] = [[], []];

  const update = (deltaTime: number, width: number, height: number) => {
    balls.forEach((b, i) => {
      b.x += b.vx * deltaTime;
      b.y += b.vy * deltaTime;

      if (b.x - b.radius < 0) { b.x = b.radius; b.vx *= -1; }
      if (b.x + b.radius > width) { b.x = width - b.radius; b.vx *= -1; }
      if (b.y - b.radius < 0) { b.y = b.radius; b.vy *= -1; }
      if (b.y + b.radius > height) { b.y = height - b.radius; b.vy *= -1; }

      trails[i].push({ x: b.x, y: b.y, r: b.radius, alpha: 0.5, hue: b.hue });
      if (trails[i].length > 12) trails[i].shift();
      trails[i].forEach(t => (t.alpha *= 0.9));
    });

    // Check collision
    const b1 = balls[0];
    const b2 = balls[1];
    const dx = b2.x - b1.x;
    const dy = b2.y - b1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < b1.radius + b2.radius) {
      // Elastic collision formula
      const nx = dx / dist;
      const ny = dy / dist;
      const p = (2 * (b1.vx * nx + b1.vy * ny - b2.vx * nx - b2.vy * ny)) / (b1.mass + b2.mass);
      b1.vx = b1.vx - p * b2.mass * nx;
      b1.vy = b1.vy - p * b2.mass * ny;
      b2.vx = b2.vx + p * b1.mass * nx;
      b2.vy = b2.vy + p * b1.mass * ny;

      // Prevent sticking
      const overlap = (b1.radius + b2.radius - dist) / 2;
      b1.x -= overlap * nx; b1.y -= overlap * ny;
      b2.x += overlap * nx; b2.y += overlap * ny;
    }
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Dark blueprint bg
    ctx.fillStyle = '#070712';
    ctx.fillRect(0, 0, width, height);

    // Subtle grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 55) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += 55) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Draw trails
    balls.forEach((_b, i) => {
      trails[i].forEach(t => {
        const glow = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, t.r);
        glow.addColorStop(0, `hsla(${t.hue}, 85%, 65%, ${t.alpha * 0.6})`);
        glow.addColorStop(1, `hsla(${t.hue}, 85%, 65%, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    // Draw balls
    balls.forEach(b => {
      // Outer glow
      const outerGlow = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius * 1.8);
      outerGlow.addColorStop(0, `hsla(${b.hue}, 85%, 65%, 0.2)`);
      outerGlow.addColorStop(1, `hsla(${b.hue}, 85%, 65%, 0)`);
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Body gradient
      const grad = ctx.createRadialGradient(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.05, b.x, b.y, b.radius);
      grad.addColorStop(0, `hsl(${b.hue}, 100%, 85%)`);
      grad.addColorStop(0.4, `hsl(${b.hue}, 90%, 60%)`);
      grad.addColorStop(1, `hsl(${b.hue}, 80%, 25%)`);
      ctx.shadowBlur = 18;
      ctx.shadowColor = `hsla(${b.hue}, 85%, 60%, 0.8)`;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Specular
      ctx.fillStyle = 'rgba(255,255,255,0.22)';
      ctx.beginPath();
      ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Velocity arrow
      const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
      if (speed > 10) {
        const arLen = Math.min(55, speed * 0.12);
        const nvx = b.vx / speed; const nvy = b.vy / speed;
        ctx.shadowBlur = 6; ctx.shadowColor = 'rgba(255,255,255,0.4)';
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x + nvx * arLen, b.y + nvy * arLen);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Mass label
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = `bold ${Math.max(10, b.radius / 3)}px Outfit`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${b.mass}`, b.x, b.y);
    });
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    // Kinetic energy readout
    const ke = balls.reduce((sum, b) => sum + 0.5 * b.mass * (b.vx * b.vx + b.vy * b.vy), 0);
    ctx.fillStyle = 'rgba(7, 7, 18, 0.8)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 230, 56, 10) ?? ctx.rect(14, 14, 230, 56);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Elastic Collisions', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText(`Total KE: ${(ke / 10000).toFixed(2)} (conserved)`, 26, 52);
    ctx.fillText('Numbers = mass (kg)', 26, 68);
  };

  return { update, draw };
};
