import "server-only";

import { evaluate } from "@mdx-js/mdx";
import rehypePrettyCode from "rehype-pretty-code";
import * as runtime from "react/jsx-runtime";

import { blogMdxComponents } from "./mdx-components";
import { prettyCodeOptions } from "./pretty-code";

interface MdxRendererProps {
  source: string;
  sourcePath: string;
}

async function compileMdx({ source, sourcePath }: MdxRendererProps) {
  try {
    const result = await evaluate(
      { value: source, path: sourcePath },
      {
        ...runtime,
        baseUrl: import.meta.url,
        rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
      },
    );

    return result.default;
  } catch (error) {
    throw new Error(`Failed to compile MDX file: ${sourcePath}`, {
      cause: error,
    });
  }
}

export async function MdxRenderer(props: MdxRendererProps) {
  // Repository-controlled MDX only. The component map is not a sandbox.
  const Content = await compileMdx(props);

  return <Content components={blogMdxComponents} />;
}
