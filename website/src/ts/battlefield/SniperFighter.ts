import {Fighter} from "./Fighter";
import {Battlefield, Team} from "./Battlefield";
import {Bullet} from "./Bullet";
import {Entity} from "../gameEngine";

export class SniperFighter extends Fighter {

    constructor(battlefield: Battlefield, team: Team, x: number, y: number) {
        super(battlefield, team, x, y, 5.0 + Math.random());

        this.maxSpeed = 5.0;
    }

    update(dt: number) {
        super.update(dt);
        this.navigate(dt, -this.angleTo(this.getNearestEnemy()));
    }

    fireWeapon(): Bullet {
        return new SniperBullet(this.battlefield, this, this.angleToIntercept(this.getNearestEnemy(), SniperBullet.SPEED));
    }

    draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx);

        let {x, y} = this;
        ctx.fillStyle = '#aaff77';
        ctx.fillRect(x - 2, y - 2, 4, 4);
    }

}

class SniperBullet extends Bullet {

    static SPEED = 650;

    constructor(battlefield: Battlefield, fighter: Fighter, angle: number) {
        super(battlefield, fighter, angle, 2.5, SniperBullet.SPEED, 0.5);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = '#aaff77';
        Entity.prototype.draw.call(this, ctx);
    }

}