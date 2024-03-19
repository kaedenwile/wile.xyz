import { InitMessage, ResizeMessage } from '../types.ts';
import { Battlefield } from './battlefield';

export const gameEngine = () => {
  let game: Battlefield;

  const handlers = {
    init: ({ width, height }: InitMessage) => {
      game = new Battlefield(width, height);
      game.gameLoop();
      console.log(`Initializing Battleground with ${width}x${height}`);
    },
    resize: ({ width, height }: ResizeMessage) => {
      game.resize(width, height);
      console.log(`Resizing Battleground to ${width}x${height}`);
    },
  };

  self.addEventListener('message', (event: MessageEvent) => {
    const { data } = event;
    console.log(event);

    handlers[data.type as keyof typeof handlers]?.(data);
  });
};
