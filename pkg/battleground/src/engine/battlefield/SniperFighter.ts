import { Fighter } from './Fighter';
import { Battlefield, Team } from './Battlefield';
import { Bullet } from './Bullet';
import { PaintBlock } from '../../types.ts';

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

  draw(): PaintBlock {
    const { x, y } = this;
    return [super.draw(), { x: x - 2, y: y - 2, w: 4, h: 4, c: '#aaff77' }];
  }
}

class SniperBullet extends Bullet {
  static SPEED = 650;

  constructor(battlefield: Battlefield, fighter: Fighter, angle: number) {
    super(battlefield, fighter, angle, 5, SniperBullet.SPEED, 0.5);
  }

  draw(): PaintBlock {
    return {
      ...super.draw(),
      c: '#aaff77',
    };
  }
}
