import {Battlefield} from "./Battlefield";

export function playGame() {
    console.log("PLAYING GAME");
    let battlefield = new Battlefield();
    battlefield.gameLoop();
}