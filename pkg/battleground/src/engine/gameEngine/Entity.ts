import { PaintBlock } from '../../types.ts';

export class Entity {
  x: number;
  y: number;
  w: number;
  h: number;

  m: number; // mass
  px = 0; // momentum in the x direction
  py = 0; // momentum in the y direction

  bitmask = 0; // only collide with things that intersect this bitmask

  constructor(x: number, y: number, w: number, h: number, m: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.m = m;
  }

  draw(): PaintBlock {
    const { left: x, top: y } = this.bounds();
    return { x, y, w: this.w, h: this.h, c: 'white' };
  }

  // eslint-disable-next-line
  update(dt: number): void {}

  // eslint-disable-next-line
  didHitWall(): void {}

  // properties

  bounds(): { left: number; right: number; top: number; bottom: number } {
    const { x, y, w, h } = this;
    // if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) {
    //     console.log(`${JSON.stringify(this)} ${JSON.stringify(x)} ${JSON.stringify(y)} ${JSON.stringify(w)} ${JSON.stringify(h)}`);
    // }

    return {
      left: x - w / 2,
      right: x + w / 2,
      top: y - h / 2,
      bottom: y + h / 2,
    };
  }

  velocity(): { vx: number; vy: number } {
    return {
      vx: this.px / this.m,
      vy: this.py / this.m,
    };
  }

  angleTo(other?: { x: number; y: number }): number {
    if (!other) return 0;
    return Math.atan2(other.y - this.y, other.x - this.x);
  }

  distanceTo(other?: { x: number; y: number }): number {
    if (!other) return NaN;
    return Math.sqrt((other.y - this.y) ** 2 + (other.x - this.x) ** 2);
  }
}
