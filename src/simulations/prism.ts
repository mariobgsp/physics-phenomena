export const prismSimulation = () => {
  let mouseAngle = 0;

  const update = (deltaTime: number) => {
    mouseAngle += deltaTime * 0.3;
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const cx = width / 2;
    const cy = height / 2;
    const prismSize = 120;

    // Dark optical laboratory background
    const bg = ctx.createRadialGradient(cx, cy, 100, cx, cy, width);
    bg.addColorStop(0, '#0a0a14');
    bg.addColorStop(1, '#020205');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Incident White Light
    const sourceX = 50;
    const sourceY = cy + Math.sin(mouseAngle) * 80;
    
    ctx.shadowBlur = 20;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(sourceX, sourceY);
    ctx.lineTo(cx - 30, cy);
    ctx.stroke();

    // Prism (Triangle)
    ctx.shadowBlur = 25;
    ctx.shadowColor = 'rgba(148, 163, 184, 0.3)';
    const grad = ctx.createLinearGradient(cx - prismSize, cy, cx + prismSize, cy);
    grad.addColorStop(0, 'rgba(148, 163, 184, 0.1)');
    grad.addColorStop(0.5, 'rgba(148, 163, 184, 0.25)');
    grad.addColorStop(1, 'rgba(148, 163, 184, 0.1)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(cx, cy - prismSize);
    ctx.lineTo(cx - prismSize, cy + prismSize * 0.6);
    ctx.lineTo(cx + prismSize, cy + prismSize * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Dispersed Spectrum Rays
    const colors = [
      { color: '#ef4444', angle: 0.12, label: 'Red' },
      { color: '#f97316', angle: 0.16, label: 'Orange' },
      { color: '#eab308', angle: 0.20, label: 'Yellow' },
      { color: '#22c55e', angle: 0.24, label: 'Green' },
      { color: '#3b82f6', angle: 0.28, label: 'Blue' },
      { color: '#6366f1', angle: 0.32, label: 'Indigo' },
      { color: '#a855f7', angle: 0.36, label: 'Violet' },
    ];

    colors.forEach((c, i) => {
      ctx.beginPath();
      ctx.strokeStyle = c.color;
      ctx.lineWidth = 3;
      ctx.globalCompositeOperation = 'screen';
      ctx.shadowBlur = 10;
      ctx.shadowColor = c.color;
      
      const startX = cx - 10;
      const startY = cy + 10;
      const endX = width;
      const endY = cy + 20 + i * 25;

      ctx.moveTo(startX, startY);
      ctx.bezierCurveTo(cx + 40, cy + 15, cx + 100, endY - 10, endX, endY);
      ctx.stroke();

      // Spectral Labels
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = c.color;
      ctx.font = '10px Outfit';
      ctx.fillText(c.label, width - 50, endY - 5);
    });
    ctx.globalAlpha = 1;

    // Info panel
    ctx.fillStyle = 'rgba(3, 3, 8, 0.8)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 210, 64, 10) ?? ctx.rect(14, 14, 210, 64);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText('Prismatic Dispersion', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText('Refractive index depends on λ', 26, 52);
    ctx.fillText('Snell\'s Law x 7 colors', 26, 68);
  };

  return { update, draw };
};
