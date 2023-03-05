import { Battlefield } from './Battlefield';

export function playGame() {
    const battlefield = new Battlefield();
    battlefield.gameLoop();
}
