import { Fighter } from './Fighter';
import { Battlefield, Team } from './Battlefield';
import { Bullet } from './Bullet';
import { Entity } from '../gameEngine';
import { lerpColor } from '../util';

export class ShotgunFighter extends Fighter {
    clipSize = 8;
    ammo: number = this.clipSize;

    constructor(battlefield: Battlefield, team: Team, x: number, y: number) {
        super(battlefield, team, x, y, 0.001);
    }

    update(dt: number) {
        super.update(dt);

        this.navigate(dt, this.angleTo(this.getNearestEnemy()));

        if (this.ammo == 0) {
            this.coolDown += 2.0;
            this.ammo = this.clipSize;
        }
    }

    fireWeapon(): Bullet {
        this.ammo -= 1;
        return new ShotgunBullet(this.battlefield, this, this.angleToIntercept(this.getNearestEnemy(), Bullet.SPEED));
    }

    draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx);

        const { x, y } = this;
        ctx.fillStyle = '#eeee00';
        ctx.fillRect(x - 2, y - 2, 4, 4);
    }
}

class ShotgunBullet extends Bullet {
    static SPEED = 400;
    static SPEED_VARIATION = 50;
    static ANGLE_VARIATION = 0.05;
    static MAX_AGE = 2.0;

    age = 0;

    constructor(battlefield: Battlefield, fighter: Fighter, angle: number) {
        super(
            battlefield,
            fighter,
            angle + (Math.random() * (2 * ShotgunBullet.ANGLE_VARIATION) - ShotgunBullet.ANGLE_VARIATION),
            0.8,
            ShotgunBullet.SPEED + (Math.random() * (2 * ShotgunBullet.SPEED_VARIATION) - ShotgunBullet.SPEED_VARIATION),
            0.01
        );
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = lerpColor('#77e4ff', '#000000', Math.max(0, Math.min(1.0, this.age / 0.75 - 1.25)));
        Entity.prototype.draw.call(this, ctx);
    }

    update(dt: number): void {
        this.age += dt;

        if (this.age > ShotgunBullet.MAX_AGE) {
            this.battlefield.entities.delete(this);
        }
    }
}
