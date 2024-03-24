import { headers } from './api.ts';
import { getBlock } from './getBlock.ts';
import { NotionEntry } from './types.ts';

type DbDataResponse = {
  results: {
    id: string;
    properties: Record<string, TitleProperty | NumberProperty | UrlProperty>;
  }[];
};

type TitleProperty = {
  type: 'title';
  title: {
    plain_text: string;
  }[];
};

type NumberProperty = {
  type: 'number';
  number: number;
};

type UrlProperty = {
  type: 'url';
  url: string;
};

export async function queryNotionDatabase(databaseId: string): Promise<NotionEntry[]> {
  const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: 'POST',
    headers,
  });

  if (!res.ok) {
    throw new Error(`Unable to load database: ${databaseId}\n${await res.text()}`);
  }

  const data = (await res.json()) as DbDataResponse;

  return await Promise.all(
    data.results.map(async ({ id, properties }) =>
      Object.entries(properties).reduce(
        (acc, [name, value]) => {
          name = name.toLowerCase();

          if (value.type === 'title') {
            acc[name] = (value as TitleProperty).title.map(({ plain_text }) => plain_text).join('');
          } else if (value.type === 'number') {
            acc[name] = (value as NumberProperty).number;
          } else if (value.type === 'url') {
            acc[name] = (value as UrlProperty).url;
          } else {
            throw Error(`unknown property type: ${JSON.stringify(value)}`);
          }
          return acc;
        },
        { content: await getBlock(id) } as NotionEntry
      )
    )
  );
}
