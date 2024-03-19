import { Fighter } from './Fighter';
import { Battlefield, Team } from './Battlefield';
import { Bullet } from './Bullet';
import { PaintBlock } from '../../types.ts';

export class MedicFighter extends Fighter {
  constructor(battlefield: Battlefield, team: Team, x: number, y: number) {
    super(battlefield, team, x, y, 2.0);
    this.acceleration = 100;
  }

  update(dt: number) {
    super.update(dt);

    const target = this.getNearestInjuredFriendly();
    this.navigate(dt, target ? this.angleTo(target) : Math.PI);
  }

  fireWeapon(): Bullet | null {
    const target = this.getNearestInjuredFriendly();

    if (target && this.distanceTo(target) < 100) {
      return new MedPack(this.battlefield, this, this.angleToIntercept(target, MedPack.SPEED));
    } else {
      this.coolDown += 0.1;
      return null;
    }
  }

  draw(): PaintBlock[] {
    const { x, y, w, h } = this;
    const { left, top } = this.bounds();

    return [super.draw(), { x: x - 1, y: top, w: 2, h, c: 'white' }, { x: left, y: y - 1, w, h: 2, c: 'white' }];
  }

  getNearestInjuredFriendly() {
    return this.getNearest((fighter) => fighter !== this && fighter.team === this.team && fighter.health < 5.0);
  }
}

class MedPack extends Bullet {
  static SPEED = 250;

  constructor(battlefield: Battlefield, fighter: Fighter, angle: number) {
    super(battlefield, fighter, angle, 0, MedPack.SPEED, 0.01);
    this.w = this.h = 8;
    this.bitmask = this.team === 'red' ? Fighter.RED_BITMASK : Fighter.BLUE_BITMASK;
  }

  draw(): PaintBlock[] {
    const { x, y, w, h } = this;
    const { left, top } = this.bounds();

    return [
      { x: x - 1, y: top, w: 2, h, c: 'white' },
      { x: left, y: y - 1, w, h: 2, c: 'white' },
    ];
  }

  didHitFighter(fighter: Fighter) {
    if (fighter.team === this.team) {
      fighter.health = fighter.maxHealth;
      this.battlefield.entities.delete(this);
    }
  }
}
