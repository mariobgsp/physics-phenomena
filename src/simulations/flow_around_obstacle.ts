export const flowAroundObstacleSimulation = () => {
  const particles: { x: number; y: number; vx: number; vy: number; age: number }[] = [];
  const numParticles = 200;

  const update = (deltaTime: number, width: number, height: number) => {
    if (particles.length < numParticles) {
      particles.push({
        x: -20,
        y: Math.random() * height,
        vx: 180 + Math.random() * 40,
        vy: 0,
        age: 0
      });
    }

    const obsX = width / 2;
    const obsY = height / 2;
    const obsR = 60;

    particles.forEach((p, i) => {
      const dx = p.x - obsX;
      const dy = p.y - obsY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < obsR + 5) {
        // Deflect around obstacle
        const nx = dx / dist;
        const ny = dy / dist;
        p.vx += nx * 400 * deltaTime;
        p.vy += ny * 400 * deltaTime;
      }

      // Vortex wake effect (simplified)
      if (p.x > obsX + 40) {
          const wakeX = p.x - (obsX + 60);
          p.vy += Math.sin(wakeX * 0.05 - p.age * 5) * 15 * deltaTime * 60;
      }

      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      p.vx *= 0.99;
      p.vy *= 0.98;
      p.age += deltaTime;

      if (p.x > width + 20) particles.splice(i, 1);
    });
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, width, height);

    // Obstacle
    const obsX = width / 2;
    const obsY = height / 2;
    const obsR = 60;
    const grad = ctx.createRadialGradient(obsX - 10, obsY - 10, 5, obsX, obsY, obsR);
    grad.addColorStop(0, '#94a3b8');
    grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(obsX, obsY, obsR, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Particles
    particles.forEach(p => {
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      ctx.fillStyle = `rgba(56, 189, 248, ${Math.min(1, speed / 200)})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
    });

    // Info
    ctx.fillStyle = 'rgba(7, 13, 24, 0.8)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 210, 64, 10) ?? ctx.rect(14, 14, 210, 64);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Laminar & Turbulent Flow', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText('Re = ρvL / μ', 26, 52);
    ctx.fillText('Wake vortices forming behind', 26, 68);
  };

  return { update, draw };
};
