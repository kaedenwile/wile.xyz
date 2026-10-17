import { CanvasHTMLAttributes, useEffect, useRef, useState } from 'react';
import { gameEngineCode } from './engine';
import type { Scene } from './droneSimulation';
import { paintScene } from './paintScene';
export type BattlegroundProps = CanvasHTMLAttributes<HTMLCanvasElement>;
export const Battleground = (props: BattlegroundProps) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const pausedRef = useRef(false);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const context = element.getContext('2d');
    if (!context) return;
    const url = URL.createObjectURL(new Blob([gameEngineCode], { type: 'application/javascript' }));
    const worker = new Worker(url);
    workerRef.current = worker;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduce = media.matches;
    setReduced(reduce);
    let ratio = 1;
    let latest: Scene | undefined;
    let frame = 0;
    const draw = () => {
      frame = 0;
      if (latest) paintScene(context, latest, ratio);
    };
    worker.onmessage = ({ data }) => {
      if (data.type === 'paint') {
        latest = data.scene;
        if (!frame) frame = requestAnimationFrame(draw);
      }
    };
    const isPaused = () => pausedRef.current || reduce || document.hidden;
    const resize = (init = false) => {
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = init
        ? { width: window.innerWidth, height: window.innerHeight }
        : element.getBoundingClientRect();
      element.width = Math.round(width * ratio);
      element.height = Math.round(height * ratio);
      worker.postMessage({ type: init ? 'init' : 'resize', width, height, paused: isPaused() });
    };
    const visibility = () => worker.postMessage({ type: 'pause', paused: isPaused() });
    const preference = () => {
      reduce = media.matches;
      setReduced(reduce);
      visibility();
    };
    let pointerFrame = 0;
    let point: { x: number; y: number } | null = null;
    const sendPointer = () => {
      pointerFrame = 0;
      worker.postMessage({ type: 'pointer', point });
    };
    const pointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || isPaused()) return;
      const bounds = element.getBoundingClientRect();
      point = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
      if (!pointerFrame) pointerFrame = requestAnimationFrame(sendPointer);
    };
    const leave = () => {
      point = null;
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      sendPointer();
    };
    const onResize = () => resize();
    resize(true);
    const observer = new ResizeObserver(() => resize());
    observer.observe(element);
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', pointer, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    window.addEventListener('blur', leave);
    document.addEventListener('visibilitychange', visibility);
    media.addEventListener('change', preference);
    return () => {
      observer.disconnect();
      worker.terminate();
      URL.revokeObjectURL(url);
      workerRef.current = null;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pointerFrame);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', pointer);
      document.documentElement.removeEventListener('pointerleave', leave);
      window.removeEventListener('blur', leave);
      document.removeEventListener('visibilitychange', visibility);
      media.removeEventListener('change', preference);
    };
  }, []);
  const toggle = () => {
    const next = !paused;
    pausedRef.current = next;
    setPaused(next);
    workerRef.current?.postMessage({ type: 'pause', paused: next || reduced || document.hidden });
  };
  return (
    <>
      <canvas {...props} ref={canvas} aria-hidden="true" />
      <button
        className="simulation-toggle"
        type="button"
        onClick={toggle}
        aria-pressed={paused || reduced}
        disabled={reduced}
        aria-label={
          reduced
            ? 'Animation paused for reduced motion'
            : paused
              ? 'Resume background simulation'
              : 'Pause background simulation'
        }
      >
        <span aria-hidden="true">{paused || reduced ? '▶' : 'Ⅱ'}</span>{' '}
        {reduced ? 'Motion reduced' : paused ? 'Resume simulation' : 'Pause simulation'}
      </button>
    </>
  );
};
