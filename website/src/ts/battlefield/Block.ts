import { Entity } from '../gameEngine';

export class Block extends Entity {
    static SIZE = 50;

    row: number;
    column: number;

    constructor(row: number, column: number) {
        super(row * Block.SIZE, column * Block.SIZE, Block.SIZE, Block.SIZE, 1);

        this.row = row;
        this.column = column;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'white';
        super.draw(ctx);
    }
}
