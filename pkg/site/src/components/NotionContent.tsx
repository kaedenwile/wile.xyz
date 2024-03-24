import type { NotionBlock } from '@wile/notion-loader';
import { ReactElement, ReactNode } from 'react';
import { Block } from './Block.tsx';

export type NotionContentProps = {
  content?: NotionBlock[];
};

// Automatically wraps neighboring list items in common `ul`
export const NotionContent = ({ content }: NotionContentProps) => {
  const children: ReactNode[] = [];

  let i = 0;
  for (const block of content ?? []) {
    const element = <Block block={block} key={i++} />;

    if (block.type === 'bulleted_list_item') {
      if ((children[children.length - 1] as ReactElement)?.type === 'ul') {
        children.push(
          <ul key={i}>
            {(children.pop() as ReactElement).props.children}
            {element}
          </ul>
        );
      } else {
        children.push(<ul key={i}>{element}</ul>);
      }
    } else {
      children.push(element);
    }
  }

  return <>{children}</>;
};
