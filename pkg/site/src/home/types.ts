export type HomeTabParagraph = {
  id: string;
  type: string;
  paragraph: {
    rich_text: {
      type: string;
      plain_text: string;
      href: string | null;
    }[];
  };
};

export type HomeData = {
  title: string;
  order: number;
  link: string | null;
  content: HomeTabParagraph[];
}[];
