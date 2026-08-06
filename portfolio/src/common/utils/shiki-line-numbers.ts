export function addLineNumbersToHtml(html: string): string {
  if (!html) return html;

  const lines = html.split("\n");
  if (lines.length <= 1) return html;

  return lines
    .map((line, idx) => {
      if (idx === lines.length - 1 && line.trim() === "") return line;
      return `<span class="line-number" data-line="${idx + 1}">${line}</span>`;
    })
    .join("\n");
}
