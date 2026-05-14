export const wavesSimulation = () => {
  let time = 0;
  const numPoints = 120;
  const trail: { x: number; y: number }[][] = [[], []];

  const update = (deltaTime: number) => {
    time += deltaTime * 2.5;
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Deep liquid background
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#020617');
    bg.addColorStop(0.4, '#0f172a');
    bg.addColorStop(1, '#020617');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Subtle caustic grid
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 60) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
    }

    const midY = height / 2;
    const spacing = width / numPoints;

    // Draw interference waves
    const waveConfigs = [
      { amp: 40, freq: 0.04, speed: 1.2, color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.4)' },
      { amp: 30, freq: 0.06, speed: -0.8, color: '#818cf8', glow: 'rgba(129, 140, 248, 0.4)' },
    ];

    // Main interference wave
    ctx.beginPath();
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 20;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';

    for (let i = 0; i <= numPoints; i++) {
      const x = i * spacing;
      let combinedY = midY;
      waveConfigs.forEach(w => {
        combinedY += Math.sin(x * w.freq + time * w.speed) * w.amp;
      });

      if (i === 0) ctx.moveTo(x, combinedY);
      else ctx.lineTo(x, combinedY);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Source components (fainter)
    waveConfigs.forEach((w, idx) => {
      ctx.beginPath();
      ctx.strokeStyle = w.color;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      for (let i = 0; i <= numPoints; i++) {
        const x = i * spacing;
        const y = (idx === 0 ? midY - 120 : midY + 120) + Math.sin(x * w.freq + time * w.speed) * w.amp;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      // Labels
      ctx.fillStyle = w.color;
      ctx.font = 'bold 10px Outfit';
      ctx.fillText(`Wave ${idx + 1}`, 20, (idx === 0 ? midY - 140 : midY + 140));
    });

    // Info panel
    ctx.fillStyle = 'rgba(7, 13, 24, 0.8)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 210, 64, 10) ?? ctx.rect(14, 14, 210, 64);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText('Wave Interference', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText('Constructive & Destructive', 26, 52);
    ctx.fillText('Superposition Principle', 26, 68);
  };

  return { update, draw };
};
