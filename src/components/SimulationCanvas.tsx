import React, { useEffect, useRef } from 'react';

interface SimulationCanvasProps {
  id: string;
  onDraw: (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => void;
  onUpdate?: (deltaTime: number, width: number, height: number) => void;
  onMouseMove?: (x: number, y: number) => void;
  onMouseDown?: (x: number, y: number) => void;
  onMouseUp?: (x: number, y: number) => void;
}

const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  id,
  onDraw,
  onUpdate,
  onMouseMove,
  onMouseDown,
  onMouseUp,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(undefined);
  const previousTimeRef = useRef<number>(undefined);

  // ── Store latest callbacks in refs so the RAF loop always uses fresh closures ──
  const onDrawRef = useRef(onDraw);
  const onUpdateRef = useRef(onUpdate);
  const onMouseMoveRef = useRef(onMouseMove);
  const onMouseDownRef = useRef(onMouseDown);
  const onMouseUpRef = useRef(onMouseUp);

  // Keep refs current on every render (no deps array → runs every render)
  useEffect(() => { onDrawRef.current = onDraw; });
  useEffect(() => { onUpdateRef.current = onUpdate; });
  useEffect(() => { onMouseMoveRef.current = onMouseMove; });
  useEffect(() => { onMouseDownRef.current = onMouseDown; });
  useEffect(() => { onMouseUpRef.current = onMouseUp; });

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      }
    };

    // ── RAF loop defined INSIDE useEffect so it captures refs, not props ──
    const animate = (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      if (previousTimeRef.current !== undefined) {
        const deltaTime = (time - previousTimeRef.current) / 1000;
        const cappedDelta = Math.min(deltaTime, 0.1);

        if (onUpdateRef.current) {
          onUpdateRef.current(cappedDelta, canvas.width, canvas.height);
        }

        const ctx = canvas.getContext('2d');
        if (ctx) {
          onDrawRef.current(ctx, canvas.width, canvas.height, time);
        }
      }

      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', handleResize);
    setTimeout(handleResize, 50);

    previousTimeRef.current = undefined;
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [id]); // ← only restarts when simulation changes, NOT on every render

  const getCanvasCoords = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: (touch.clientX - rect.left) * (canvas.width / rect.width),
        y: (touch.clientY - rect.top) * (canvas.height / rect.height),
      };
    }
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      style={{ display: 'block', cursor: onMouseDown ? 'crosshair' : 'default' }}
      onMouseMove={e => {
        const fn = onMouseMoveRef.current;
        if (fn) { const c = getCanvasCoords(e); fn(c.x, c.y); }
      }}
      onMouseDown={e => {
        const fn = onMouseDownRef.current;
        if (fn) { const c = getCanvasCoords(e); fn(c.x, c.y); }
      }}
      onMouseUp={e => {
        const fn = onMouseUpRef.current;
        if (fn) { const c = getCanvasCoords(e); fn(c.x, c.y); }
      }}
      onTouchMove={e => {
        const fn = onMouseMoveRef.current;
        if (fn) { const c = getCanvasCoords(e); fn(c.x, c.y); }
      }}
      onTouchStart={e => {
        const fn = onMouseDownRef.current;
        if (fn) { const c = getCanvasCoords(e); fn(c.x, c.y); }
      }}
      onTouchEnd={e => {
        const fn = onMouseUpRef.current;
        if (fn) { const c = getCanvasCoords(e); fn(c.x, c.y); }
      }}
    />
  );
};

export default SimulationCanvas;