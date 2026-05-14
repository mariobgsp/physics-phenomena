export const dopplerSimulation = () => {
  let time = 0;
  let sourceX = 0;
  const waves: { r: number; x: number; life: number }[] = [];

  const update = (deltaTime: number, width: number) => {
    time += deltaTime;
    sourceX = (width / 2) + Math.sin(time * 0.8) * (width * 0.35);

    if (Math.floor(time * 15) !== Math.floor((time - deltaTime) * 15)) {
      waves.push({ r: 0, x: sourceX, life: 1 });
    }

    for (let i = waves.length - 1; i >= 0; i--) {
      const w = waves[i];
      w.r += 180 * deltaTime;
      w.life -= 0.45 * deltaTime;
      if (w.life <= 0) waves.splice(i, 1);
    }
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const cy = height / 2;

    // Atmospheric dark blue background
    const bg = ctx.createRadialGradient(width / 2, cy, 100, width / 2, cy, width);
    bg.addColorStop(0, '#0f172a');
    bg.addColorStop(1, '#020617');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Grid representing medium
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += 50) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Expanding wavefronts
    waves.forEach(w => {
      ctx.beginPath();
      ctx.arc(w.x, cy, w.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(56, 189, 248, ${w.life * 0.45})`;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    });

    // Moving Source
    const sourceGlow = ctx.createRadialGradient(sourceX, cy, 0, sourceX, cy, 45);
    sourceGlow.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
    sourceGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = sourceGlow;
    ctx.beginPath(); ctx.arc(sourceX, cy, 45, 0, Math.PI * 2); ctx.fill();

    ctx.shadowBlur = 20;
    ctx.shadowColor = '#38bdf8';
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath(); ctx.arc(sourceX, cy, 12, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    // Labels for Blue/Red shift
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Higher Frequency (Blue Shift)', sourceX > width / 2 ? width - 240 : 26, height - 60);
    ctx.fillStyle = '#f87171';
    ctx.fillText('Lower Frequency (Red Shift)', sourceX > width / 2 ? 26 : width - 240, height - 60);

    // Info panel
    ctx.fillStyle = 'rgba(7, 13, 24, 0.8)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 210, 64, 10) ?? ctx.rect(14, 14, 210, 64);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Doppler Effect', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText('Source moving through medium', 26, 52);
    ctx.fillText(`v_source ≈ ${Math.abs(Math.cos(time * 0.8) * 80).toFixed(0)} px/s`, 26, 68);
  };

  return { update, draw };
};
