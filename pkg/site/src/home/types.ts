import type { NotionBlock } from '@wile/notion-loader';

export type HomeData = {
  name: string;
  order: number;
  link: string | null;
  content: NotionBlock[];
}[];
