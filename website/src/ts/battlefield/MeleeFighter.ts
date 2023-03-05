import { Fighter } from './Fighter';
import { Battlefield, Team } from './Battlefield';

export class MeleeFighter extends Fighter {
    constructor(battlefield: Battlefield, team: Team, x: number, y: number) {
        super(battlefield, team, x, y, -1);

        this.acceleration = 250;
        this.maxSpeed = 500;
    }

    update(dt: number) {
        super.update(dt);

        const { vx, vy } = this.velocity();
        const speed = Math.sqrt(vx ** 2 + vy ** 2);

        this.navigate(dt, this.angleToIntercept(this.getNearestEnemy(), speed));
    }

    draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx);

        const { w, h } = this;
        const { left, top } = this.bounds();
        ctx.strokeStyle = 'yellow';
        ctx.strokeRect(left, top, w, h);
    }
}
