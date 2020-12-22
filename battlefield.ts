import {Entity, GameEngine} from './gameEngine.js';

type Weapon = "standard" | "melee" | "sniper" | "heavy";
type Mentality = "berserk" | "aggressive" | "conservative";

function pick<T>(arr: Array<T>): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

class Fighter extends Entity {

    battlefield: Battlefield
    team: string
    weapon: Weapon
    mentality: Mentality

    cooldown: number;
    health: number = 5.0;

    constructor(battlefield: Battlefield, team: string, x: number, y: number) {
        super(x, y, 10, 10, 1);
        this.battlefield = battlefield;

        this.team = team;

        this.weapon = pick(["standard", "melee", "sniper", "heavy"] as Array<Weapon>);
        this.mentality = this.weapon === 'melee' ? "berserk" : pick(["aggressive", "conservative"] as Array<Mentality>);
        // this.mentality = pick(["aggressive", "conservative"] as Array<Mentality>);

        console.log(`Created fighter ${team} ${this.weapon} ${this.mentality}`)

        this.px = (Math.random() - 0.5) * 100;
        this.py = (Math.random() - 0.5) * 100;

        this.cooldown = this.getCooldown();
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.team;
        super.draw(ctx);

        if (this.weapon === 'melee') {
            ctx.strokeStyle = 'yellow';
            let {left: x, top: y} = this.bounds();
            ctx.strokeRect(x, y, this.w, this.h);
        }
    }

    update(dt: number) {
        super.update(dt);

        let {x, y} = this;
        let {x: x2, y: y2} = [...this.battlefield.fighters]
            .filter(fighter => fighter.team !== this.team)
            .map(fighter => ({
                fighter,
                distanceSquared: (x - fighter.x)**2 + (y - fighter.y)**2
            }))
            .sort((a, b) => a.distanceSquared - b.distanceSquared)[0].fighter;

        let angle = Math.atan2(y2 - y, x2 - x);
        let speed = this.mentality === 'berserk' ? 100 : 10;

        if (this.mentality === 'aggressive' || this.mentality === 'berserk') {
            // seek
            this.px += speed * dt * Math.cos(angle);
            this.py += speed * dt * Math.sin(angle);
        } else {
            // avoid
            this.px -= speed * dt * Math.cos(angle);
            this.py -= speed * dt * Math.sin(angle);
        }

        this.cooldown -= dt;
        if (this.weapon !== 'melee' && this.cooldown <= 0) {
            let bullet = new Bullet(this.battlefield, this, angle, this.getDamage());
            this.battlefield.entities.add(bullet);

            this.cooldown = this.getCooldown();
        }
    }

    takeDamage(damage: number) {
        this.health -= damage;
        if (this.health <= 0) {
            this.battlefield.entities.delete(this);
            this.battlefield.fighters.delete(this);
            this.battlefield.spawnFighter(this.team);
        }
    }

    getCooldown() {
        switch (this.weapon) {
            case "heavy":
                return 0.5 + Math.random() * 0.25;
            case "melee":
                return -1;
            case "sniper":
                return 5.0 + Math.random() * 2;
            case "standard":
                return 2.0 + Math.random();
        }
    }

    getDamage() {
        switch (this.weapon) {
            case "heavy":
                return 0.25;
            case "melee":
                return 2.5;
            case "sniper":
                return 5;
            case "standard":
                return 1;
        }
    }
}

class Bullet extends Entity {

    battlefield: Battlefield
    damage: number;

    constructor(battlefield: Battlefield, fighter: Fighter, angle: number, damage: number) {
        let {team, x, y, w, h} = fighter;
        super(x + w * Math.cos(angle), y + h * Math.sin(angle), 4, 4, 0.2);

        this.battlefield = battlefield;
        this.damage = damage;

        this.px = 50 * Math.cos(angle);
        this.py = 50 * Math.sin(angle);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'white';
        super.draw(ctx);
    }

    didHitWall() {
        super.didHitWall();
        this.battlefield.entities.delete(this);
    }

}

class Battlefield extends GameEngine {
    fighters: Set<Fighter>;

    constructor() {
        super(document.getElementById("battlefield") as HTMLCanvasElement);
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.fighters = new Set();
        this.entities = new Set();

        for (let i = 0; i < 10; i++) {
            this.spawnFighter('red');
            this.spawnFighter('blue');
        }
    }

    spawnFighter(team) {
        let fighter = new Fighter(this, team, team === 'red' ? 0 : this.canvas.width, Math.random() * this.canvas.height);

        this.fighters.add(fighter);
        this.entities.add(fighter);
    }

    handleBullet(fighter: Fighter, bullet: Bullet) {
        fighter.takeDamage(bullet.damage);
        this.entities.delete(bullet);
    }

    handleCollision(entity1: Entity, entity2: Entity) {
        if (entity1 instanceof Fighter && entity2 instanceof Fighter) {
            if (entity1.team === entity2.team) return;

            if (entity1.weapon === 'melee') {
                entity2.takeDamage(entity1.getDamage())
            }

            if (entity2.weapon === 'melee') {
                entity1.takeDamage(entity2.getDamage());
            }
        } else if (entity1 instanceof Fighter && entity2 instanceof Bullet) {
            this.handleBullet(entity1, entity2);
        } else if (entity1 instanceof Bullet && entity2 instanceof Fighter) {
            this.handleBullet(entity2, entity1);
        }
    }

}

// @ts-ignore
window.playGame = function() {
    // @ts-ignore
    window.battlefield = new Battlefield();
    // @ts-ignore
    window.battlefield.gameLoop();

    console.log("HELLO DUDE 1234");
}