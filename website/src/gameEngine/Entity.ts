export class Entity {
    x: number;
    y: number;
    w: number;
    h: number;

    m: number; // mass
    px: number = 0; // momentum in the x direction
    py: number = 0; // momentum in the y direction

    bitmask: number = 0; // only collide with things that intersect this bitmask

    constructor(x: number, y: number, w: number, h: number, m: number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.m = m;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        let {left: x, top: y} = this.bounds()

        ctx.fillRect(x, y, this.w, this.h);
    }

    update(dt: number): void {}

    didHitWall(): void {}

    // properties

    bounds(): {left: number, right: number, top: number, bottom: number} {
        return {
            left: this.x - this.w/2,
            right: this.x + this.w/2,
            top: this.y - this.h/2,
            bottom: this.y + this.h/2
        }
    }

    velocity(): {vx: number, vy: number} {
        return {
            vx: this.px / this.m,
            vy: this.py / this.m
        }
    }

    angleTo({x: x2, y: y2}: {x: number, y: number}): number {
        return Math.atan2(y2 - this.y, x2 - this.x);
    }

    distanceTo({x: x2, y: y2}: {x: number, y: number}) : number {
        return Math.sqrt((y2 - this.y) ** 2 + (x2 - this.x) ** 2);
    }

}