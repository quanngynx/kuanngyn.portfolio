import assert from "node:assert/strict";
import test from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

let ResponsiveTable;

try {
  ({ ResponsiveTable } = await import("./responsive-table.ts"));
} catch {}

test("renders a semantic table inside a horizontal scroll container", () => {
  assert.equal(typeof ResponsiveTable, "function");

  const markup = renderToStaticMarkup(
    createElement(
      ResponsiveTable,
      null,
      createElement(
        "tbody",
        null,
        createElement("tr", null, createElement("td", null, "Example")),
      ),
    ),
  );

  assert.match(markup, /overflow-x-auto/);
  assert.match(markup, /<table[^>]*>.*<tbody>.*Example.*<\/tbody>.*<\/table>/);
});
