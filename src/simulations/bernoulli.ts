export const bernoulliSimulation = () => {
  const particles: { x: number; y: number; vx: number; hue: number }[] = [];
  let time = 0;

  const update = (deltaTime: number, width: number, height: number) => {
    time += deltaTime;
    if (particles.length < 150) {
      particles.push({
        x: -20,
        y: height / 2 + (Math.random() - 0.5) * 80,
        vx: 150,
        hue: 200,
      });
    }

    const constrictionX = width / 2;
    const constrictionW = 120;

    particles.forEach(p => {
      // Bernoulli constriction logic: flow speeds up in narrow part
      const inConstriction = Math.abs(p.x - constrictionX) < constrictionW;
      const speedMult = inConstriction ? 2.5 : 1.0;
      p.x += p.vx * speedMult * deltaTime;
      
      // Squeeze Y towards center in constriction
      if (inConstriction) {
          const targetY = height / 2;
          p.y += (targetY - p.y) * 0.05;
          p.hue = 180;
      } else {
          p.hue = 210;
      }

      if (p.x > width + 20) {
          p.x = -20;
          p.y = height / 2 + (Math.random() - 0.5) * 80;
      }
    });
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const midY = height / 2;
    const constrictionX = width / 2;
    const constrictionW = 120;

    // Dark fluid background
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#020617');
    bg.addColorStop(0.5, '#0a1428');
    bg.addColorStop(1, '#020617');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Pipe walls
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, midY - 100);
    ctx.bezierCurveTo(constrictionX - constrictionW, midY - 100, constrictionX - 40, midY - 40, constrictionX, midY - 40);
    ctx.bezierCurveTo(constrictionX + 40, midY - 40, constrictionX + constrictionW, midY - 100, width, midY - 100);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, midY + 100);
    ctx.bezierCurveTo(constrictionX - constrictionW, midY + 100, constrictionX - 40, midY + 40, constrictionX, midY + 40);
    ctx.bezierCurveTo(constrictionX + 40, midY + 40, constrictionX + constrictionW, midY + 100, width, midY + 100);
    ctx.stroke();

    // Streamline particles
    particles.forEach(p => {
      ctx.fillStyle = `hsla(${p.hue}, 85%, 65%, 0.6)`;
      ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill();
    });

    // Pressure Gauges
    const drawGauge = (x: number, y: number, p: string, label: string) => {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x - 20, y - 100, 40, 100);
        ctx.fillStyle = '#38bdf8';
        const h = p === 'High' ? 80 : 30;
        ctx.fillRect(x - 18, y - h, 36, h);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px Outfit';
        ctx.fillText(label, x - 15, y + 20);
    };

    drawGauge(100, midY - 100, 'High', 'P_high');
    drawGauge(constrictionX, midY - 40, 'Low', 'P_low');
    drawGauge(width - 100, midY - 100, 'High', 'P_high');

    // Info panel
    ctx.fillStyle = 'rgba(7, 13, 24, 0.8)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 250, 64, 10) ?? ctx.rect(14, 14, 250, 64);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Bernoulli\'s Principle', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText('Narrow pipe → high velocity → low pressure', 26, 52);
    ctx.fillText('P + ½ρv² + ρgh = constant', 26, 68);
  };

  return { update, draw };
};
