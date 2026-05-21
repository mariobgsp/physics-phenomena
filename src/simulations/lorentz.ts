export const lorentzSimulation = () => {
  let time = 0;
  const cfg = {
    omega: 3,   // cyclotron frequency (B field strength proxy)
    v0: 150,    // initial speed
    charge: 1,  // +1 or -1
  };

  const trailMax = 200;
  const trail: { x: number; y: number }[] = [];

  const setParams = (params: Record<string, number>) => {
    if (params.omega !== undefined) {
      cfg.omega = params.omega;
      time = 0;
      trail.length = 0;
    }
    if (params.v0 !== undefined) {
      cfg.v0 = params.v0;
      time = 0;
      trail.length = 0;
    }
    if (params.charge !== undefined) {
      cfg.charge = params.charge > 0 ? 1 : -1;
      time = 0;
      trail.length = 0;
    }
  };

  const getParams = () => ({
    omega: cfg.omega,
    v0: cfg.v0,
    charge: cfg.charge,
  });

  const update = (deltaTime: number) => {
    time += deltaTime;

    const r = cfg.v0 / cfg.omega;
    const tx = r * Math.sin(cfg.omega * time * cfg.charge);
    const ty = r * (Math.cos(cfg.omega * time) - 1);

    trail.push({ x: tx, y: ty });
    if (trail.length > trailMax) trail.shift();
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#050a14';
    ctx.fillRect(0, 0, width, height);

    const startX = width / 2 - 50;
    const startY = height / 2;

    // B-field dots
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.fillStyle = 'rgba(59, 130, 246, 0.25)';
    ctx.lineWidth = 1;
    for (let x = 25; x < width; x += 45) {
      for (let y = 25; y < height; y += 45) {
        ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.stroke();
      }
    }

    ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
    ctx.font = 'bold 12px Outfit';
    ctx.fillText('B ⊙ (out of page)', width - 170, height - 20);

    // Cyclotron radius indicator
    const r = cfg.v0 / cfg.omega;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(startX, startY - r, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Trail
    if (trail.length > 1) {
      for (let i = 1; i < trail.length; i++) {
        const alpha = (i / trail.length) * 0.8;
        const glow = i > trail.length - 10 ? 10 : 0;
        ctx.shadowBlur = glow;
        ctx.shadowColor = '#f87171';
        ctx.strokeStyle = `rgba(248, 113, 113, ${alpha})`;
        ctx.lineWidth = 1 + (i / trail.length) * 2;
        ctx.beginPath();
        ctx.moveTo(startX + trail[i - 1].x, startY + trail[i - 1].y);
        ctx.lineTo(startX + trail[i].x, startY + trail[i].y);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    }

    const last = trail[trail.length - 1] ?? { x: 0, y: 0 };
    const px = startX + last.x;
    const py = startY + last.y;

    // Velocity vector
    const vx = cfg.v0 * Math.cos(cfg.omega * time * cfg.charge);
    const vy = -cfg.v0 * Math.sin(cfg.omega * time) * cfg.charge;
    const vmag = Math.sqrt(vx * vx + vy * vy) || 1;
    const vlen = 55;
    ctx.shadowBlur = 10; ctx.shadowColor = '#34d399';
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + (vx / vmag) * vlen, py + (vy / vmag) * vlen);
    ctx.stroke();
    // v arrowhead
    const vnx = vx / vmag, vny = vy / vmag;
    ctx.fillStyle = 'rgba(52, 211, 153, 0.85)';
    ctx.beginPath();
    ctx.moveTo(px + vnx * vlen, py + vny * vlen);
    ctx.lineTo(px + vnx * vlen - vnx * 7 - vny * 4, py + vny * vlen - vny * 7 + vnx * 4);
    ctx.lineTo(px + vnx * vlen - vnx * 7 + vny * 4, py + vny * vlen - vny * 7 - vnx * 4);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Lorentz force vector
    const fcX = (startX - px) / r;
    const fcY = (startY - r - py) / r;
    const fcMag = Math.sqrt(fcX * fcX + fcY * fcY) || 1;
    const flen = 45;
    ctx.shadowBlur = 10; ctx.shadowColor = '#c084fc';
    ctx.strokeStyle = 'rgba(192, 132, 252, 0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + (fcX / fcMag) * flen, py + (fcY / fcMag) * flen);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Particle glow
    const pGlow = ctx.createRadialGradient(px, py, 0, px, py, 35);
    pGlow.addColorStop(0, 'rgba(248, 113, 113, 0.4)');
    pGlow.addColorStop(1, 'rgba(248, 113, 113, 0)');
    ctx.fillStyle = pGlow;
    ctx.beginPath(); ctx.arc(px, py, 35, 0, Math.PI * 2); ctx.fill();

    // Particle body
    const pGrad = ctx.createRadialGradient(px - 4, py - 4, 1, px, py, 10);
    pGrad.addColorStop(0, '#fca5a5');
    pGrad.addColorStop(0.5, '#f87171');
    pGrad.addColorStop(1, '#7f1d1d');
    ctx.shadowBlur = 20; ctx.shadowColor = '#f87171';
    ctx.fillStyle = pGrad;
    ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#fff';
    ctx.font = '10px Outfit';
    ctx.textAlign = 'center';
    ctx.fillText(cfg.charge > 0 ? 'e⁻' : 'e⁺', px, py - 14);
    ctx.textAlign = 'left';

    // Info panel
    ctx.fillStyle = 'rgba(5, 10, 20, 0.82)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 260, 100, 10) ?? ctx.rect(14, 14, 260, 100);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#f87171';
    ctx.fillText('Lorentz Force (Cyclotron)', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
    ctx.fillText(`F = q(E + v×B)`, 26, 50);
    ctx.fillText(`r = mv/qB = v/ω = ${r.toFixed(1)} px`, 26, 66);
    ctx.fillText(`ω = ${cfg.omega.toFixed(2)} rad/s  |  v₀ = ${cfg.v0} px/s`, 26, 82);
    ctx.fillStyle = '#34d399';
    ctx.fillText('▶ v (velocity)', 26, 98);
    ctx.fillStyle = '#c084fc';
    ctx.fillText('               ▶ F (Lorentz)', 26, 98);
  };

  return { update, draw, setParams, getParams };
};