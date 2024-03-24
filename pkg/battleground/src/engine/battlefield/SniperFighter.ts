import { Fighter } from './Fighter';
import { Battlefield, Team } from './Battlefield';
import { Bullet } from './Bullet';
import { PaintBlock } from '../../types.ts';

export class SniperFighter extends Fighter {
  constructor(battlefield: Battlefield, team: Team, x: number, y: number) {
    super(battlefield, team, x, y, 5.0 + Math.random());

    this.maxSpeed = 100.0;
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
    return [
      super.draw(),
      { x: x - 3, y: y - 3, w: 2, h: 6, c: 'white' },
      { x: x + 1, y: y - 3, w: 2, h: 6, c: 'white' },
    ];
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
