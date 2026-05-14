export const conductionSimulation = () => {
  const segments = 25;
  let temperatures = new Array(segments).fill(0);
  let time = 0;

  const update = (deltaTime: number) => {
    time += deltaTime;
    const nextTemps = [...temperatures];
    
    // Left side is hot (heat source)
    temperatures[0] = 100;
    // Right side is cold (sink)
    temperatures[segments - 1] = 0;

    for (let i = 1; i < segments - 1; i++) {
        // Fourier's Law discrete approximation
        const conductivity = 0.08;
        nextTemps[i] = temperatures[i] + conductivity * (temperatures[i-1] + temperatures[i+1] - 2 * temperatures[i]);
    }
    temperatures = nextTemps;
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#0f172a');
    bg.addColorStop(1, '#020617');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const rodWidth = width * 0.7;
    const rodHeight = 35;
    const startX = (width - rodWidth) / 2;
    const startY = height / 2 - rodHeight / 2;
    const segW = rodWidth / segments;

    // Metal rod glow
    ctx.shadowBlur = 20;
    ctx.shadowColor = 'rgba(239, 68, 68, 0.15)';

    temperatures.forEach((temp, i) => {
      // Interpolate color from Cold (blue) to Hot (red)
      const hue = 220 - (temp * 2.2); // 220 (blue) to 0 (red)
      ctx.fillStyle = `hsl(${hue}, 85%, 55%)`;
      ctx.fillRect(startX + i * segW, startY, segW + 1, rodHeight);
      
      // Specular shine on the rod
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fillRect(startX + i * segW, startY + 5, segW + 1, 4);
    });
    ctx.shadowBlur = 0;

    // Labels
    ctx.font = 'bold 13px Outfit';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('Heat Source (100°C)', startX - 140, height / 2 + 5);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('Heat Sink (0°C)', startX + rodWidth + 20, height / 2 + 5);

    // Heat flow arrows
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 5; i++) {
        const ax = startX + (rodWidth / 6) * (i + 1) + Math.sin(time * 3 + i) * 10;
        ctx.beginPath();
        ctx.moveTo(ax, startY + rodHeight + 25);
        ctx.lineTo(ax + 15, startY + rodHeight + 25);
        ctx.lineTo(ax + 10, startY + rodHeight + 20);
        ctx.stroke();
    }

    // Info panel
    ctx.fillStyle = 'rgba(7, 13, 24, 0.8)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 210, 64, 10) ?? ctx.rect(14, 14, 210, 64);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('Thermal Conduction', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText('dq/dt = -kA (dT/dx)', 26, 52);
    ctx.fillText('Steady state gradient forming', 26, 68);
  };

  return { update, draw };
};
