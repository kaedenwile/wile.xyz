import type { NotionBlock } from '@wile/notion-loader';

export type BeltData = {
  version: string | null;
  content: NotionBlock[];
}