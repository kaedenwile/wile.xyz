import { Entity, GameEngine } from '../gameEngine';
import { Fighter } from './Fighter';
import { Bullet } from './Bullet';
import { MeleeFighter } from './MeleeFighter';
import { pick } from '../util';
import { StandardFighter } from './StandardFighter';
import { SniperFighter } from './SniperFighter';
import { MedicFighter } from './MedicFighter';
import { HeavyFighter } from './HeavyFighter';
import { ShotgunFighter } from './ShotgunFighter';

export type Team = 'red' | 'blue';

export class Battlefield extends GameEngine {
    fighters: Set<Fighter>;

    constructor() {
        super(document.getElementById('battlefield') as HTMLCanvasElement);
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        window.onresize = () => {
            this.canvas.width = document.documentElement.clientWidth;
            this.canvas.height = document.documentElement.clientHeight;
        };

        this.fighters = new Set();
        this.entities = new Set();

        for (let i = 0; i < 10; i++) {
            this.spawnFighter('red');
            this.spawnFighter('blue');
        }
    }

    spawnFighter(team) {
        const position = {
            x: team === 'red' ? 25 : this.canvas.width - 25,
            y: Math.random() * this.canvas.height,
        };

        const fighter = new (pick([
            StandardFighter,
            SniperFighter,
            // MeleeFighter,
            HeavyFighter,
            ShotgunFighter,
            MedicFighter,
        ]))(this, team, position.x, position.y);

        this.fighters.add(fighter);
        this.entities.add(fighter);
    }

    handleContact(entity1: Entity, entity2: Entity) {
        if (entity1 instanceof Fighter && entity2 instanceof Fighter) {
            if (entity1.team === entity2.team) return;

            if (entity1 instanceof MeleeFighter) {
                entity2.takeDamage(2.5);
            }

            if (entity2 instanceof MeleeFighter) {
                entity1.takeDamage(2.5);
            }
        } else if (entity1 instanceof Fighter && entity2 instanceof Bullet) {
            entity2.didHitFighter(entity1);
        } else if (entity1 instanceof Bullet && entity2 instanceof Fighter) {
            entity1.didHitFighter(entity2);
        }
    }
}
