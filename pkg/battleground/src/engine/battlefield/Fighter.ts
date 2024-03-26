import { Entity } from '../gameEngine';
import { Battlefield, Team } from './Battlefield';
import { Bullet } from './Bullet';
import { DeathBlock } from './effects/DeathBlock';
import { PaintBlock } from '../../types.ts';

export class Fighter extends Entity {
  static FIGHTER_BITMASK = 0b0001;
  static RED_BITMASK = 0b0010;
  static BLUE_BITMASK = 0b0100;

  battlefield: Battlefield;
  team: Team;

  maxSpeed = 100.0;
  acceleration = 10.0;

  maxCoolDown = -1;
  coolDown = -1;

  maxHealth = 5.0;
  health = 5.0;
  isDead = false;

  constructor(battlefield: Battlefield, team: Team, x: number, y: number, coolDown: number) {
    super(x, y, 10, 10, 1);

    this.battlefield = battlefield;
    this.team = team;

    this.maxCoolDown = coolDown;
    this.coolDown = Math.max(coolDown, 2) * Math.random();

    this.bitmask = Fighter.FIGHTER_BITMASK | (team === 'red' ? Fighter.RED_BITMASK : Fighter.BLUE_BITMASK);
    this.px = (Math.random() - 0.5) * 100;
    this.py = (Math.random() - 0.5) * 100;
  }

  draw(): PaintBlock {
    return {
      ...super.draw(),
      c: this.team,
    };
  }

  update(dt: number) {
    super.update(dt);

    this.coolDown -= dt;
    if (this.maxCoolDown > 0 && this.coolDown <= 0) {
      const bullet = this.fireWeapon();
      if (bullet) {
        this.battlefield.entities.add(bullet);
        this.coolDown = this.maxCoolDown;
      }
    }
  }

  navigate(dt: number, angle: number) {
    const { acceleration, maxSpeed } = this;
    const { vx, vy } = this.velocity();

    this.px += acceleration * dt * Math.cos(angle);
    this.py += acceleration * dt * Math.sin(angle);

    if (vx ** 2 + vy ** 2 > maxSpeed ** 2) {
      angle = Math.atan2(vy, vx);

      this.px = maxSpeed * Math.cos(angle);
      this.py = maxSpeed * Math.sin(angle);
    }
  }

  fireWeapon(): Bullet | null {
    return null;
  }

  takeDamage(damage: number) {
    if (this.isDead) return;

    this.health -= damage;
    if (this.health <= 0) {
      this.isDead = true;
      this.battlefield.entities.delete(this);
      this.battlefield.fighters.delete(this);
      this.battlefield.spawnFighter(this.team);

      for (let i = 0; i < 5; i++) {
        this.battlefield.entities.add(new DeathBlock(this));
      }
    }
  }

  getNearest(where: (f: Fighter) => boolean): Fighter | null {
    const fighters = [...this.battlefield.fighters].filter(where);

    if (!fighters.length) {
      return null;
    }

    return fighters
      .map((fighter) => ({ fighter, distanceSquared: this.distanceTo(fighter) }))
      .sort((a, b) => a.distanceSquared - b.distanceSquared)[0].fighter;
  }

  getNearestEnemy(): Fighter | null {
    return this.getNearest((fighter) => fighter.team !== this.team);
  }

  angleToIntercept(target: Fighter, speed: number): number {
    // calculate angle to intersect target at their current velocity

    const { x: x1, y: y1 } = this;
    const { x: x2, y: y2 } = target;

    const dx = x2 - x1;
    const dy = y2 - y1;

    const { vx: vx2, vy: vy2 } = target.velocity();
    const v1 = speed;
    const v2 = Math.sqrt(vx2 ** 2 + vy2 ** 2);
    const a2 = Math.atan2(vy2, vx2);

    const alpha = Math.atan2(-dx, dy);
    const l = Math.sqrt(dx ** 2 + dy ** 2);

    return alpha + Math.acos(((v2 / v1) * (dy * Math.cos(a2) - dx * Math.sin(a2))) / l);
  }
}
