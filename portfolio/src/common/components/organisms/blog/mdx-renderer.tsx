import "server-only";

import { evaluate } from "@mdx-js/mdx";
import rehypePrettyCode from "rehype-pretty-code";
import * as runtime from "react/jsx-runtime";

import { ArticleNavigator } from "@/common/components/molecules/navigation/article-navigator";
import type { Locale } from "@/common/i18n/routes";

import { createArticleOutlineCollector } from "./article-outline";
import { blogMdxComponents } from "./mdx-components";
import { prettyCodeOptions } from "./pretty-code";

interface MdxRendererProps {
  locale: Locale;
  source: string;
  sourcePath: string;
}

async function compileMdx({
  source,
  sourcePath,
}: Omit<MdxRendererProps, "locale">) {
  try {
    const { outline, remarkPlugin } = createArticleOutlineCollector();
    const result = await evaluate(
      { value: source, path: sourcePath },
      {
        ...runtime,
        baseUrl: import.meta.url,
        remarkPlugins: [remarkPlugin],
        rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
      },
    );

    return { Content: result.default, outline };
  } catch (error) {
    throw new Error(`Failed to compile MDX file: ${sourcePath}`, {
      cause: error,
    });
  }
}

export async function MdxRenderer(props: MdxRendererProps) {
  // Repository-controlled MDX only. The component map is not a sandbox.
  const { Content, outline } = await compileMdx(props);

  return (
    <>
      <ArticleNavigator
        items={outline}
        label={
          props.locale === "vi" ? "Các phần của bài viết" : "Article sections"
        }
      />
      <Content components={blogMdxComponents} />
    </>
  );
}
