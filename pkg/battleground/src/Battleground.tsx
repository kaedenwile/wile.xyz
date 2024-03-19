import { CanvasHTMLAttributes, useEffect, useRef, useState } from 'react';
import { useWorker } from './useWorker.ts';
import { gameEngine } from './engine';
import { PaintBlock, PaintMessage } from './types.ts';

export type BattlegroundProps = CanvasHTMLAttributes<HTMLCanvasElement>;

export const Battleground = ({ width = 500, height = 500, ...props }: BattlegroundProps) => {
  const worker = useWorker(gameEngine, { paint });

  const [size, setSize] = useState({ width, height });
  const [didInit, setDidInit] = useState(false);
  const [hasCanvas, setHasCanvas] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>();

  useEffect(() => {
    if (!worker || !hasCanvas || didInit) return;

    const updateSize = (type: 'init' | 'resize') => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setSize({ width, height });
      worker.postMessage({ type, width, height });
    };

    updateSize('init');
    window.onresize = () => updateSize('resize');

    setDidInit(true);
  }, [worker, hasCanvas, didInit]);

  function paint({ blocks }: PaintMessage) {
    if (!canvasRef.current) return;

    const drawingContext = canvasRef.current.getContext('2d')!;

    function drawBlock(block: PaintBlock) {
      if (Array.isArray(block)) {
        block.forEach(drawBlock);
      } else {
        drawingContext.fillStyle = block.c;
        drawingContext.fillRect(block.x, block.y, block.w, block.h);
      }
    }

    drawBlock(blocks);
  }

  return (
    <canvas
      ref={(canvas) => {
        canvasRef.current = canvas;
        setHasCanvas(true);
      }}
      {...props}
      width={size.width}
      height={size.height}
    />
  );
};
