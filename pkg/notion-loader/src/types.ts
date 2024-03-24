export type NotionBlock = {
  id: string;
  type: 'paragraph' | 'bulleted_list_item';
  content: NotionRichText[] | undefined;
};

export type NotionRichText = {
  type: 'text';
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href: string | null;
};

export type NotionEntry = {
  content: NotionBlock[];
} & Record<string, string | number>;
