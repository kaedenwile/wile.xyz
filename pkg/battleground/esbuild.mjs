import { build } from 'esbuild';
import { promises as fs } from 'node:fs';

await build({
  entryPoints: ['src/index.ts'],
  format: 'esm',
  bundle: true,
  outdir: 'dist',
  external: [
    'react',
    './engine'
  ],
})

await fs.writeFile('dist/engine.js', `export const gameEngine = () => {
${(await build({
  entryPoints: ['src/engine/index.ts'],
  format: 'esm',
  bundle: true,
  write: false
})).outputFiles[0].text.replace("export {\n  gameEngine\n};", '')}
gameEngine();
}`);
