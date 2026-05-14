export const massDamperSimulation = () => {
  let time = 0;
  let b_x = 0, b_v = 0;
  let d_x = 0, d_v = 0;

  const m1 = 100, k1 = 50, c1 = 0.5;
  const m2 = 5, k2 = 2.5, c2 = 1.0;

  const update = (deltaTime: number) => {
    time += deltaTime;
    const w_n = Math.sqrt(k1 / m1);
    const F = 50 * Math.sin(w_n * time);

    const a1 = (F - k1 * b_x - c1 * b_v + k2 * (d_x - b_x) + c2 * (d_v - b_v)) / m1;
    const a2 = (-k2 * (d_x - b_x) - c2 * (d_v - b_v)) / m2;

    b_v += a1 * deltaTime * 10;
    d_v += a2 * deltaTime * 10;
    b_x += b_v * deltaTime * 10;
    d_x += d_v * deltaTime * 10;
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const cx = width / 2;
    const baseY = height - 100;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Ground
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, baseY, width, height - baseY);

    // Building
    ctx.fillStyle = '#334155';
    ctx.fillRect(cx + b_x - 40, baseY - 150, 80, 150);

    // Damper
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(cx + d_x, baseY - 130, 15, 0, Math.PI * 2);
    ctx.fill();

    // Info panel
    ctx.fillStyle = 'rgba(7, 13, 24, 0.8)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 210, 64, 10) ?? ctx.rect(14, 14, 210, 64);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('Tuned Mass Damper', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText('Resonance suppression', 26, 52);
    ctx.fillText(`Building Sway: ${b_x.toFixed(2)}`, 26, 68);
  };

  return { update, draw };
};
