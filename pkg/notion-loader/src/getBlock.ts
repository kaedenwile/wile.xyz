import { headers } from './api.ts';
import { NotionBlock, NotionRichText } from './types.ts';

type BlockApiResponse = {
  results: (ParagraphBlock | BulletListBlock)[];
  has_more: boolean;
};

type ParagraphBlock = {
  id: string;
  type: 'paragraph';
  paragraph: {
    rich_text: NotionRichText[];
  };
};

type BulletListBlock = {
  id: string;
  type: 'bulleted_list_item';
  bulleted_list_item: {
    rich_text: NotionRichText[];
  };
};

export async function getBlock(blockId: string): Promise<NotionBlock[]> {
  const res = await fetch(`https://api.notion.com/v1/blocks/${blockId}/children`, { headers });
  if (!res.ok) throw new Error(`Unable to load block: ${blockId}\n${await res.text()}`);

  const data = (await res.json()) as BlockApiResponse;

  return data.results.map((block) => {
    let content;
    if (block.type === 'paragraph') {
      content = block.paragraph.rich_text;
    } else if (block.type === 'bulleted_list_item') {
      content = block.bulleted_list_item.rich_text;
    }

    return {
      id: block.id,
      type: block.type,
      content,
    };
  });
}
