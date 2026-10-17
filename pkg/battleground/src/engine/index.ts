import { DroneSimulation } from '../droneSimulation';
export declare const gameEngineCode: string;
export const gameEngine = () => {
  let game: DroneSimulation | undefined;
  let timer: ReturnType<typeof setInterval> | undefined;
  const paint = () => {
    if (game) self.postMessage({ type: 'paint', scene: game.scene });
  };
  const stop = () => {
    clearInterval(timer);
    timer = undefined;
  };
  const start = () => {
    if (timer !== undefined) return;
    timer = setInterval(() => {
      game?.update(1 / 30);
      paint();
    }, 1000 / 30);
  };
  self.addEventListener('message', ({ data }) => {
    switch (data.type) {
      case 'init':
        stop();
        game = new DroneSimulation(data.width, data.height);
        paint();
        if (!data.paused) start();
        break;
      case 'resize':
        game?.resize(data.width, data.height);
        paint();
        break;
      case 'pointer':
        if (game) game.scene.pointer = data.point;
        break;
      case 'pause':
        if (data.paused) {
          stop();
          paint();
        } else start();
        break;
    }
  });
};
