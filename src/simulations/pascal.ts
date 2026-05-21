export const pascalSimulation = () => {
  let force1 = 0;
  let time = 0;

  const cfg = {
    areaRatio: 3,     // A2 = ratio * A1
    inputForce: 48,   // max input force amplitude
  };

  const setParams = (params: Record<string, number>) => {
    if (params.areaRatio !== undefined) cfg.areaRatio = Math.max(1.5, Math.min(6, params.areaRatio));
    if (params.inputForce !== undefined) cfg.inputForce = params.inputForce;
  };

  const getParams = () => ({ ...cfg });

  const update = (deltaTime: number) => {
    time += deltaTime;
    force1 = Math.max(0, Math.sin(time * 1.8)) * cfg.inputForce;
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#05080e';
    ctx.fillRect(0, 0, width, height);

    const ratio = cfg.areaRatio;
    const cx = width / 2;
    const p1x = cx - 160;
    const p1w = 42;
    const p2w = Math.round(p1w * ratio); // A2 = ratio * A1
    const p2x = cx + 30;
    const baseY = height * 0.72;
    const pipeH = 55;
    const d1 = force1;
    const d2 = force1 / ratio;
    const F2 = force1 * ratio;

    // Fluid
    const fluidGrad = ctx.createLinearGradient(0, baseY - 130, 0, baseY + pipeH);
    fluidGrad.addColorStop(0, 'rgba(59, 130, 246, 0.55)');
    fluidGrad.addColorStop(1, 'rgba(37, 99, 235, 0.85)');
    ctx.fillStyle = fluidGrad;
    ctx.fillRect(p1x + 3, baseY - 110 + d1, p1w - 5, 110 - d1);
    ctx.fillRect(p1x + 3, baseY, p2x - p1x + p2w - 3, pipeH);
    ctx.fillRect(p2x + 3, baseY - 110 - d2, p2w - 5, 110 + d2);

    // Pipe walls
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(100, 116, 139, 0.4)';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(p1x, baseY - 160);
    ctx.lineTo(p1x, baseY + pipeH);
    ctx.lineTo(p2x + p2w, baseY + pipeH);
    ctx.lineTo(p2x + p2w, baseY - 160);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(p1x + p1w, baseY - 160);
    ctx.lineTo(p1x + p1w, baseY);
    ctx.lineTo(p2x, baseY);
    ctx.lineTo(p2x, baseY - 160);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Piston 1
    const p1g = ctx.createLinearGradient(p1x + 3, 0, p1x + p1w - 5, 0);
    p1g.addColorStop(0, '#94a3b8');
    p1g.addColorStop(1, '#475569');
    ctx.fillStyle = p1g;
    ctx.beginPath();
    (ctx as any).roundRect?.(p1x + 3, baseY - 128 + d1, p1w - 5, 18, 4) ?? ctx.fillRect(p1x + 3, baseY - 128 + d1, p1w - 5, 18);
    ctx.fill();

    // Piston 2
    const p2g = ctx.createLinearGradient(p2x + 3, 0, p2x + p2w - 5, 0);
    p2g.addColorStop(0, '#94a3b8');
    p2g.addColorStop(1, '#475569');
    ctx.fillStyle = p2g;
    ctx.beginPath();
    (ctx as any).roundRect?.(p2x + 3, baseY - 128 - d2, p2w - 5, 18, 4) ?? ctx.fillRect(p2x + 3, baseY - 128 - d2, p2w - 5, 18);
    ctx.fill();

    // Weight 1 (red)
    ctx.shadowBlur = 10; ctx.shadowColor = '#f87171';
    const w1g = ctx.createLinearGradient(0, 0, 0, 30);
    w1g.addColorStop(0, '#f87171');
    w1g.addColorStop(1, '#7f1d1d');
    ctx.fillStyle = w1g;
    ctx.beginPath();
    (ctx as any).roundRect?.(p1x + p1w / 2 - 14, baseY - 148 + d1, 28, 22, 4) ?? ctx.fillRect(p1x + p1w / 2 - 14, baseY - 148 + d1, 28, 22);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Weight 2 (amber, bigger with ratio)
    ctx.shadowBlur = 10; ctx.shadowColor = '#fbbf24';
    const w2g = ctx.createLinearGradient(0, 0, 0, 50);
    w2g.addColorStop(0, '#fbbf24');
    w2g.addColorStop(1, '#78350f');
    ctx.fillStyle = w2g;
    const w2HalfW = Math.min(p2w / 2 - 6, 60);
    ctx.beginPath();
    (ctx as any).roundRect?.(p2x + p2w / 2 - w2HalfW, baseY - 158 - d2, w2HalfW * 2, 30, 6) ?? ctx.fillRect(p2x + p2w / 2 - w2HalfW, baseY - 158 - d2, w2HalfW * 2, 30);
    ctx.fill();
    ctx.shadowBlur = 0;

    // P1 = P2 label
    ctx.font = 'bold 12px Outfit';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#60a5fa';
    ctx.fillText('P₁ = P₂', cx - 55, baseY + pipeH / 2 + 5);
    ctx.textAlign = 'left';

    // Pressure wave in pipe
    for (let i = 0; i < 5; i++) {
      const wx = p1x + p1w + ((time * 100 + i * 50) % (p2x - p1x - p1w));
      const alpha = 0.12 + 0.08 * Math.sin(time * 4 + i);
      ctx.fillStyle = `rgba(147, 197, 253, ${alpha})`;
      ctx.beginPath();
      ctx.arc(wx, baseY + pipeH / 2, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Force labels
    ctx.font = '12px Outfit';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fca5a5';
    ctx.fillText(`F₁ = ${force1.toFixed(1)}`, p1x + p1w / 2, baseY - 158 + d1);
    ctx.fillStyle = '#fde68a';
    ctx.fillText(`F₂ = ${F2.toFixed(1)}`, p2x + p2w / 2, baseY - 172 - d2);

    ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
    ctx.font = '10px Outfit';
    ctx.fillText(`A₁`, p1x + p1w / 2, baseY + pipeH + 16);
    ctx.fillText(`A₂ = ${ratio.toFixed(1)}×A₁`, p2x + p2w / 2, baseY + pipeH + 16);
    ctx.textAlign = 'left';

    // Info panel
    ctx.fillStyle = 'rgba(5, 8, 14, 0.85)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 280, 80, 10) ?? ctx.rect(14, 14, 280, 80);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#60a5fa';
    ctx.fillText("Pascal's Principle", 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
    ctx.fillText(`F₁/A₁ = F₂/A₂`, 26, 50);
    ctx.fillText(`F₂ = F₁ × (A₂/A₁) = F₁ × ${ratio.toFixed(1)}`, 26, 64);
    ctx.fillText(`F₁=${force1.toFixed(1)}  →  F₂=${F2.toFixed(1)} N`, 26, 78);
  };

  return { update, draw, setParams, getParams };
};