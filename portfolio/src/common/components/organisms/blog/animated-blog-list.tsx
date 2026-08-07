"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRef } from "react";

import type { BlogPost } from "@/common/blog/content-schema";
import type { Locale } from "@/common/i18n/routes";
import { articlePath } from "@/common/utils/url";

gsap.registerPlugin(useGSAP);

interface AnimatedBlogListProps {
  posts: BlogPost[];
  locale: Locale;
}

function formatDate(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00.000Z`));
}

export function AnimatedBlogList({ posts, locale }: AnimatedBlogListProps) {
  const t = useTranslations("Blog");
  const containerRef = useRef<HTMLDivElement>(null);
  const postsKey = posts.map((p) => p.slug).join(",");

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const items = containerRef.current.querySelectorAll(".blog-post-item");
      if (items.length > 0) {
        gsap.fromTo(
          items,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.06,
            ease: "power2.out",
            clearProps: "transform,opacity",
          },
        );
      }
    },
    { dependencies: [postsKey], scope: containerRef },
  );

  if (posts.length === 0) {
    return (
      <div ref={containerRef} className="mt-16 text-muted-foreground">
        <p className="blog-post-item">{t("empty")}</p>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <ol className="mt-12 divide-y divide-border">
        {posts.map((post) => (
          <li key={post.slug} className="blog-post-item">
            <Link
              href={articlePath(locale, post.slug, post.kind)}
              className="group block py-10 focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              <div className="flex flex-wrap gap-x-3 text-sm text-muted-foreground">
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt, locale)}
                </time>
                <span aria-hidden="true">·</span>
                <span>{t("minuteRead", { minutes: post.readingMinutes })}</span>
              </div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight transition-opacity group-hover:opacity-65 md:text-4xl">
                {post.title}
              </h2>
              <p className="mt-3 max-w-3xl text-lg leading-8 text-muted-foreground">
                {post.subtitle}
              </p>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
