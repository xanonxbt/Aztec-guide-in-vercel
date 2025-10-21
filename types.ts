export interface CodeBlock {
  type: 'code';
  language: string;
  content: string;
}

export interface ParagraphBlock {
  type: 'paragraph';
  content: string;
}

export interface ListBlock {
  type: 'list';
  items: string[];
}

export interface BlockquoteBlock {
  type: 'blockquote';
  content: string;
}

export type Block = CodeBlock | ParagraphBlock | ListBlock | BlockquoteBlock;

export interface Section {
  title: string;
  blocks: Block[];
}

export interface Guide {
  title: string;
  description: string;
  sections: Section[];
}
