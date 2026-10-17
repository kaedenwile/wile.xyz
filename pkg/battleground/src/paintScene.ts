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
    ctx.globalAlpha = 0.68;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.beginPath();
    if (d.role === 2) {
      ctx.moveTo(7, 0);
      ctx.lineTo(1, -5);
      ctx.lineTo(-5, -4);
      ctx.lineTo(-3, 0);
      ctx.lineTo(-5, 4);
      ctx.lineTo(1, 5);
    } else {
      ctx.moveTo(d.role === 0 ? 8 : 6, 0);
      ctx.lineTo(-5, -4);
      ctx.lineTo(-2, 0);
      ctx.lineTo(-5, 4);
    }
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#d9e5e7';
    ctx.globalAlpha = 0.7;
    ctx.fillRect(0, -1, 2, 2);
    if (d.role === 3) {
      ctx.strokeStyle = '#c6e0d6';
      ctx.beginPath();
      ctx.moveTo(-3, 0);
      ctx.lineTo(3, 0);
      ctx.moveTo(0, -3);
      ctx.lineTo(0, 3);
      ctx.stroke();
    }
    ctx.restore();
    if (d.health < 0.8) {
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = color;
      ctx.fillRect(d.x - 5, d.y + 9, 10 * Math.max(0, d.health), 1);
    }
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
  ctx.lineWidth = 1.2;
  for (const p of scene.shots) {
    ctx.globalAlpha = Math.min(0.55, p.life);
    ctx.strokeStyle = colors[p.team];
    ctx.beginPath();
    ctx.moveTo(p.x - p.vx * 0.025, p.y - p.vy * 0.025);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }
  for (const p of scene.pulses) {
    ctx.globalAlpha = (1 - p.age / 1.4) * 0.35;
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
