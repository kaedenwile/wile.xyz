import { Battlefield, Team } from '../Battlefield';
import { Entity } from '../../gameEngine';
import { Fighter } from '../Fighter';
import { PaintBlock } from '../../../types.ts';

export class SpawnBlock extends Entity {
  static TTL = 0.5;

  battlefield: Battlefield;
  team: Team;
  ttl: number;

  constructor(fighter: Fighter) {
    const px = (Math.random() - 0.5) * 100;
    const py = (Math.random() - 0.5) * 100;

    const x = fighter.x - SpawnBlock.TTL * px;
    const y = fighter.y - SpawnBlock.TTL * py;

    super(x, y, 8, 8, 1);

    this.battlefield = fighter.battlefield;
    this.team = fighter.team;
    this.ttl = SpawnBlock.TTL;

    this.bitmask = 0;
    this.px = px;
    this.py = py;
  }

  draw(): PaintBlock {
    const r = this.team === 'red' ? 255 : 0.0;
    const g = 0;
    const b = this.team === 'blue' ? 255 : 0.0;
    const a = this.ttl / SpawnBlock.TTL;

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
