import { Fighter } from './Fighter';
import { Battlefield, Team } from './Battlefield';
import { Bullet } from './Bullet';

export class HeavyFighter extends Fighter {
    clipSize = 3;
    ammo: number = this.clipSize;

    constructor(battlefield: Battlefield, team: Team, x: number, y: number) {
        super(battlefield, team, x, y, 0.2);
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
        this.ammo--;
        return new HeavyBullet(
            this.battlefield,
            this,
            this.angleToIntercept(this.getNearestEnemy(), HeavyBullet.SPEED)
        );
    }

    draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx);

        const { x, y } = this;
        ctx.fillStyle = '#ffaaff';
        ctx.fillRect(x - 2, y - 2, 4, 4);
    }
}

class HeavyBullet extends Bullet {
    static SPEED = 350;

    constructor(battlefield: Battlefield, fighter: Fighter, angle: number) {
        super(battlefield, fighter, angle, 1.0, HeavyBullet.SPEED, 0.1);
    }
}
