
class Entity {
    x: number;
    y: number;
    w: number;
    h: number;

    m: number; // mass
    px: number = 0; // momentum in the x direction
    py: number = 0; // momentum in the y direction

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

    collide(other: Entity): void {}

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

}


class GameEngine {

    canvas: HTMLCanvasElement;
    entities: Set<Entity>;

    oldCollisionMap: Map<Entity, Set<Entity>>;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;

        this.entities = new Set();
    }

    gameLoop() {
        let ts = window.performance.now();

        window.setInterval(() => {
            let new_ts = window.performance.now();
            let dt = (new_ts - ts) / 1000;
            if (dt > 0.25) dt = 0.25;
            this.entities.forEach(entity => entity.update(dt))
            this.physicsStep(dt);
            ts = new_ts;

            this.collisionDetectionStep();

            this.drawStep();
        }, 0.05)
    }

    physicsStep(dt: number) {
        this.entities.forEach(entity => {
            let {vx, vy} = entity.velocity();
            entity.x += vx * dt;
            entity.y += vy * dt;
        })
    }

    _doElasticCollision(entity1, entity2, axis: "x" | "y") {
        let {m: m1, px: px1, py: py1} = entity1;
        let {m: m2, px: px2, py: py2} = entity2;

        let dm = m1 - m2;
        let m_total = m1 + m2;

        if (axis === "x") {
            entity1.px = (dm * px1 + 2 * m1 * px2) / m_total;
            entity2.px = (-dm * px2 + 2 * m2 * px1) / m_total;
        } else if (axis === "y") {
            entity1.py = (dm * py1 + 2 * m1 * py2) / m_total;
            entity2.py = (-dm * py2 + 2 * m2 * py1) / m_total;
        }
    }

    collisionDetectionStep() {
        let collisionMap : Map<Entity, Set<Entity>> = new Map();

        this.entities.forEach(entity => {
            collisionMap.set(entity, new Set());

            let {x, y, px, py, m} = entity;
            let {left: l, right: r, top: t, bottom: b} = entity.bounds();

            // border: left/right
            if (l < 0) {
                entity.px = Math.abs(entity.px);
                entity.didHitWall();
            } else if (r > this.canvas.width) {
                entity.px = -Math.abs(entity.px);
                entity.didHitWall();
            }

            // border: top/bottom
            if (t < 0) {
                entity.py = Math.abs(entity.py);
                entity.didHitWall();
            } else if (b > this.canvas.height) {
                entity.py = -Math.abs(entity.py);
                entity.didHitWall();
            }

            this.entities.forEach(other => {
                if (entity === other) return;
                if (collisionMap.get(other)?.has(entity)) {
                    collisionMap.get(entity).add(other);
                    return;
                }

                let {x: x2, y: y2, px: px2, py: py2} = other;
                let {left: l2, right: r2, top: t2, bottom: b2} = other.bounds();

                if (l > r2 || r < l2 || t > b2 || b < t2) return;

                collisionMap.get(entity).add(other);
                if (this.oldCollisionMap?.get(entity)?.has(other)) return; // still in contact

                /// for simplicity convert radians to degree
                let angle = Math.atan2(y - y2, x - x2) * 180 / Math.PI;
                if (angle < 0) angle += 360;

                if (
                    // if hit on the right and relative velocity to the left
                    ((angle >= 0 && angle < 45) || (angle >= 315 && angle < 360)) && (px - px2 < 0)

                    // or hit on the left and rel vel right
                    || (angle >= 135 && angle < 225) && (px - px2 > 0)
                ) {
                    this._doElasticCollision(entity, other, "x");
                } else if (
                    // hit on the bottom with rel vel up
                    ((angle >= 45 && angle < 135) && (py - py2 < 0))

                    // hit on the top with rel vel down
                    || ((angle >= 225 && angle < 315) &&  (py - py2 > 0))
                ){
                    this._doElasticCollision(entity, other, "y");
                }

                // entity and other are colliding!
                this.handleCollision(entity, other);
            })
        });

        this.oldCollisionMap = collisionMap;
    }

    drawStep() {
        let ctx = this.canvas.getContext('2d');

        // draw background
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // draw entities
        this.entities.forEach(entity => {
            ctx.fillStyle = '';
            ctx.strokeStyle = '';
            entity.draw(ctx)
        });
    }

    handleCollision(entity1: Entity, entity2: Entity): void {}

}

export {
    Entity,
    GameEngine
}