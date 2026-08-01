import assert from "node:assert/strict";
import test from "node:test";

import { renderRssFeed } from "./rss.ts";

test("renders a deterministic bilingual RSS feed with escaped content", () => {
  const xml = renderRssFeed(
    [
      {
        locale: "en",
        slug: "older-post",
        title: `Older & <post> "quoted" 'once'`,
        description: "English <description> & details",
        publishedAt: "2026-07-01",
      },
      {
        locale: "vi",
        slug: "newer-post",
        title: "Bai viet moi",
        description: "Mo ta moi",
        publishedAt: "2026-07-02",
        updatedAt: "2026-07-03",
      },
    ],
    "https://example.com/",
  );

  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/u);
  assert.match(
    xml,
    /<lastBuildDate>Fri, 03 Jul 2026 00:00:00 GMT<\/lastBuildDate>/u,
  );
  assert.match(xml, /https:\/\/example\.com\/vi\/blog\/newer-post/u);
  assert.match(xml, /https:\/\/example\.com\/en\/blog\/older-post/u);
  assert.match(
    xml,
    /Older &amp; &lt;post&gt; &quot;quoted&quot; &apos;once&apos;/u,
  );
  assert.match(xml, /English &lt;description&gt; &amp; details/u);
  assert.ok(xml.indexOf("newer-post") < xml.indexOf("older-post"));
});

test("renders a valid empty feed without a last build date", () => {
  const xml = renderRssFeed([], "https://example.com");

  assert.match(xml, /<channel>/u);
  assert.doesNotMatch(xml, /<lastBuildDate>/u);
  assert.doesNotMatch(xml, /<item>/u);
});
