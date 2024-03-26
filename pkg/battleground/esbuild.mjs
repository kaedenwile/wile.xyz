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

await fs.writeFile('dist/engine.js', "export const gameEngineCode = " + JSON.stringify((await build({
  entryPoints: ['src/engine/index.ts'],
  format: 'esm',
  bundle: true,
  minify: true,
  write: false
})).outputFiles[0].text.replace(/export\s*{([A-Za-z0-9]*) as gameEngine};\s*$/, '$1();')) + ';');
