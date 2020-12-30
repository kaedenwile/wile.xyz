import {Fighter} from "./Fighter";
import {Battlefield, Team} from "./Battlefield";
import {Bullet} from "./Bullet";

export class MedicFighter extends Fighter {

    constructor(battlefield: Battlefield, team: Team, x: number, y: number) {
        super(battlefield, team, x, y, 2.0);
        this.acceleration = 100;
    }

    update(dt: number) {
        super.update(dt);

        let target = this.getNearestInjuredFriendly();
        this.navigate(dt, target ? this.angleTo(target) : Math.PI);
    }

    fireWeapon(): Bullet {
        let target = this.getNearestInjuredFriendly();

        if (target && this.distanceTo(target) < 100) {
            return new MedPack(this.battlefield, this, this.angleTo(target));
        } else {
            this.coolDown += 0.1;
            return null;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx);

        let {x, y, w, h} = this;
        let {left, top} = this.bounds();

        ctx.fillStyle = 'white';
        ctx.fillRect(x - 1, top, 2, h);
        ctx.fillRect(left, y - 1, w, 2);
    }

    getNearestInjuredFriendly() {
        return this.getNearest(
            fighter => fighter !== this && fighter.team === this.team && fighter.health < 5.0
        )
    }

}

class MedPack extends Bullet {

    static SPEED = 250;

    constructor(battlefield: Battlefield, fighter: Fighter, angle: number) {
        super(battlefield, fighter, angle, 0, MedPack.SPEED, 0.01);
        this.w = this.h = 8;
        this.bitmask = this.team === 'red' ? Fighter.RED_BITMASK : Fighter.BLUE_BITMASK;
    }

    draw(ctx: CanvasRenderingContext2D) {
        let {x, y, w, h} = this;
        let {left, top} = this.bounds();

        ctx.fillStyle = 'white';
        ctx.fillRect(x-1, top, 2, h);
        ctx.fillRect(left, y-1, w, 2);
    }

    didHitFighter(fighter: Fighter) {
        if (fighter.team === this.team) {
            fighter.health = fighter.maxHealth;
            this.battlefield.entities.delete(this);
        }
    }

}