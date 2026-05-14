export const photoelectricSimulation = () => {
  const photons: { x: number; y: number; wavelength: number; trail: { x: number; y: number }[] }[] = [];
  const electrons: { x: number; y: number; vx: number; vy: number; alpha: number; trail: { x: number; y: number }[] }[] = [];
  let time = 0;
  let impactFlashes: { x: number; y: number; age: number }[] = [];

  const update = (deltaTime: number, width: number, height: number) => {
    time += deltaTime;

    if (Math.random() < 0.18) {
      const wl = 0.2 + Math.random() * 0.5; // 0=UV/violet, 1=red
      photons.push({
        x: 30 + Math.random() * (width * 0.45),
        y: -20,
        wavelength: wl,
        trail: [],
      });
    }

    const metalY = height * 0.75;

    for (let i = photons.length - 1; i >= 0; i--) {
      const p = photons[i];
      p.y += 280 * deltaTime;
      p.x += 80 * deltaTime;
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 10) p.trail.shift();

      if (p.y >= metalY) {
        if (p.wavelength < 0.6) {
          electrons.push({
            x: p.x, y: metalY,
            vx: (Math.random() - 0.5) * 120,
            vy: -180 - Math.random() * 100,
            alpha: 1,
            trail: [],
          });
          impactFlashes.push({ x: p.x, y: metalY, age: 0 });
        }
        photons.splice(i, 1);
      }
    }

    for (let i = electrons.length - 1; i >= 0; i--) {
      const e = electrons[i];
      e.x += e.vx * deltaTime;
      e.y += e.vy * deltaTime;
      e.vy += 120 * deltaTime;
      e.alpha -= deltaTime * 0.8;
      e.trail.push({ x: e.x, y: e.y });
      if (e.trail.length > 12) e.trail.shift();
      if (e.alpha <= 0 || e.y < -30 || e.x < 0 || e.x > width) electrons.splice(i, 1);
    }

    impactFlashes = impactFlashes.filter(f => {
      f.age += deltaTime;
      return f.age < 0.4;
    });
  };

  const photonColor = (wl: number) => {
    // wl: 0=UV/violet, 1=red
    const hue = (1 - wl) * 280;
    return `hsl(${hue}, 100%, 65%)`;
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const metalY = height * 0.75;

    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#04060e');
    bg.addColorStop(1, '#060810');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Metal surface
    const metalGrad = ctx.createLinearGradient(0, metalY, 0, height);
    metalGrad.addColorStop(0, '#475569');
    metalGrad.addColorStop(0.1, '#334155');
    metalGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = metalGrad;
    ctx.fillRect(0, metalY, width, height - metalY);

    // Metal lattice atoms
    ctx.fillStyle = 'rgba(148, 163, 184, 0.12)';
    for (let x = 22; x < width; x += 38) {
      for (let y = metalY + 18; y < height; y += 35) {
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Metal surface sheen
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(148, 163, 184, 0.3)';
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, metalY);
    ctx.lineTo(width, metalY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Impact flashes
    impactFlashes.forEach(f => {
      const r = (1 - f.age / 0.4) * 35;
      const alpha = 1 - f.age / 0.4;
      const flash = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r);
      flash.addColorStop(0, `rgba(250, 204, 21, ${alpha * 0.8})`);
      flash.addColorStop(1, 'rgba(250, 204, 21, 0)');
      ctx.fillStyle = flash;
      ctx.beginPath();
      ctx.arc(f.x, f.y, r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Photon trails & bodies
    photons.forEach(p => {
      const col = photonColor(p.wavelength);
      // Trail
      ctx.strokeStyle = col.replace('hsl', 'hsla').replace(')', ', 0.4)');
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      p.trail.forEach((t, i) => {
        if (i === 0) ctx.moveTo(t.x, t.y);
        else ctx.lineTo(t.x, t.y);
      });
      ctx.stroke();

      // Photon wave glyph
      ctx.shadowBlur = 12;
      ctx.shadowColor = col;
      ctx.strokeStyle = col;
      ctx.lineWidth = 2;
      ctx.beginPath();
      const waveLen = 18;
      for (let i = 0; i < 3; i++) {
        const wx = p.x - i * waveLen * 0.7;
        const wy = p.y - i * waveLen * 2.2;
        const phase = time * 18;
        const lx = wx + Math.sin(phase + i) * 6;
        const ly = wy + Math.cos(phase + i) * 6;
        if (i === 0) ctx.moveTo(lx, ly);
        else ctx.lineTo(lx, ly);
      }
      ctx.stroke();

      // Photon dot
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Electron trails & bodies
    electrons.forEach(e => {
      // Trail
      ctx.strokeStyle = `rgba(56, 189, 248, ${e.alpha * 0.35})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      e.trail.forEach((t, i) => {
        if (i === 0) ctx.moveTo(t.x, t.y);
        else ctx.lineTo(t.x, t.y);
      });
      ctx.stroke();

      // Body
      const eGlow = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, 14);
      eGlow.addColorStop(0, `rgba(56, 189, 248, ${e.alpha * 0.5})`);
      eGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = eGlow;
      ctx.beginPath();
      ctx.arc(e.x, e.y, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 14; ctx.shadowColor = '#38bdf8';
      ctx.fillStyle = `rgba(56, 189, 248, ${e.alpha})`;
      ctx.beginPath();
      ctx.arc(e.x, e.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.font = '10px Outfit';
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(186, 230, 253, ${e.alpha})`;
      ctx.fillText('e⁻', e.x, e.y - 10);
    });
    ctx.textAlign = 'left';

    // Info panel
    ctx.fillStyle = 'rgba(4, 6, 14, 0.85)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 268, 80, 10) ?? ctx.rect(14, 14, 268, 80);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Photoelectric Effect', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText('Only UV/violet photons eject electrons', 26, 52);
    ctx.fillText(`Photons active: ${photons.length}  Electrons: ${electrons.length}`, 26, 68);

    // Wavelength color bar
    for (let x = 0; x < 200; x++) {
      const wl = x / 200;
      ctx.fillStyle = photonColor(wl);
      ctx.fillRect(26 + x, 76, 1, 8);
    }
    ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
    ctx.font = '9px Outfit';
    ctx.fillText('UV', 24, 92);
    ctx.fillText('Red', 206, 92);
  };

  return { update, draw };
};
