export type MessageHandler = <T extends Message>(message: T) => void;

export type Message = {
  type: string;
};

export type InitMessage = {
  type: 'init';
  width: number;
  height: number;
};

export type ResizeMessage = {
  type: 'resize';
  width: number;
  height: number;
};

export type PaintMessage = {
  type: 'paint';
  blocks: PaintBlock[];
};

/** x, y is center of block **/
export type PaintBlock =
  | {
      w: number;
      h: number;
      x: number;
      y: number;
      c: Color;
    }
  | PaintBlock[];

export type Color = string;
