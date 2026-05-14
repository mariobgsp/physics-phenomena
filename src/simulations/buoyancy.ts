export const buoyancySimulation = () => {
  const p = {
    y: 200,
    vy: 0,
    mass: 12,
    radius: 35,
    waterDensity: 0.0015,
    g: 9.8,
    isFloating: false,
  };

  const bubbles: { x: number; y: number; r: number; v: number }[] = [];

  const update = (deltaTime: number, width: number, height: number) => {
    const waterY = height * 0.6;
    const submergedVolume = Math.max(0, Math.min(2 * p.radius, p.y + p.radius - waterY)) * (p.radius * 2);
    const buoyantForce = -p.waterDensity * submergedVolume * p.g * 800;
    const weight = p.mass * p.g * 10;
    
    p.vy += (weight + buoyantForce) * deltaTime;
    p.y += p.vy * deltaTime;
    p.vy *= 0.985; // Drag

    if (Math.random() < 0.1) {
        bubbles.push({ x: Math.random() * width, y: height, r: 2 + Math.random() * 4, v: 50 + Math.random() * 100 });
    }
    for (let i = bubbles.length - 1; i >= 0; i--) {
        bubbles[i].y -= bubbles[i].v * deltaTime;
        if (bubbles[i].y < waterY) bubbles.splice(i, 1);
    }
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const waterY = height * 0.6;

    // Air
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, waterY);

    // Water with caustics effect
    const waterGrad = ctx.createLinearGradient(0, waterY, 0, height);
    waterGrad.addColorStop(0, '#0e7490');
    waterGrad.addColorStop(1, '#164e63');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, waterY, width, height - waterY);

    // Bubbles
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    bubbles.forEach(b => {
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.stroke();
    });

    const cx = width / 2;

    // Buoyancy force vector
    if (p.y + p.radius > waterY) {
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx, p.y);
        ctx.lineTo(cx, p.y - 60);
        ctx.stroke();
        ctx.fillStyle = '#34d399';
        ctx.fillText('F_buoyant', cx + 10, p.y - 50);
    }

    // Floating body
    const grad = ctx.createRadialGradient(cx - 10, p.y - 10, 5, cx, p.y, p.radius);
    grad.addColorStop(0, '#fde68a');
    grad.addColorStop(1, '#b45309');
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#d97706';
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Info panel
    ctx.fillStyle = 'rgba(7, 13, 24, 0.8)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 210, 64, 10) ?? ctx.rect(14, 14, 210, 64);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Archimedes\' Principle', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText(`F_b = ρgV_displaced`, 26, 52);
    ctx.fillText('Buoyancy = Weight of displaced fluid', 26, 68);
  };

  return { update, draw };
};
