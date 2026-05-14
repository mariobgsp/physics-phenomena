export const pascalSimulation = () => {
  const p = {
      f1: 50,
      a1: 40,
      a2: 120,
      h1: 150,
      h2: 150,
  };

  const update = (deltaTime: number) => {
    const targetH1 = 150 + Math.sin(Date.now() / 1000) * 40;
    p.h1 = targetH1;
    // Pascal: h1*a1 + h2*a2 = constant (volume conservation)
    // 150*40 + 150*120 = 6000 + 18000 = 24000
    p.h2 = (24000 - p.h1 * p.a1) / p.a2;
    void deltaTime;
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const cx = width / 2;
    const baseY = height - 100;

    // Laboratory background
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#0a0f1d');
    bg.addColorStop(1, '#02040a');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Hydraulic Fluid (gradient blue)
    const fluidGrad = ctx.createLinearGradient(0, height - 200, 0, height);
    fluidGrad.addColorStop(0, '#0ea5e9');
    fluidGrad.addColorStop(1, '#075985');
    ctx.fillStyle = fluidGrad;

    // Small cylinder
    const x1 = cx - 120;
    ctx.fillRect(x1 - p.a1 / 2, baseY - p.h1, p.a1, p.h1);
    // Connecting pipe
    ctx.fillRect(x1, baseY - 30, 240, 30);
    // Large cylinder
    const x2 = cx + 120;
    ctx.fillRect(x2 - p.a2 / 2, baseY - p.h2, p.a2, p.h2);

    // Pistons
    ctx.fillStyle = '#475569';
    ctx.fillRect(x1 - p.a1 / 2 - 2, baseY - p.h1 - 10, p.a1 + 4, 10);
    ctx.fillRect(x2 - p.a2 / 2 - 2, baseY - p.h2 - 10, p.a2 + 4, 10);

    // Labels & Forces
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText('F₁ = 10N', x1, baseY - p.h1 - 30);
    ctx.font = 'bold 16px Outfit';
    ctx.fillText('F₂ = 30N', x2, baseY - p.h2 - 30);
    ctx.textAlign = 'left';

    // Info panel
    ctx.fillStyle = 'rgba(7, 13, 24, 0.8)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 210, 64, 10) ?? ctx.rect(14, 14, 210, 64);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Pascal\'s Principle', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText('F₁/A₁ = F₂/A₂', 26, 52);
    ctx.fillText('Pressure is constant throughout', 26, 68);
  };

  return { update, draw };
};
