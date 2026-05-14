export const trussSimulation = () => {
  const nodes = [
    { x: 100, y: 350, fixed: true },
    { x: 300, y: 350, fixed: true },
    { x: 200, y: 250, fixed: false },
    { x: 400, y: 250, fixed: false },
    { x: 500, y: 350, fixed: true },
  ];

  const members = [
    [0, 2], [1, 2], [0, 1], [2, 3], [1, 3], [3, 4], [1, 4]
  ];

  let load = 0;
  let time = 0;

  const update = (deltaTime: number) => {
    time += deltaTime;
    load = 50 + Math.sin(time * 2) * 40;
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    const nM = nodes[2];
    const nBot = nodes[0].y;

    // Members
    members.forEach(([i, j]) => {
      const n1 = nodes[i];
      const n2 = nodes[j];
      const isStressed = i === 2 || j === 2 || i === 3 || j === 3;
      
      ctx.lineWidth = isStressed ? 6 : 4;
      ctx.strokeStyle = isStressed ? '#f87171' : '#64748b';
      ctx.beginPath();
      ctx.moveTo(n1.x, n1.y);
      ctx.lineTo(n2.x, n2.y);
      ctx.stroke();
    });

    // Nodes
    nodes.forEach(n => {
      ctx.fillStyle = n.fixed ? '#334155' : '#38bdf8';
      ctx.beginPath(); ctx.arc(n.x, n.y, 8, 0, Math.PI * 2); ctx.fill();
    });

    // Load Arrow
    ctx.strokeStyle = '#fde68a';
    ctx.lineWidth = 4;
    const arrowLen = load;
    ctx.beginPath();
    ctx.moveTo(nM.x, nM.y - 20);
    ctx.lineTo(nM.x, nM.y - 20 - arrowLen);
    ctx.stroke();

    // Info panel
    ctx.fillStyle = 'rgba(7, 13, 24, 0.8)';
    ctx.beginPath();
    (ctx as any).roundRect?.(14, 14, 210, 64, 10) ?? ctx.rect(14, 14, 210, 64);
    ctx.fill();
    ctx.font = 'bold 12px Outfit';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Truss Bridge Load', 26, 34);
    ctx.font = '11px Outfit';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText(`Applied Load: ${load.toFixed(1)} kN`, 26, 52);
    ctx.fillText('Compression vs Tension', 26, 68);
  };

  return { update, draw };
};
