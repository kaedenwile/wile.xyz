import { Fighter } from './Fighter';
import { Battlefield, Team } from './Battlefield';
import { Bullet } from './Bullet';
import { PaintBlock } from '../../types.ts';

export class HeavyFighter extends Fighter {
  clipSize = 5;
  ammo: number = this.clipSize;

  longCooldown = 2.0;

  constructor(battlefield: Battlefield, team: Team, x: number, y: number) {
    super(battlefield, team, x, y, 0.1);

    this.coolDown += Math.random() * this.longCooldown;
  }

  update(dt: number) {
    super.update(dt);

    this.navigate(dt, this.angleTo(this.getNearestEnemy()));

    if (this.ammo == 0) {
      this.coolDown += this.longCooldown;
      this.ammo = this.clipSize;
    }
  }

  fireWeapon(): Bullet {
    this.ammo--;
    return new HeavyBullet(this.battlefield, this, this.angleToIntercept(this.getNearestEnemy(), HeavyBullet.SPEED));
  }

  draw(): PaintBlock {
    const { x, y } = this;
    return [super.draw(), { x: x - 2, y: y - 2, w: 4, h: 4, c: 'white' }];
  }
}

class HeavyBullet extends Bullet {
  static SPEED = 350;

  constructor(battlefield: Battlefield, fighter: Fighter, angle: number) {
    super(battlefield, fighter, angle, 1.0, HeavyBullet.SPEED, 0.1);
  }
}
