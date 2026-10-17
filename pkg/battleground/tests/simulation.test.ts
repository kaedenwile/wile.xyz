import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DroneSimulation } from '../src/droneSimulation';

test('a long-running battle remains finite, bounded, and captures objectives', () => {
  const game = new DroneSimulation(1200, 800);
  let captured = false;
  for (let i = 0; i < 9000; i++) {
    game.update(1 / 30);
    if (i === 3000) game.scene.pointer = { x: 600, y: 400 };
    if (i === 3600) game.scene.pointer = null;
    captured ||= game.scene.beacons.some((b) => Math.abs(b.control) > 0.9);
    assert.ok(game.scene.shots.length <= 80);
    for (const d of game.scene.drones) {
      assert.ok([d.x, d.y, d.vx, d.vy, d.angle, d.health].every(Number.isFinite));
      assert.ok(d.x >= 0 && d.x <= 1200 && d.y >= 0 && d.y <= 800);
    }
  }
  assert.equal(game.scene.drones.length, 32);
  assert.ok(captured);
});

test('cursor influence bends an otherwise identical flight away from the pointer', () => {
  const a = new DroneSimulation(1200, 800),
    b = new DroneSimulation(1200, 800);
  const d = a.scene.drones[0];
  d.x = 500;
  d.y = 400;
  d.vx = 0;
  d.vy = 0;
  a.scene.drones = [d];
  b.scene = structuredClone(a.scene);
  b.scene.pointer = { x: 480, y: 400 };
  a.update(1 / 30);
  b.update(1 / 30);
  assert.ok(b.scene.drones[0].vx > a.scene.drones[0].vx);
});

test('capture is contested and medics restore allied health', () => {
  const game = new DroneSimulation(1200, 800);
  const [a, b] = game.scene.drones;
  const beacon = game.scene.beacons[0];
  Object.assign(a, { x: beacon.x, y: beacon.y, role: 3 });
  Object.assign(b, { x: beacon.x + 10, y: beacon.y, health: 0.5 });
  game.scene.drones = [a, b];
  game.update(1 / 30);
  assert.equal(beacon.control, 0);
  b.team = a.team;
  const health = b.health;
  game.update(1 / 30);
  assert.ok(beacon.control > 0);
  assert.ok(b.health > health);
});

test('mobile and resize keep a bounded population and normalized beacon positions', () => {
  const game = new DroneSimulation(390, 844);
  assert.equal(game.scene.drones.length, 16);
  game.scene.pointer = { x: 100, y: 200 };
  game.resize(844, 390);
  assert.equal(game.scene.pointer, null);
  assert.equal(game.scene.beacons[1].x, 422);
  for (let i = 0; i < 300; i++) game.update(1 / 30);
  assert.ok(game.scene.drones.every((d) => d.x >= 0 && d.x <= 844 && d.y >= 0 && d.y <= 390));
});

test('bundled worker initializes, advances, pauses, and resizes', async () => {
  const { runInNewContext } = await import('node:vm');
  const { gameEngineCode } = await import('../dist/engine.js');
  let handler: (event: { data: Record<string, unknown> }) => void;
  let tick: (() => void) | undefined;
  let last: { scene: { width: number; drones: { x: number }[] } };
  runInNewContext(gameEngineCode, {
    self: {
      addEventListener: (_name: string, fn: typeof handler) => {
        handler = fn;
      },
      postMessage: (data: typeof last) => {
        last = structuredClone(data);
      },
    },
    setInterval: (fn: () => void) => {
      tick = fn;
      return 1;
    },
    clearInterval: () => {
      tick = undefined;
    },
  });
  handler!({ data: { type: 'init', width: 1200, height: 800, paused: true } });
  assert.equal(last!.scene.drones.length, 32);
  assert.equal(tick, undefined);
  handler!({ data: { type: 'pause', paused: false } });
  const x = last!.scene.drones[0].x;
  tick!();
  assert.notEqual(last!.scene.drones[0].x, x);
  handler!({ data: { type: 'pause', paused: true } });
  assert.equal(tick, undefined);
  handler!({ data: { type: 'resize', width: 600, height: 400 } });
  assert.equal(last!.scene.width, 600);
});
