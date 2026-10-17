export type Point = { x: number; y: number };
export type Drone = Point & {
  id: number;
  team: number;
  role: number;
  squad: number;
  vx: number;
  vy: number;
  angle: number;
  health: number;
  cooldown: number;
  respawn: number;
  trail: Point[];
};
export type Shot = Point & { vx: number; vy: number; team: number; life: number };
export type Pulse = Point & { age: number; team: number; capture?: boolean };
export type Beacon = Point & { control: number };
export type Scene = {
  drones: Drone[];
  shots: Shot[];
  pulses: Pulse[];
  beacons: Beacon[];
  pointer: Point | null;
  width: number;
  height: number;
};
const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));

// Fixed-size world populations keep both rendering and steering costs bounded.
export class DroneSimulation {
  scene: Scene;
  time = 0;
  constructor(width: number, height: number) {
    this.scene = { width, height, drones: [], shots: [], pulses: [], beacons: [], pointer: null };
    this.resize(width, height);
    const count = width < 650 ? 12 : 24;
    for (let id = 0; id < count; id++) {
      const team = id % 2;
      const slot = Math.floor(id / 2);
      const drone: Drone = {
        id,
        team,
        role: slot % 4,
        squad: Math.floor(slot / 4) % 3,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        angle: 0,
        health: 1,
        cooldown: Math.random() * 3,
        respawn: 0,
        trail: [],
      };
      this.spawn(drone);
      this.scene.drones.push(drone);
    }
  }
  resize(width: number, height: number) {
    const old = this.scene;
    const sx = width / old.width,
      sy = height / old.height;
    for (const d of old.drones) {
      d.x *= sx;
      d.y *= sy;
      d.trail = [];
    }
    old.width = width;
    old.height = height;
    old.shots = [];
    old.pointer = null;
    old.beacons = [0.25, 0.5, 0.75].map((v, i) => ({
      x: width * v,
      y: height * (i === 1 ? 0.65 : 0.35),
      control: old.beacons[i]?.control ?? 0,
    }));
  }
  spawn(d: Drone) {
    const { width, height } = this.scene;
    d.x = width * (d.team ? 0.9 : 0.1);
    d.y = height * (0.18 + Math.random() * 0.64);
    d.vx = d.team ? -25 : 25;
    d.vy = 0;
    d.health = 1;
    d.respawn = 0;
    d.trail = [];
  }
  update(dt: number) {
    dt = clamp(dt, 0, 0.05);
    this.time += dt;
    const s = this.scene;
    const alive = s.drones.filter((d) => d.respawn <= 0);
    for (const d of s.drones) {
      if (d.respawn > 0) {
        d.respawn -= dt;
        if (d.respawn <= 0) this.spawn(d);
        continue;
      }
      const allies = alive.filter((o) => o.team === d.team && o.id !== d.id);
      const enemy = alive
        .filter((o) => o.team !== d.team)
        .sort((a, b) => Math.hypot(a.x - d.x, a.y - d.y) - Math.hypot(b.x - d.x, b.y - d.y))[0];
      const target = s.beacons[(d.squad + Math.floor(this.time / 24) + d.team) % 3];
      let tx = target.x,
        ty = target.y;
      // Scouts take a flanking arc; heavy units hold the perimeter.
      const orbit = d.role === 0 ? 70 : d.role === 2 ? 48 : 28;
      tx += Math.cos(this.time * 0.16 + d.id * 1.7) * orbit;
      ty += Math.sin(this.time * 0.16 + d.id * 1.7) * orbit;
      if (d.role === 3) {
        const injured = allies.filter((o) => o.health < 0.85).sort((a, b) => a.health - b.health)[0];
        if (injured) {
          tx = injured.x;
          ty = injured.y;
          if (Math.hypot(tx - d.x, ty - d.y) < 65) injured.health = Math.min(1, injured.health + dt * 0.1);
        }
      }
      let ax = (tx - d.x) * 0.3,
        ay = (ty - d.y) * 0.3;
      for (const o of allies) {
        const dx = d.x - o.x,
          dy = d.y - o.y,
          dist = Math.max(1, Math.hypot(dx, dy));
        if (dist < 32) {
          ax += (dx / dist) * (32 - dist) * 3;
          ay += (dy / dist) * (32 - dist) * 3;
        }
        if (o.squad === d.squad && dist < 200) {
          ax += (o.vx - d.vx) * 0.1;
          ay += (o.vy - d.vy) * 0.1;
        }
      }
      if (enemy && d.role !== 3) {
        const dist = Math.hypot(enemy.x - d.x, enemy.y - d.y);
        if (dist < 100) {
          ax -= (enemy.x - d.x) * 0.7;
          ay -= (enemy.y - d.y) * 0.7;
        }
      }
      if (s.pointer) {
        const dx = d.x - s.pointer.x,
          dy = d.y - s.pointer.y,
          dist = Math.max(1, Math.hypot(dx, dy));
        if (dist < 145) {
          const force = (1 - dist / 145) ** 2 * 700;
          ax += (dx / dist) * force;
          ay += (dy / dist) * force;
        }
      }
      // Soft walls turn drones before they reach the edge.
      ax += Math.max(0, 45 - d.x) * 2 - Math.max(0, d.x - s.width + 45) * 2;
      ay += Math.max(0, 45 - d.y) * 2 - Math.max(0, d.y - s.height + 45) * 2;
      const max = d.role === 0 ? 57 : d.role === 2 ? 30 : 43;
      d.vx = (d.vx + ax * dt) * Math.exp(-dt * 0.7);
      d.vy = (d.vy + ay * dt) * Math.exp(-dt * 0.7);
      const speed = Math.hypot(d.vx, d.vy);
      if (speed > max) {
        d.vx *= max / speed;
        d.vy *= max / speed;
      }
      d.x = clamp(d.x + d.vx * dt, 8, s.width - 8);
      d.y = clamp(d.y + d.vy * dt, 8, s.height - 8);
      const heading = Math.atan2(d.vy, d.vx);
      d.angle += Math.atan2(Math.sin(heading - d.angle), Math.cos(heading - d.angle)) * Math.min(1, dt * 5);
      d.trail.push({ x: d.x, y: d.y });
      if (d.trail.length > 12) d.trail.shift();
      d.cooldown -= dt;
      if (enemy && d.role !== 3 && d.cooldown <= 0 && s.shots.length < 48) {
        const dist = Math.hypot(enemy.x - d.x, enemy.y - d.y);
        if (dist < (d.role === 2 ? 260 : 180)) {
          const lead = dist / 260;
          const angle = Math.atan2(enemy.y + enemy.vy * lead - d.y, enemy.x + enemy.vx * lead - d.x);
          s.shots.push({
            x: d.x,
            y: d.y,
            vx: Math.cos(angle) * 260,
            vy: Math.sin(angle) * 260,
            team: d.team,
            life: 1.1,
          });
          d.cooldown = (d.role === 2 ? 2.8 : 1.8) + Math.random() * 1.4;
        }
      }
    }
    for (const b of s.beacons) {
      const before = b.control;
      const near = alive.filter((d) => d.respawn <= 0 && Math.hypot(d.x - b.x, d.y - b.y) < 80);
      const balance = near.filter((d) => d.team === 0).length - near.filter((d) => d.team === 1).length;
      b.control = clamp(b.control + clamp(balance, -2, 2) * dt * 0.09, -1, 1);
      if (Math.abs(before) < 1 && Math.abs(b.control) === 1)
        s.pulses.push({ x: b.x, y: b.y, age: 0, team: b.control > 0 ? 0 : 1, capture: true });
    }
    for (const shot of s.shots) {
      const ox = shot.x,
        oy = shot.y;
      shot.x += shot.vx * dt;
      shot.y += shot.vy * dt;
      shot.life -= dt;
      for (const d of alive) {
        if (d.team === shot.team || d.respawn > 0 || shot.life <= 0) continue;
        const dx = shot.x - ox,
          dy = shot.y - oy;
        const t = clamp(((d.x - ox) * dx + (d.y - oy) * dy) / (dx * dx + dy * dy || 1), 0, 1);
        if (Math.hypot(d.x - ox - dx * t, d.y - oy - dy * t) < 9) {
          d.health -= 0.24;
          shot.life = 0;
          s.pulses.push({ x: d.x, y: d.y, age: 0, team: d.team });
          if (d.health <= 0) d.respawn = 3 + Math.random() * 2;
        }
      }
    }
    s.shots = s.shots.filter((p) => p.life > 0 && p.x >= 0 && p.x <= s.width && p.y >= 0 && p.y <= s.height);
    s.pulses = s.pulses.filter((p) => (p.age += dt) < 1.4).slice(-24);
  }
}
