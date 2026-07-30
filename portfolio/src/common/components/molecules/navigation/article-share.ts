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
