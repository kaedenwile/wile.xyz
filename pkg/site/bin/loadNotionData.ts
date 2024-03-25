import { genTypes, queryNotionDatabase } from '@wile/notion-loader';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { promises as fs } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const loadData = async (databaseId: string, folder: string, typename: string) => {
  await Promise.all([
    (async () => {
      const typeFile = await genTypes(databaseId, typename);
      await fs.writeFile(resolve(__dirname, folder, 'types.gen.ts'), typeFile);
    })(),
    (async () => {
      const data = await queryNotionDatabase(databaseId);
      await fs.writeFile(resolve(__dirname, folder, 'data.json'), JSON.stringify(data));
    })(),
  ]);
};

await Promise.all([
  loadData(process.env.NOTION_HOME_DB_ID!, '../src/home/', 'HomeData'),
  loadData(process.env.NOTION_BELT_DB_ID!, '../src/belt/', 'BeltData'),
]);
