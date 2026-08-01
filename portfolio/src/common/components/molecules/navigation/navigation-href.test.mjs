import assert from "node:assert/strict";
import test from "node:test";

import { resolveNavigationHref } from "./navigation-href.ts";

test("keeps section hashes local on the homepage", () => {
  assert.equal(resolveNavigationHref("#about", "en", true), "#about");
});

test("routes section hashes through the localized homepage elsewhere", () => {
  assert.equal(resolveNavigationHref("#about", "vi", false), "/vi#about");
});

test("always localizes route targets", () => {
  assert.equal(resolveNavigationHref("/blog", "vi", true), "/vi/blog");
  assert.equal(resolveNavigationHref("/blog", "en", false), "/en/blog");
});
