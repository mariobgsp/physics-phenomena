export const standingWavesSimulation = () => {
  let time = 0;
  const nodes = 5;

  const update = (deltaTime: number) => {
    time += deltaTime * 4;
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const midY = height / 2;
    const padding = 100;
    const w = width - padding * 2;

    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, width, height);

    // Supports
    ctx.fillStyle = '#334155';
    ctx.fillRect(padding - 10, midY - 60, 10, 120);
    ctx.fillRect(width - padding, midY - 60, 10, 120);

    // Wave
    ctx.lineWidth = 3;
    ctx.shadowBlur = 15;
    
    // Antinode glow
    const amp = Math.sin(time) * 80;
    
    ctx.beginPath();
    ctx.strokeStyle = '#818cf8';
    ctx.shadowColor = '#818cf8';
    for (let x = 0; x <= w; x += 2) {
      const y = midY + Math.sin((x / w) * Math.PI * nodes) * amp;
      if (x === 0) ctx.moveTo(padding + x, y);
      else ctx.lineTo(padding + x, y);
    }
    ctx.stroke();

    // Secondary harmonic (fainter)
    ctx.shadowBlur = 0;
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'rgba(129, 140, 248, 0.3)';
    ctx.beginPath();
    for (let x = 0; x <= w; x += 2) {
        const y = midY - Math.sin((x / w) * Math.PI * nodes) * amp;
        if (x === 0) ctx.moveTo(padding + x, y);
        else ctx.lineTo(padding + x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Nodes highlighting
    for (let i = 0; i <= nodes; i++) {
        const nx = padding + (i / nodes) * w;
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(nx, midY, 4, 0, Math.PI * 2); ctx.fill();
        ctx.font = '10px Outfit';
        ctx.fillText('Node', nx - 12, midY + 20);
    }

    // Info panel
    ctx.fillStyle = 'rgba(7, 13, 24, 0.8)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 210, 64, 10) ?? ctx.rect(14, 14, 210, 64);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#818cf8';
    ctx.fillText('Standing Waves', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText(`Mode n = ${nodes}`, 26, 52);
    ctx.fillText('Harmonic Resonance', 26, 68);
  };

  return { update, draw };
};
