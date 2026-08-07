import { highlightCode } from "@/common/utils/shiki";
import { addLineNumbersToHtml } from "@/common/utils/shiki-line-numbers";
import { CodeBlockCopyButton } from "./code-block-copy-button";

interface Props {
  code: string;
  language?: string;
}

export async function NotionCodeBlock({ code, language = "text" }: Props) {
  const rawHtml = await highlightCode(code, language);
  const formattedHtml = addLineNumbersToHtml(rawHtml);

  return (
    <figure className="relative my-6 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
      {language && (
        <div className="border-b border-neutral-800 bg-neutral-900/60 px-4 py-3 font-mono text-xs tracking-wider text-neutral-400 uppercase">
          {language}
        </div>
      )}
      <CodeBlockCopyButton text={code} />
      <div className="overflow-x-auto bg-[#24292e] p-4">
        <div
          className="font-mono text-sm leading-relaxed text-neutral-200"
          dangerouslySetInnerHTML={{ __html: formattedHtml }}
        />
      </div>
    </figure>
  );
}
