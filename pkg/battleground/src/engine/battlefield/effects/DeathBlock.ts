import { Battlefield, Team } from '../Battlefield';
import { Entity } from '../../gameEngine';
import { Fighter } from '../Fighter';
import { PaintBlock } from '../../../types.ts';

export class DeathBlock extends Entity {
  static TTL = 0.5;

  battlefield: Battlefield;
  team: Team;
  ttl: number;

  constructor(fighter: Fighter) {
    super(fighter.x, fighter.y, 5, 5, 1);

    this.battlefield = fighter.battlefield;
    this.team = fighter.team;
    this.ttl = DeathBlock.TTL;

    this.bitmask = 0;
    this.px = fighter.px + (Math.random() - 0.5) * 200;
    this.py = fighter.py + (Math.random() - 0.5) * 200;
  }

  draw(): PaintBlock {
    const r = this.team === 'red' ? 255 : 0.0;
    const g = 0;
    const b = this.team === 'blue' ? 255 : 0.0;
    const a = this.ttl / DeathBlock.TTL;

    return {
      ...super.draw(),
      c: `rgba(${r}, ${g}, ${b}, ${a})`,
    };
  }

  update(dt: number) {
    super.update(dt);

    this.ttl -= dt;
    if (this.ttl < 0) {
      this.battlefield.entities.delete(this);
    }
  }
}
