import React, { useEffect, useRef } from 'react';

interface SimulationCanvasProps {
  id: string;
  onDraw: (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => void;
  onUpdate?: (deltaTime: number, width: number, height: number) => void;
}

const SimulationCanvas: React.FC<SimulationCanvasProps> = ({ id, onDraw, onUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(undefined);
  const previousTimeRef = useRef<number>(undefined);

  const animate = (time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (previousTimeRef.current !== undefined) {
      const deltaTime = (time - previousTimeRef.current) / 1000;
      
      // Fixed time step capping to prevent huge jumps
      const cappedDelta = Math.min(deltaTime, 0.1);

      if (onUpdate) {
        onUpdate(cappedDelta, canvas.width, canvas.height);
      }
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        onDraw(ctx, canvas.width, canvas.height, time);
      }
    }
    
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas && canvas.parentElement) {
        // Use offsetWidth/Height for accurate physical size
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    // Initial resize
    setTimeout(handleResize, 100); // Small delay to ensure parent is rendered

    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [id]); // Re-run when switching simulations

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      style={{ display: 'block' }}
    />
  );
};

export default SimulationCanvas;
