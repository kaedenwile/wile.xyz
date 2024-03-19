import { Fighter } from './Fighter';
import { Battlefield, Team } from './Battlefield';
import { Bullet } from './Bullet';
import { PaintBlock } from '../../types.ts';

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
    return new HeavyBullet(this.battlefield, this, this.angleToIntercept(this.getNearestEnemy(), HeavyBullet.SPEED));
  }

  draw(): PaintBlock {
    const { x, y } = this;
    return [super.draw(), { x: x - 2, y: y - 2, w: 4, h: 4, c: '#ffaaff' }];
  }
}

class HeavyBullet extends Bullet {
  static SPEED = 350;

  constructor(battlefield: Battlefield, fighter: Fighter, angle: number) {
    super(battlefield, fighter, angle, 1.0, HeavyBullet.SPEED, 0.1);
  }
}
