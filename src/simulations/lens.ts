export const lensSimulation = () => {
  let time = 0;
  const focalLength = 150;

  const update = (deltaTime: number) => {
    time += deltaTime;
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const cx = width / 2;
    const cy = height / 2;

    // Deep void bench
    const bg = ctx.createLinearGradient(0, 0, width, 0);
    bg.addColorStop(0, '#04060b');
    bg.addColorStop(0.5, '#0a0d14');
    bg.addColorStop(1, '#04060b');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Optical Axis
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([10, 8]);
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(width, cy); ctx.stroke();
    ctx.setLineDash([]);

    // Focal Points
    const f1x = cx - focalLength;
    const f2x = cx + focalLength;
    [f1x, f2x].forEach(fx => {
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath(); ctx.arc(fx, cy, 3, 0, Math.PI * 2); ctx.fill();
      ctx.font = '10px Outfit';
      ctx.fillText('F', fx - 4, cy + 18);
    });

    // Lens Body
    const lensW = 40;
    const lensH = 180;
    const lensGrad = ctx.createLinearGradient(cx - lensW, cy, cx + lensW, cy);
    lensGrad.addColorStop(0, 'rgba(56, 189, 248, 0.1)');
    lensGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.25)');
    lensGrad.addColorStop(1, 'rgba(56, 189, 248, 0.1)');
    
    ctx.fillStyle = lensGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, lensW, lensH / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Animated Ray Tracing
    const numRays = 7;
    const progress = (time * 0.4) % 1.5; // 0 to 1.5 range
    const preProgress = Math.min(1, progress * 2);
    const postProgress = Math.max(0, (progress - 0.5) * 2);

    for (let i = 0; i < numRays; i++) {
      const yOffset = (i - (numRays - 1) / 2) * 25;
      const rayY = cy + yOffset;
      const hue = 190 + i * 5;

      // Segment 1: Source to Lens
      const seg1EndX = cx - (1 - preProgress) * cx;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `hsla(${hue}, 100%, 65%, 0.4)`;
      ctx.strokeStyle = `hsla(${hue}, 100%, 75%, ${0.7 * (1-postProgress*0.5)})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, rayY);
      ctx.lineTo(Math.min(cx, seg1EndX), rayY);
      ctx.stroke();

      // Segment 2: Lens to Focus
      if (progress > 0.5) {
        const lensHitY = rayY;
        const targetX = f2x;
        const targetY = cy;
        
        // Calculate vector from lens hit to focal point
        const dx = targetX - cx;
        const dy = targetY - lensHitY;
        const seg2Progress = Math.min(1.5, postProgress * 2.2);
        const seg2EndX = cx + dx * seg2Progress;
        const seg2EndY = lensHitY + dy * seg2Progress;

        ctx.strokeStyle = `hsla(${hue}, 100%, 65%, 0.7)`;
        ctx.beginPath();
        ctx.moveTo(cx, lensHitY);
        ctx.lineTo(seg2EndX, seg2EndY);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    }

    // Focal point convergence glow (when rays converge)
    if (postProgress > 0.5) {
      const fpGlow2 = ctx.createRadialGradient(f2x, cy, 0, f2x, cy, 30 * postProgress);
      fpGlow2.addColorStop(0, `rgba(251, 191, 36, ${postProgress * 0.6})`);
      fpGlow2.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = fpGlow2;
      ctx.beginPath(); ctx.arc(f2x, cy, 30, 0, Math.PI * 2); ctx.fill();
    }

    // Info panel
    ctx.fillStyle = 'rgba(3, 3, 8, 0.85)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 250, 62, 10) ?? ctx.rect(14, 14, 250, 62);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Convex Lens & Focal Point', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
    ctx.fillText(`Focal length: f = ${focalLength} px`, 26, 52);
    ctx.fillText('Parallel rays converge at F', 26, 68);
  };

  return { update, draw };
};
