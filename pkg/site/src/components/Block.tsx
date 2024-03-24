import type { NotionBlock } from '@wile/notion-loader';

export type BlockProps = {
  block: NotionBlock;
};

export const Block = ({ block }: BlockProps) => {
  let Component: 'p' | 'li';
  if (block.type === 'paragraph') {
    Component = 'p';
  } else if (block.type === 'bulleted_list_item') {
    Component = 'li';
  } else {
    throw new Error(`Unknown block type: ${block.type}`);
  }

  return (
    <Component>
      {block.content?.map((node, i) => {
        if (node.href) {
          return (
            <a key={i} href={node.href}>
              {node.plain_text}
            </a>
          );
        } else {
          return <span key={i}>{node.plain_text}</span>;
        }
      })}
    </Component>
  );
};
