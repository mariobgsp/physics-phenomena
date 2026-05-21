export const springSimulation = () => {
  const p = {
    anchorY: 60,
    y: 280,
    vy: 0,
    mass: 1,
    k: 60,
    restLength: 180,
    damping: 0.992,
    color: '#a78bfa',
  };

  const trail: { y: number; alpha: number }[] = [];

  const setParams = (params: Record<string, number>) => {
    if (params.springConstant !== undefined) p.k = params.springConstant;
    if (params.mass !== undefined) {
      p.mass = params.mass;
      // Reset so the spring re-equilibrates
      p.y = p.anchorY + p.restLength + (p.mass * 9.8 * 2);
      p.vy = 0;
    }
    if (params.damping !== undefined) p.damping = params.damping;
    if (params.amplitude !== undefined) {
      // Displace from equilibrium by amplitude
      const eq = p.anchorY + p.restLength;
      p.y = eq + params.amplitude;
      p.vy = 0;
    }
  };

  const getParams = () => ({
    springConstant: p.k,
    mass: p.mass,
    damping: p.damping,
    amplitude: 100,
  });

  const update = (deltaTime: number, width: number, _height: number) => {
    const displacement = p.y - p.anchorY - p.restLength;
    const force = -p.k * displacement;
    const acceleration = force / p.mass;
    p.vy += acceleration * deltaTime;
    p.y += p.vy * deltaTime;
    p.vy *= p.damping;

    trail.push({ y: p.y, alpha: 0.5 });
    if (trail.length > 18) trail.shift();
    trail.forEach(t => (t.alpha *= 0.88));
    void width;
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#0f0a1e');
    bg.addColorStop(1, '#1a0a2e');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.06)';
    ctx.lineWidth = 1;
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }

    const cx = width / 2;

    // Anchor
    ctx.fillStyle = '#475569';
    ctx.fillRect(cx - 40, 0, 80, p.anchorY - 2);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(cx - 30, p.anchorY - 6, 60, 10);

    // Spring coil
    const segments = 24;
    const amplitude = 14;
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.8)';
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#a78bfa';
    ctx.beginPath();
    ctx.moveTo(cx, p.anchorY);
    for (let i = 0; i <= segments; i++) {
      const sy = p.anchorY + ((p.y - 25) - p.anchorY) * (i / segments);
      const sx = cx + (i % 2 === 0 ? amplitude : -amplitude);
      ctx.lineTo(sx, sy);
    }
    ctx.lineTo(cx, p.y - 25);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Trail
    trail.forEach((t, i) => {
      const trailWidth = 46 + (i / trail.length) * 4;
      ctx.fillStyle = `rgba(167, 139, 250, ${t.alpha * 0.3})`;
      ctx.beginPath();
      (ctx as any).roundRect?.(cx - trailWidth / 2, t.y, trailWidth, 50, 8) ??
        ctx.rect(cx - trailWidth / 2, t.y, trailWidth, 50);
      ctx.fill();
    });

    // Mass glow
    const massGlow = ctx.createRadialGradient(cx, p.y + 25, 5, cx, p.y + 25, 55);
    massGlow.addColorStop(0, 'rgba(167, 139, 250, 0.25)');
    massGlow.addColorStop(1, 'rgba(167, 139, 250, 0)');
    ctx.fillStyle = massGlow;
    ctx.fillRect(cx - 55, p.y - 5, 110, 65);

    // Mass body
    const massGrad = ctx.createLinearGradient(cx - 25, p.y, cx + 25, p.y + 50);
    massGrad.addColorStop(0, '#c4b5fd');
    massGrad.addColorStop(0.5, '#7c3aed');
    massGrad.addColorStop(1, '#4c1d95');
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#a78bfa';
    ctx.fillStyle = massGrad;
    ctx.beginPath();
    (ctx as any).roundRect?.(cx - 25, p.y, 50, 50, 10) ?? ctx.rect(cx - 25, p.y, 50, 50);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Mass label
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = 'bold 11px Outfit';
    ctx.textAlign = 'center';
    ctx.fillText(`${p.mass}kg`, cx, p.y + 30);
    ctx.textAlign = 'left';

    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    (ctx as any).roundRect?.(cx - 18, p.y + 5, 20, 8, 4) ?? ctx.rect(cx - 18, p.y + 5, 20, 8);
    ctx.fill();

    // Equilibrium marker
    const eqY = p.anchorY + p.restLength;
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 70, eqY);
    ctx.lineTo(cx + 70, eqY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(100, 116, 139, 0.6)';
    ctx.font = '10px Outfit';
    ctx.fillText('eq', cx + 75, eqY + 4);

    // Displacement arrow
    const displacement = p.y - p.anchorY - p.restLength;
    if (Math.abs(displacement) > 5) {
      const arrowX = cx + 55;
      const arrowColor = displacement > 0 ? 'rgba(248,113,113,0.8)' : 'rgba(52,211,153,0.8)';
      ctx.strokeStyle = arrowColor;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 6;
      ctx.shadowColor = arrowColor;
      ctx.beginPath();
      ctx.moveTo(arrowX, eqY);
      ctx.lineTo(arrowX, p.y + 25);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = arrowColor;
      ctx.font = '10px Outfit';
      ctx.fillText(`x=${(displacement / 100).toFixed(2)}m`, arrowX + 4, (eqY + p.y + 25) / 2);
    }

    // Period/frequency
    const omega = Math.sqrt(p.k / p.mass);
    const T = 2 * Math.PI / omega;
    const f = 1 / T;
    const displacement2 = p.y - p.anchorY - p.restLength;
    const kineticE = 0.5 * p.mass * p.vy * p.vy;
    const potentialE = 0.5 * p.k * displacement2 * displacement2;

    // Info panel
    ctx.fillStyle = 'rgba(15, 10, 30, 0.75)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 220, 100, 10) ?? ctx.rect(14, 14, 220, 100);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#a78bfa';
    ctx.fillText('Spring-Mass (SHM)', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
    ctx.fillText(`F = -kx = -${p.k}·${(displacement2 / 100).toFixed(2)}`, 26, 52);
    ctx.fillText(`ω = √(k/m) = ${omega.toFixed(2)} rad/s`, 26, 68);
    ctx.fillText(`T = ${T.toFixed(3)} s  f = ${f.toFixed(3)} Hz`, 26, 84);
    ctx.fillText(`KE: ${(kineticE / 1000).toFixed(4)}  PE: ${(potentialE / 1000).toFixed(4)} J`, 26, 100);
  };

  return { update, draw, setParams, getParams };
};