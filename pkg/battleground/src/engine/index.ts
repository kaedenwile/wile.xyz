import { InitMessage, ResizeMessage } from '../types.ts';
import { Battlefield } from './battlefield';

export declare const gameEngineCode: string; // populated by esbuild

export const gameEngine = () => {
  let game: Battlefield;

  const handlers = {
    init: ({ width, height }: InitMessage) => {
      game = new Battlefield(width, height);
      game.gameLoop();
    },
    resize: ({ width, height }: ResizeMessage) => {
      game.resize(width, height);
    },
  };

  self.addEventListener('message', (event: MessageEvent) => {
    const { data } = event;

    handlers[data.type as keyof typeof handlers]?.(data);
  });
};
