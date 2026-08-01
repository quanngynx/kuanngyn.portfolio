import "server-only";

import { evaluate } from "@mdx-js/mdx";
import rehypePrettyCode from "rehype-pretty-code";
import * as runtime from "react/jsx-runtime";

import { ArticleNavigator } from "@/common/components/molecules/navigation/article-navigator";
import {
  ArticleShareActions,
  type ArticleShareLabels,
} from "@/common/components/molecules/navigation/article-share-actions";
import type { Locale } from "@/common/i18n/routes";

import { createArticleOutlineCollector } from "./article-outline";
import { blogMdxComponents } from "./mdx-components";
import { prettyCodeOptions } from "./pretty-code";

interface MdxRendererProps {
  locale: Locale;
  source: string;
  sourcePath: string;
  articleUrl: string;
  articleTitle: string;
}

interface ArticleLabels {
  sections: string;
  share: ArticleShareLabels;
}

const articleLabels = {
  en: {
    sections: "Article sections",
    share: {
      group: "Share article",
      copy: "Copy article link",
      copied: "Article link copied",
      failed: "Could not copy article link",
      mobile: "Share article",
      facebook: "Share on Facebook",
      x: "Share on X",
    },
  },
  vi: {
    sections: "Các phần của bài viết",
    share: {
      group: "Chia sẻ bài viết",
      copy: "Sao chép liên kết bài viết",
      copied: "Đã sao chép liên kết bài viết",
      failed: "Không thể sao chép liên kết bài viết",
      mobile: "Chia sẻ bài viết",
      facebook: "Chia sẻ lên Facebook",
      x: "Chia sẻ lên X",
    },
  },
} satisfies Record<Locale, ArticleLabels>;

async function compileMdx({
  source,
  sourcePath,
}: Pick<MdxRendererProps, "source" | "sourcePath">) {
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
  const labels = articleLabels[props.locale];

  return (
    <>
      <ArticleNavigator items={outline} label={labels.sections} />
      <ArticleShareActions
        articleUrl={props.articleUrl}
        articleTitle={props.articleTitle}
        labels={labels.share}
      />
      <Content components={blogMdxComponents} />
    </>
  );
}
