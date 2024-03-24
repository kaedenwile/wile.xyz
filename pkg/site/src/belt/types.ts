import type { NotionBlock } from '@wile/notion-loader';

export type BeltData = {
  content: NotionBlock[];
  version: string;
}[];
