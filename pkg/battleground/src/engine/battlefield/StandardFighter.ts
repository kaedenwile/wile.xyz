import { Fighter } from './Fighter';
import { Battlefield, Team } from './Battlefield';
import { Bullet } from './Bullet';

export class StandardFighter extends Fighter {
    constructor(battlefield: Battlefield, team: Team, x: number, y: number) {
        super(battlefield, team, x, y, 2.0 + Math.random());
    }

    update(dt: number) {
        super.update(dt);

        this.navigate(dt, -this.angleTo(this.getNearestEnemy()));
    }

    fireWeapon(): Bullet {
        return new Bullet(this.battlefield, this, this.angleToIntercept(this.getNearestEnemy(), Bullet.SPEED), 1.0);
    }
}
