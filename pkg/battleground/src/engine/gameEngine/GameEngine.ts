import { Entity } from './Entity';

export class GameEngine {
  width: number;
  height: number;
  entities: Set<Entity>;

  oldCollisionMap: Map<Entity, Set<Entity>>;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.entities = new Set();
    this.oldCollisionMap = new Map();
  }

  gameLoop() {
    let ts = performance.now();

    setInterval(() => {
      const new_ts = performance.now();
      let dt = (new_ts - ts) / 1000;
      if (dt > 0.25) dt = 0.25;
      this.entities.forEach((entity) => entity.update(dt));
      this.physicsStep(dt);
      ts = new_ts;

      this.collisionDetectionStep();

      this.drawStep();
    }, 0.05);
  }

  physicsStep(dt: number) {
    this.entities.forEach((entity) => {
      const { vx, vy } = entity.velocity();
      entity.x += vx * dt;
      entity.y += vy * dt;
    });
  }

  collisionDetectionStep() {
    const collisionMap: Map<Entity, Set<Entity>> = new Map();

    this.entities.forEach((entity) => {
      collisionMap.set(entity, new Set());

      const { x, y } = entity;
      const { left: l, right: r, top: t, bottom: b } = entity.bounds();

      // border: left/right
      if (l < 0) {
        entity.px = Math.abs(entity.px);
        entity.didHitWall();

        if (x < 0) entity.x = 0;
      } else if (r > this.width) {
        entity.px = -Math.abs(entity.px);
        entity.didHitWall();

        if (x > this.width) entity.x = this.width;
      }

      // border: top/bottom
      if (t < 0) {
        entity.py = Math.abs(entity.py);
        entity.didHitWall();

        if (y < 0) entity.y = 0;
      } else if (b > this.height) {
        entity.py = -Math.abs(entity.py);
        entity.didHitWall();

        if (y > this.height) entity.y = this.height;
      }

      this.entities.forEach((other) => {
        if (entity === other) return;
        if (collisionMap.get(other)?.has(entity)) {
          collisionMap.get(entity).add(other);
          return;
        }

        const { left: l2, right: r2, top: t2, bottom: b2 } = other.bounds();

        if (l > r2 || r < l2 || t > b2 || b < t2) return;

        collisionMap.get(entity).add(other);
        if (this.oldCollisionMap?.get(entity)?.has(other)) return; // still in contact

        if (entity.bitmask & other.bitmask) {
          this.handleCollision(entity, other);
        }

        // entity and other are colliding!
        this.handleContact(entity, other);
      });
    });

    this.oldCollisionMap = collisionMap;
  }

  drawStep() {
    console.log('painting with ', this.width, this.height);

    self.postMessage({
      type: 'paint',
      blocks: [{ x: 0, y: 0, w: this.width, h: this.height, c: 'black' }, [...this.entities].map((e) => e.draw())],
    });
  }

  // internal physics step. Calculates elastic collision
  handleCollision(entity1: Entity, entity2: Entity): void {
    const { x: x1, y: y1, m: m1, px: px1, py: py1 } = entity1;
    const { x: x2, y: y2, m: m2, px: px2, py: py2 } = entity2;

    /// for simplicity convert radians to degree
    let angle = (Math.atan2(y1 - y2, x1 - x2) * 180) / Math.PI;
    if (angle < 0) angle += 360;

    const dm = m1 - m2;
    const m_total = m1 + m2;

    if (
      // if hit on the right and relative velocity to the left
      (((angle >= 0 && angle < 45) || (angle >= 315 && angle < 360)) && px1 - px2 < 0) ||
      // or hit on the left and rel vel right
      (angle >= 135 && angle < 225 && px1 - px2 > 0)
    ) {
      entity1.px = (dm * px1 + 2 * m1 * px2) / m_total;
      entity2.px = (-dm * px2 + 2 * m2 * px1) / m_total;
    } else if (
      // hit on the bottom with rel vel up
      (angle >= 45 && angle < 135 && py1 - py2 < 0) ||
      // hit on the top with rel vel down
      (angle >= 225 && angle < 315 && py1 - py2 > 0)
    ) {
      entity1.py = (dm * py1 + 2 * m1 * py2) / m_total;
      entity2.py = (-dm * py2 + 2 * m2 * py1) / m_total;
    }
  }

  // calculates game logic for contact
  // eslint-disable-next-line
  handleContact(entity1: Entity, entity2: Entity): void {}
}
