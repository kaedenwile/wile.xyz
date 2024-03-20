import { HomeTabParagraph } from './types.ts';

export type HomeContentProps = {
  content?: HomeTabParagraph[];
};

export const HomeContent = ({ content }: HomeContentProps) => {
  return (
    <div className="content">
      {content?.map((paragraph, i) => (
        <p key={i}>
          {paragraph.paragraph.rich_text.map((node, i) => {
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
        </p>
      ))}
    </div>
  );
};
