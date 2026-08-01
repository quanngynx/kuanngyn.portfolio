export function createArticleShareUrls(
  articleUrl: string,
  articleTitle: string,
) {
  const facebook = new URL("https://www.facebook.com/sharer/sharer.php");
  facebook.searchParams.set("u", articleUrl);

  const x = new URL("https://x.com/intent/tweet");
  x.searchParams.set("text", articleTitle);
  x.searchParams.set("url", articleUrl);

  return {
    facebook: facebook.toString(),
    x: x.toString(),
  };
}

export type ShareArticleResult = "shared" | "copied" | "cancelled";

export interface ShareRuntime {
  share?: (data: ShareData) => Promise<void>;
  clipboard?: {
    writeText(value: string): Promise<void>;
  };
}

function isAbortError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "AbortError"
  );
}

export async function shareOrCopyArticle(
  runtime: ShareRuntime,
  title: string,
  url: string,
): Promise<ShareArticleResult> {
  if (runtime.share) {
    try {
      await runtime.share({ title, url });
      return "shared";
    } catch (error) {
      if (isAbortError(error)) return "cancelled";
    }
  }

  if (runtime.clipboard) {
    await runtime.clipboard.writeText(url);
    return "copied";
  }

  throw new Error("Sharing unavailable");
}
