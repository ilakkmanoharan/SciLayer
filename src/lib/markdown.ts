import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";

/** Normalize manuscripts for GFM tables, math, and readable HTML output. */
export function prepareManuscriptMarkdown(markdown: string, options?: { title?: string }) {
  let md = markdown.replace(/\r\n/g, "\n").trim();

  if (options?.title) {
    md = stripDuplicateLeadTitle(md, options.title);
  }

  md = ensureBlankLinesBeforeTables(md);
  md = normalizeHorizontalRules(md);
  md = enhanceInlineMath(md);

  return md;
}

function stripDuplicateLeadTitle(md: string, pageTitle: string) {
  const lines = md.split("\n");
  if (!lines[0]?.startsWith("# ")) {
    return md;
  }

  const h1 = lines[0].replace(/^#\s+/, "").trim();
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

  const h1Norm = normalize(h1);
  const titleNorm = normalize(pageTitle);

  if (
    h1Norm === titleNorm ||
    h1Norm.startsWith(titleNorm.slice(0, 40)) ||
    titleNorm.startsWith(h1Norm.slice(0, 40))
  ) {
    let index = 1;
    while (
      index < lines.length &&
      (lines[index].trim() === "" ||
        lines[index].startsWith("**Author") ||
        lines[index].startsWith("**Affiliation") ||
        lines[index].startsWith("**Date") ||
        lines[index].startsWith("**Version"))
    ) {
      index += 1;
    }
    return lines.slice(index).join("\n").trim();
  }

  return md;
}

function ensureBlankLinesBeforeTables(md: string) {
  return md.replace(/\n(\|[^\n]+\|)\n(\|[-:\s|]+\|)/g, "\n\n$1\n$2");
}

function normalizeHorizontalRules(md: string) {
  return md.replace(/\n---\n/g, "\n\n---\n\n");
}

/** Wrap common ASRA notation in LaTeX math delimiters when not already inside code fences. */
function enhanceInlineMath(md: string) {
  const parts = md.split(/(```[\s\S]*?```)/g);

  return parts
    .map((part, index) => {
      if (index % 2 === 1) {
        return part;
      }

      return part
        .replace(/φ̂\(a \| s\)/g, "$\\hat{\\phi}(a \\mid s)$")
        .replace(/T\(s′ \| s, a\)/g, "$T(s' \\mid s, a)$")
        .replace(/T\(s' \| s, a\)/g, "$T(s' \\mid s, a)$")
        .replace(/\*s₁ ~ s₂ iff hash\(s₁\) = hash\(s₂\)\*/g, "$s_1 \\sim s_2$ iff $\\mathrm{hash}(s_1) = \\mathrm{hash}(s_2)$")
        .replace(/u\(s,a\)/g, (match, offset, str) =>
          isInsideMath(str, offset) ? match : "$u(s,a)$",
        )
        .replace(/c\(s,a\)/g, (match, offset, str) =>
          isInsideMath(str, offset) ? match : "$c(s,a)$",
        )
        .replace(/≤/g, "$\\leq$")
        .replace(/∈/g, "$\\in$");
    })
    .join("");
}

function isInsideMath(str: string, offset: number) {
  const before = str.slice(0, offset);
  const dollars = (before.match(/\$/g) ?? []).length;
  return dollars % 2 === 1;
}

export async function renderMarkdown(
  markdown: string,
  options?: { title?: string },
) {
  const prepared = prepareManuscriptMarkdown(markdown, options);

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeSlug)
    .use(rehypeKatex, { throwOnError: false, strict: false })
    .use(rehypeStringify)
    .process(prepared);

  return String(file);
}
