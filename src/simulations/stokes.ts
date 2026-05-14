export const stokesSimulation = () => {
  const particles: { y: number; vy: number; radius: number; color: string; terminal: number }[] = [];
  const viscosity = 0.05;

  const spawn = (width: number) => {
    const r = 10 + Math.random() * 20;
    // v_terminal = (2/9) * r^2 * g * (rho_s - rho_f) / mu
    const vt = (r * r) * 0.4; 
    particles.push({
      y: -50,
      vy: 0,
      radius: r,
      color: `hsl(${200 + r}, 80%, 60%)`,
      terminal: vt,
    });
  };

  const update = (deltaTime: number, width: number, height: number) => {
    if (Math.random() < 0.05) spawn(width);

    particles.forEach((p, i) => {
      // Force balance: Gravity - Drag = m*a
      const drag = p.vy * viscosity * p.radius * 0.5;
      const acc = (p.terminal - p.vy) * 2.0;
      p.vy += acc * deltaTime;
      p.y += p.vy * deltaTime;

      if (p.y > height + 50) particles.splice(i, 1);
    });
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Viscous fluid background
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#061a1a');
    bg.addColorStop(1, '#020a0a');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Subtle drag streaks
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }

    particles.forEach(p => {
      const cx = width / 2 + (p.radius * 5 % 100);
      
      // Wake glow
      const wake = ctx.createLinearGradient(cx, p.y - 60, cx, p.y);
      wake.addColorStop(0, 'rgba(45, 212, 191, 0)');
      wake.addColorStop(1, 'rgba(45, 212, 191, 0.2)');
      ctx.fillStyle = wake;
      ctx.fillRect(cx - p.radius, p.y - 60, p.radius * 2, 60);

      // Sphere
      const grad = ctx.createRadialGradient(cx - 5, p.y - 5, 2, cx, p.y, p.radius);
      grad.addColorStop(0, '#5eead4');
      grad.addColorStop(1, '#0d9488');
      ctx.shadowBlur = 15; ctx.shadowColor = '#2dd4bf';
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(cx, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Info panel
    ctx.fillStyle = 'rgba(2, 15, 15, 0.85)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 210, 64, 10) ?? ctx.rect(14, 14, 210, 64);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#2dd4bf';
    ctx.fillText('Stokes\' Law', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText('F_drag = 6πμRv', 26, 52);
    ctx.fillText('Terminal velocity achieved', 26, 68);
  };

  return { update, draw };
};
