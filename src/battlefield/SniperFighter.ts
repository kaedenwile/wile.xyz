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
        let target = this.getNearestEnemy();

        // calculate angle to intersect target at their
        // current velocity

        let {x: x1, y: y1} = this;
        let {x: x2, y: y2} = target;

        let dx = x2 - x1;
        let dy = y2 - y1;

        let {vx: vx2, vy: vy2} = target.velocity();
        let v1 = SniperBullet.SPEED;
        let v2 = Math.sqrt(vx2**2 + vy2**2);
        let a2 = Math.atan2(vy2, vx2);

        let alpha = Math.atan2(-dx, dy);
        let l = Math.sqrt(dx**2 + dy**2);

        let angle = alpha + Math.acos(v2 / v1 * (dy * Math.cos(a2) - dx * Math.sin(a2)) / l)

        return new SniperBullet(this.battlefield, this, angle);
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