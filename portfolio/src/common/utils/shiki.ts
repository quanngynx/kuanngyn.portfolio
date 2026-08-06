import { codeToHtml } from 'shiki'

export async function highlightCode(
  code: string,
  language = 'text',
): Promise<string> {
  try {
    const html = await codeToHtml(code, {
      lang: language.toLowerCase() || 'text',
      theme: 'github-dark',
    })
    return html
  } catch {
    try {
      const fallbackHtml = await codeToHtml(code, {
        lang: 'text',
        theme: 'github-dark',
      })
      return fallbackHtml
    } catch {
      return `<pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`
    }
  }
}
