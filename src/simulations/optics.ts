export const opticsSimulation = () => {
  let mouseX = 300;
  let mouseY = 200;

  const update = (_deltaTime: number, width: number, height: number) => {
    void width; void height;
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number, time?: number) => {
    const t = (time || 0) / 1000;
    const midX = width / 2;
    const sourceX = 80;
    const sourceY = height / 2 + Math.sin(t * 1.2) * 120;

    // Dark optical bench background
    const bg = ctx.createLinearGradient(0, 0, width, 0);
    bg.addColorStop(0, '#020617');
    bg.addColorStop(0.5, '#0a1428');
    bg.addColorStop(1, '#020617');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Interface boundary
    ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.fillRect(midX, 0, midX, height);

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 6]);
    ctx.beginPath(); ctx.moveTo(midX, 0); ctx.lineTo(midX, height); ctx.stroke();
    ctx.setLineDash([]);

    // Medium Labels
    ctx.font = 'bold 13px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
    ctx.fillText('Medium 1 (Air)', 30, 40);
    ctx.fillText('Medium 2 (Glass)', midX + 30, 40);

    // Refractive index
    const n1 = 1.0;
    const n2 = 1.5;
    const dx = midX - sourceX;
    const dy = height / 2 - sourceY;
    const angle1 = Math.atan2(dy, dx);
    const theta1 = Math.PI / 2 - Math.abs(angle1);
    const sinTheta2 = (n1 * Math.sin(theta1)) / n2;
    const theta2 = Math.asin(sinTheta2);
    const angle2 = angle1 > 0 ? theta2 : -theta2;

    // Ray source glow
    const sourceGlow = ctx.createRadialGradient(sourceX, sourceY, 0, sourceX, sourceY, 40);
    sourceGlow.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    sourceGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sourceGlow;
    ctx.beginPath(); ctx.arc(sourceX, sourceY, 40, 0, Math.PI * 2); ctx.fill();

    // Incident Ray
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#38bdf8';
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(sourceX, sourceY);
    ctx.lineTo(midX, height / 2);
    ctx.stroke();

    // Refracted Ray
    const refractX = midX + Math.cos(angle2) * 400;
    const refractY = height / 2 - Math.sin(angle2) * 400;
    ctx.strokeStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(midX, height / 2);
    ctx.lineTo(refractX, refractY);
    ctx.stroke();

    // Reflected Ray
    const reflectY = height / 2 + (height / 2 - sourceY);
    ctx.strokeStyle = 'rgba(248, 250, 252, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(midX, height / 2);
    ctx.lineTo(sourceX, reflectY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Normals and Angles
    ctx.strokeStyle = 'rgba(248, 113, 113, 0.6)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(midX - 100, height / 2);
    ctx.lineTo(midX + 100, height / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Info Panel
    ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 210, 85, 10) ?? ctx.rect(14, 14, 210, 85);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Snell\'s Law', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
    ctx.fillText(`θ₁ (incident) = ${(theta1 * 180 / Math.PI).toFixed(1)}°`, 26, 52);
    ctx.fillText(`θ₂ (refracted) = ${(theta2 * 180 / Math.PI).toFixed(1)}°`, 26, 68);
    ctx.fillText(`n₁ = 1.0, n₂ = 1.5`, 26, 84);
  };

  return { update, draw };
};
