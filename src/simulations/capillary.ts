export const capillarySimulation = () => {
  let time = 0;

  const tubes = [
    { r: 28, x: -110, label: 'r = 28' },
    { r: 15, x: 0,    label: 'r = 15' },
    { r: 5,  x: 100,  label: 'r = 5'  },
  ];

  const update = (deltaTime: number) => {
    time += deltaTime;
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const cx = width / 2;
    const reservoirY = height - 90;

    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#08111e');
    bg.addColorStop(1, '#050a14');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
    ctx.lineWidth = 1;
    for (let y = 50; y < height; y += 50) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Reservoir
    const resGrad = ctx.createLinearGradient(0, reservoirY, 0, height);
    resGrad.addColorStop(0, 'rgba(14, 116, 163, 0.8)');
    resGrad.addColorStop(1, 'rgba(7, 60, 95, 0.9)');
    ctx.fillStyle = resGrad;
    ctx.fillRect(cx - 170, reservoirY, 340, 90);

    // Reservoir wave
    ctx.strokeStyle = 'rgba(125, 211, 252, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = cx - 170; x < cx + 170; x += 3) {
      const y = reservoirY + Math.sin((x + time * 60) * 0.04) * 4;
      if (x === cx - 170) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Reservoir border
    ctx.strokeStyle = '#0369a1';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - 170, reservoirY, 340, 90);

    tubes.forEach(tube => {
      const tx = cx + tube.x;
      const maxRise = 850 / tube.r;
      const targetH = Math.min(maxRise, reservoirY - 60);
      const currentH = Math.min(targetH, time * 60 * (30 / tube.r));
      const tubeTop = reservoirY - 230;
      const tubeBot = reservoirY;

      // Glass tube walls
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(186, 230, 253, 0.3)';
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.55)';
      ctx.lineWidth = 2;
      // Left wall
      ctx.beginPath();
      ctx.moveTo(tx - tube.r, tubeTop);
      ctx.lineTo(tx - tube.r, tubeBot);
      ctx.stroke();
      // Right wall
      ctx.beginPath();
      ctx.moveTo(tx + tube.r, tubeTop);
      ctx.lineTo(tx + tube.r, tubeBot);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Water column with gradient
      const waterTop = reservoirY - currentH;
      const waterGrad = ctx.createLinearGradient(0, waterTop, 0, reservoirY);
      waterGrad.addColorStop(0, 'rgba(56, 189, 248, 0.9)');
      waterGrad.addColorStop(1, 'rgba(14, 116, 163, 0.7)');
      ctx.fillStyle = waterGrad;
      ctx.fillRect(tx - tube.r + 1, waterTop, tube.r * 2 - 2, currentH);

      // Concave meniscus (water wets glass)
      if (currentH > 3) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#38bdf8';
        ctx.fillStyle = 'rgba(56, 189, 248, 0.95)';
        ctx.beginPath();
        const meniscusY = waterTop + tube.r * 0.35;
        ctx.moveTo(tx - tube.r + 1, waterTop);
        ctx.quadraticCurveTo(tx, meniscusY, tx + tube.r - 1, waterTop);
        ctx.lineTo(tx + tube.r - 1, waterTop + tube.r * 0.35);
        ctx.lineTo(tx - tube.r + 1, waterTop + tube.r * 0.35);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Height label
      ctx.font = 'bold 11px Outfit';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#7dd3fc';
      ctx.fillText(`h=${currentH.toFixed(0)}`, tx, waterTop - 8);

      // Tube radius label
      ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
      ctx.font = '11px Outfit';
      ctx.fillText(tube.label, tx, reservoirY + 20);

      // Dashed rise indicator
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(tx - tube.r - 8, waterTop);
      ctx.lineTo(tx + tube.r + 8, waterTop);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    ctx.textAlign = 'left';

    // Info panel
    ctx.fillStyle = 'rgba(5, 8, 20, 0.85)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 250, 64, 10) ?? ctx.rect(14, 14, 250, 64);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Capillary Action', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
    ctx.fillText('h = 2γcosθ / (ρgr)', 26, 52);
    ctx.fillText('Narrower tube → higher rise', 26, 68);
  };

  return { update, draw };
};
