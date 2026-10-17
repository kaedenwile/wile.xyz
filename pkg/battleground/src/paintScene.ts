import type { Scene } from './droneSimulation';
const colors = ['#68b9b0', '#d6a17d'];
export function paintScene(ctx: CanvasRenderingContext2D, scene: Scene, ratio: number) {
  const { width, height } = scene;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#10171e';
  ctx.fillRect(0, 0, width, height);
  const wash = ctx.createRadialGradient(
    width * 0.6,
    height * 0.45,
    0,
    width * 0.6,
    height * 0.45,
    Math.max(width, height) * 0.7,
  );
  wash.addColorStop(0, '#1c2a34');
  wash.addColorStop(1, '#10171e');
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#8fa4b5';
  ctx.globalAlpha = 0.12;
  for (let x = 24; x < width; x += 48) for (let y = 24; y < height; y += 48) ctx.fillRect(x, y, 1, 1);
  for (const b of scene.beacons) {
    const color = Math.abs(b.control) < 0.04 ? '#738592' : colors[b.control > 0 ? 0 : 1];
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.14;
    ctx.beginPath();
    ctx.arc(b.x, b.y, 38, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([2, 7]);
    ctx.beginPath();
    ctx.arc(b.x, b.y, 46, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(b.x, b.y, 38, -Math.PI / 2, -Math.PI / 2 + Math.abs(b.control) * Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(b.x - 4, b.y);
    ctx.lineTo(b.x + 4, b.y);
    ctx.moveTo(b.x, b.y - 4);
    ctx.lineTo(b.x, b.y + 4);
    ctx.stroke();
  }
  for (const d of scene.drones) {
    if (d.respawn > 0) continue;
    const color = colors[d.team];
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.12;
    ctx.beginPath();
    d.trail.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.stroke();
    ctx.save();
    ctx.translate(d.x, d.y);
    ctx.rotate(d.angle);
    ctx.scale(1.8, 1.8);
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    // Each class has a distinct silhouette, not just a tiny interior marking.
    const outlines = [
      [
        [10, 0],
        [-6, -4],
        [-2, 0],
        [-6, 4],
      ],
      [
        [8, 0],
        [-5, -7],
        [-3, -1],
        [-7, 0],
        [-3, 1],
        [-5, 7],
      ],
      [
        [8, 0],
        [3, -6],
        [-7, -6],
        [-7, -2],
        [-4, 0],
        [-7, 2],
        [-7, 6],
        [3, 6],
      ],
      [
        [6, 0],
        [2, -6],
        [-5, -6],
        [-8, 0],
        [-5, 6],
        [2, 6],
      ],
    ];
    ctx.beginPath();
    outlines[d.role].forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = '#e3eff2';
    if (d.role === 3) {
      ctx.fillRect(-4, -1, 6, 2);
      ctx.fillRect(-2, -3, 2, 6);
    } else {
      ctx.fillRect(0, -1, 3, 2);
    }
    // Twin engines make the heavy profile readable even while turning.
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.45;
    if (d.role === 2) {
      ctx.fillRect(-10, -5, 3, 2);
      ctx.fillRect(-10, 3, 3, 2);
    } else ctx.fillRect(-8, -1, 3, 2);
    ctx.restore();
    if (d.role === 3) {
      const ally = scene.drones.find(
        (o) =>
          o.team === d.team &&
          o.id !== d.id &&
          o.respawn <= 0 &&
          o.health < 0.85 &&
          Math.hypot(o.x - d.x, o.y - d.y) < 65,
      );
      if (ally) {
        ctx.globalAlpha = 0.12;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(ally.x, ally.y);
        ctx.stroke();
      }
    }
  }
  ctx.lineWidth = 1.8;
  for (const p of scene.shots) {
    ctx.globalAlpha = Math.min(0.9, p.life * 2);
    ctx.strokeStyle = colors[p.team];
    ctx.beginPath();
    ctx.moveTo(p.x - p.vx * 0.04, p.y - p.vy * 0.04);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }
  for (const p of scene.pulses) {
    ctx.globalAlpha = (1 - p.age / 1.4) * 0.65;
    ctx.strokeStyle = colors[p.team];
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3 + p.age * (p.capture ? 42 : 13), 0, Math.PI * 2);
    ctx.stroke();
  }
  if (scene.pointer) {
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = '#bdced8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(scene.pointer.x, scene.pointer.y, 44, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}
