import {Entity} from '../gameEngine';
import {Battlefield, Team} from './Battlefield';
import {Bullet} from "./Bullet";

export class Fighter extends Entity {

    static FIGHTER_BITMASK = 0b0001;
    static RED_BITMASK  = 0b0010;
    static BLUE_BITMASK = 0b0100;

    battlefield: Battlefield
    team: Team

    maxSpeed: number = 100.0
    acceleration: number = 10.0

    maxCoolDown: number = -1;
    coolDown: number = -1;

    maxHealth: number = 5.0;
    health: number = 5.0;

    constructor(battlefield: Battlefield, team: Team, x: number, y: number, coolDown: number) {
        super(x, y, 10, 10, 1);

        this.battlefield = battlefield;
        this.team = team;

        this.maxCoolDown = coolDown;
        this.coolDown = Math.random() * coolDown;

        this.bitmask = Fighter.FIGHTER_BITMASK | (team === 'red' ? Fighter.RED_BITMASK : Fighter.BLUE_BITMASK);
        this.px = (Math.random() - 0.5) * 100;
        this.py = (Math.random() - 0.5) * 100;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.team;
        super.draw(ctx);
    }

    update(dt: number) {
        super.update(dt);

        this.coolDown -= dt;
        if (this.maxCoolDown > 0 && this.coolDown <= 0) {
            let bullet = this.fireWeapon();
            if (bullet) {
                this.battlefield.entities.add(bullet);
                this.coolDown = this.maxCoolDown;
            }
        }
    }

    navigate(dt: number, angle: number) {
        let {acceleration, maxSpeed} = this;
        let {vx, vy} = this.velocity();

        if (vx**2 + vy**2 > maxSpeed**2) {
            angle = -Math.atan2(vx, vy);
        }

        this.px += acceleration * dt * Math.cos(angle);
        this.py += acceleration * dt * Math.sin(angle);
    }

    fireWeapon() : Bullet {
        return null;
    }

    takeDamage(damage: number) {
        this.health -= damage;
        if (this.health <= 0) {
            this.battlefield.entities.delete(this);
            this.battlefield.fighters.delete(this);
            this.battlefield.spawnFighter(this.team);
        }
    }

    getNearest(where: (Fighter)=>Boolean): Fighter {
        let fighters = [...this.battlefield.fighters].filter(where)

        if (!fighters.length) {
            return null;
        }

        return fighters.map(fighter => ({fighter, distanceSquared: this.distanceTo(fighter)}))
            .sort((a, b) => a.distanceSquared - b.distanceSquared)[0].fighter;
    }

    getNearestEnemy(): Fighter {
        return this.getNearest(fighter => fighter.team !== this.team);
    }

}