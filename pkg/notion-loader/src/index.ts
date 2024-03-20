import { promises as fs } from 'node:fs';

const DATABASE_ID = 'e20d7798f12b4cf884b452754057e34f';

type LoadChildrenResponse = {
  results: {
    id: string;
    type: string;
    paragraph: {
      rich_text: {
        plain_text: string;
        href: string;
      }[];
    };
  }[];
  has_more: boolean;
};

type QueryPagesResponse = {
  results: {
    id: string;
    properties: {
      Order: {
        number: number;
      };
      Link: {
        url: string;
      };
      Name: {
        title: {
          plain_text: string;
        }[];
      };
    };
  }[];
};

async function queryPages(databaseId: string) {
  const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
    },
  });

  if (!res.ok) {
    throw new Error(`Unable to load database: ${databaseId}\n${await res.text()}`);
  }

  const data = (await res.json()) as QueryPagesResponse;

  return (
    await Promise.all(
      data.results.map(async (page) => ({
        title: page.properties.Name.title.map(({ plain_text }) => plain_text).join(''),
        order: page.properties.Order.number,
        link: page.properties.Link.url,
        content: await loadChildren(page.id),
      }))
    )
  ).sort((a, b) => a.order - b.order);
}

async function loadChildren(blockId: string) {
  const res = await fetch(`https://api.notion.com/v1/blocks/${blockId}/children`, {
    headers: {
      Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
    },
  });

  if (!res.ok) {
    throw new Error(`Unable to load block: ${blockId}\n${await res.text()}`);
  }

  const data = (await res.json()) as LoadChildrenResponse;

  return data.results.map((block) => ({
    id: block.id,
    type: block.type,
    paragraph: block.paragraph,
  }));
}

(async () => {
  const subpages = await queryPages(DATABASE_ID);
  console.log(`Writing to ${process.argv[2]}`);
  await fs.writeFile(process.argv[2], JSON.stringify(subpages, null, 2));
})();
