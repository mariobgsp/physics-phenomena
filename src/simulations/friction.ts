export const frictionSimulation = () => {
  const p = {
    x: 80,
    vx: 550,
    mass: 1,
    mu: 0.28,
    g: 9.8,
  };

  const sparks: { x: number; y: number; vx: number; vy: number; life: number }[] = [];

  const update = (deltaTime: number, width: number) => {
    if (p.vx > 0) {
      const frictionForce = -p.mu * p.mass * p.g * 80;
      p.vx += frictionForce * deltaTime;
      p.x += p.vx * deltaTime;

      if (p.vx < 0) p.vx = 0;

      // Spawn sparks while moving
      if (p.vx > 10 && Math.random() < 0.4) {
          sparks.push({
            x: p.x + 30, y: 310,
            vx: (Math.random() + 0.5) * 100,
            vy: (Math.random() - 0.5) * 80 - 40,
            life: 1
          });
      }
    } else if (p.x > width * 0.8 || p.vx === 0) {
        // Reset after stopping or off screen
        p.x = 80; p.vx = 550;
    }

    for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx * deltaTime;
        s.y += s.vy * deltaTime;
        s.vy += 200 * deltaTime;
        s.life -= deltaTime * 1.8;
        if (s.life <= 0) sparks.splice(i, 1);
    }
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Workshop background
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#0f172a');
    bg.addColorStop(1, '#020617');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const groundY = 310;
    
    // Industrial surface
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, groundY, width, height - groundY);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.15)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, groundY); ctx.lineTo(x, height); ctx.stroke();
    }

    // Sparks
    sparks.forEach(s => {
        ctx.fillStyle = `rgba(251, 191, 36, ${s.life})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, 2, 0, Math.PI * 2); ctx.fill();
    });

    // Sliding Block
    const blockGrad = ctx.createLinearGradient(p.x, groundY - 50, p.x, groundY);
    blockGrad.addColorStop(0, '#475569');
    blockGrad.addColorStop(1, '#1e293b');
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(251, 191, 36, 0.2)';
    ctx.fillStyle = blockGrad;
    ctx.fillRect(p.x - 30, groundY - 50, 60, 50);
    ctx.strokeStyle = '#64748b';
    ctx.strokeRect(p.x - 30, groundY - 50, 60, 50);
    ctx.shadowBlur = 0;

    // Force vectors
    if (p.vx > 0) {
        // Friction vector
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(p.x, groundY - 5);
        ctx.lineTo(p.x - 80, groundY - 5);
        ctx.stroke();
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 11px Outfit';
        ctx.fillText('f_k (Friction)', p.x - 85, groundY + 18);
    }

    // Info panel
    ctx.fillStyle = 'rgba(7, 13, 24, 0.8)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 210, 64, 10) ?? ctx.rect(14, 14, 210, 64);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#f87171';
    ctx.fillText('Kinetic Friction', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText(`v = ${(p.vx / 10).toFixed(1)} m/s`, 26, 52);
    ctx.fillText(`μ_k = ${p.mu}, f_k = μ_k * N`, 26, 68);
  };

  return { update, draw };
};
