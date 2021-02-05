import {Battlefield} from "./Battlefield";

export function playGame() {
    let battlefield = new Battlefield();
    battlefield.gameLoop();
}