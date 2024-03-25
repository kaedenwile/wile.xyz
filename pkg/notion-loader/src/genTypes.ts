import { headers } from './api';
import { NotionRichText } from './types.ts';

type DbSchemaResponse = {
  title: NotionRichText[];
  properties: Record<
    string,
    {
      name: string;
      type: 'title' | 'number' | 'url';
    }
  >;
};

export async function genTypes(databaseId: string, typeName: string) {
  const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, { headers });

  if (!res.ok) {
    throw new Error(`Unable to load schema for database: ${databaseId}\n${await res.text()}`);
  }

  const schema = (await res.json()) as DbSchemaResponse;

  return `import type { NotionBlock } from '@wile/notion-loader';

export type ${typeName} = {
${Object.values(schema.properties)
  .map(({ name, type }) => `  ${name.toLowerCase()}: ${typeForType(type)};`)
  .join('\n')}
  content: NotionBlock[];
}`;
}

function typeForType(type: 'number' | 'url' | 'title') {
  if (type === 'number') {
    return 'number | null';
  } else if (type === 'title' || type === 'url') {
    return 'string | null';
  } else {
    throw new Error(`Unknown type: ${type}`);
  }
}
