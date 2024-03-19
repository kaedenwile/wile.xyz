import { Entity, GameEngine } from '../gameEngine';
import { Fighter } from './Fighter';
import { Bullet } from './Bullet';
import { pick } from '../util';
import { StandardFighter } from './StandardFighter';
import { SniperFighter } from './SniperFighter';
import { MedicFighter } from './MedicFighter';
import { HeavyFighter } from './HeavyFighter';
import { ShotgunFighter } from './ShotgunFighter';
import { SpawnBlock } from './effects/SpawnBlock';

export type Team = 'red' | 'blue';

export class Battlefield extends GameEngine {
  fighters: Set<Fighter>;

  constructor(width: number, height: number) {
    super(width, height);

    this.fighters = new Set();

    for (let i = 0; i < 10; i++) {
      this.spawnFighter('red');
      this.spawnFighter('blue');
    }
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  spawnFighter(team) {
    const position = {
      x: team === 'red' ? 25 : this.width - 25,
      y: Math.random() * this.height,
    };

    const fighter = new (pick([
      StandardFighter,
      SniperFighter,
      // MeleeFighter,
      HeavyFighter,
      ShotgunFighter,
      MedicFighter,
    ]))(this, team, position.x, position.y);

    for (let i = 0; i < 5; i++) {
      this.entities.add(new SpawnBlock(fighter));
    }

    setTimeout(() => {
      this.fighters.add(fighter);
      this.entities.add(fighter);
    }, 1000 * SpawnBlock.TTL);
  }

  handleContact(entity1: Entity, entity2: Entity) {
    if (entity1 instanceof Fighter && entity2 instanceof Fighter) {
      if (entity1.team === entity2.team) return;
    } else if (entity1 instanceof Fighter && entity2 instanceof Bullet) {
      entity2.didHitFighter(entity1);
    } else if (entity1 instanceof Bullet && entity2 instanceof Fighter) {
      entity1.didHitFighter(entity2);
    }
  }
}
