import { queryNotionDatabase } from '@wile/notion-loader';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { promises as fs } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// load home data
const loadHomeData = async () => {
  const homeData = await queryNotionDatabase(process.env.NOTION_HOME_DB_ID!);
  await fs.writeFile(resolve(__dirname, '../src/home/data.json'), JSON.stringify(homeData));
};

const loadBeltData = async () => {
  const data = await queryNotionDatabase(process.env.NOTION_BELT_DB_ID!);
  await fs.writeFile(resolve(__dirname, '../src/belt/data.json'), JSON.stringify(data));
};

await Promise.all([loadHomeData(), loadBeltData()]);
