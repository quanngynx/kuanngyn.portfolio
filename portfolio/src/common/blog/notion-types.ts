import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export type NotionBlockNode = {
  block: BlockObjectResponse;
  children: NotionBlockNode[];
};

export interface DecorationMark {
  type: "bold" | "italic" | "strikethrough" | "code" | "link" | "color";
  value?: string;
}

export interface FormattedRichText {
  text: string;
  href?: string;
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
}
