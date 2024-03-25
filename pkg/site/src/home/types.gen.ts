import type { NotionBlock } from '@wile/notion-loader';

export type HomeData = {
  order: number | null;
  link: string | null;
  name: string | null;
  content: NotionBlock[];
}