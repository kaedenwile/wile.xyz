import {Entity} from "../gameEngine";
import {Fighter} from "./Fighter";
import {Battlefield, Team} from "./Battlefield";

export class Bullet extends Entity {

    static SPEED: number = 500

    battlefield: Battlefield
    team: Team;
    damage: number;

    constructor(battlefield: Battlefield, {team, x, y, w, h, px, py}: Fighter, angle: number, damage: number,
                speed: number = Bullet.SPEED, mass: number = 0.2) {
        super(x + w * Math.cos(angle), y + h * Math.sin(angle), 4, 4, mass);
        this.bitmask = team === 'red' ? Fighter.BLUE_BITMASK : Fighter.RED_BITMASK;

        this.battlefield = battlefield;
        this.team = team;
        this.damage = damage;

        this.px = speed * mass * Math.cos(angle);
        this.py = speed * mass * Math.sin(angle);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'white';
        super.draw(ctx);
    }

    didHitWall() {
        super.didHitWall();
        this.battlefield.entities.delete(this);
    }

    didHitFighter(fighter: Fighter) {
        if (fighter.team !== this.team) {
            fighter.takeDamage(this.damage);
            this.battlefield.entities.delete(this);
        }
    }

}
