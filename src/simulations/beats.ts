export const beatsSimulation = () => {
  let time = 0;
  const f1 = 10;
  const f2 = 11;

  const update = (deltaTime: number) => {
    time += deltaTime;
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const midY = height / 2;
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, width, height);

    ctx.beginPath();
    ctx.strokeStyle = '#f87171';
    ctx.lineWidth = 2;
    for (let x = 0; x < width; x++) {
      const t = time + x * 0.01;
      const y1 = Math.sin(t * f1);
      const y2 = Math.sin(t * f2);
      const y = midY + (y1 + y2) * 50;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Envelope
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
        const t = time + x * 0.01;
        const envelope = 2 * Math.cos(t * (f1 - f2) / 2);
        ctx.lineTo(x, midY + envelope * 50);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Info panel
    ctx.fillStyle = 'rgba(7, 13, 24, 0.8)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 210, 64, 10) ?? ctx.rect(14, 14, 210, 64);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#f87171';
    ctx.fillText('Acoustic Beats', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText(`f₁=${f1}Hz, f₂=${f2}Hz`, 26, 52);
    ctx.fillText(`f_beat = |f₁-f₂| = 1Hz`, 26, 68);
  };

  return { update, draw };
};
