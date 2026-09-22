// The description field on GET /products/:id comes back as Word-exported
// HTML that has been HTML-entity-escaped an extra time (so the string
// literally contains "&lt;p&gt;" rather than "<p>"), plus a lot of
// Office-specific junk (mso-* styles, <o:p> tags, Symbol bullet spans).
// This turns that into clean, safe-to-render markup.

const BLOCKED_TAGS = new Set([
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "link",
  "meta",
  "form",
  "input",
  "button",
]);

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "b",
  "strong",
  "i",
  "em",
  "u",
  "ul",
  "ol",
  "li",
  "span",
  "div",
  "a",
  "h1",
  "h2",
  "h3",
  "h4",
  "table",
  "thead",
  "tbody",
  "tr",
  "td",
  "th",
]);

function decodeEntities(html) {
  // A detached element never touches the document tree, so this can't
  // execute anything — it's purely an entity decoder.
  const box = document.createElement("textarea");
  box.innerHTML = html;
  return box.value;
}

/**
 * Decode the double-escaped entities, strip Office/Word cruft and anything
 * that isn't a plain content tag, and drop empty paragraphs — cheap enough
 * to run on every render, safe enough to feed to dangerouslySetInnerHTML.
 */
export function sanitizeProductDescription(raw) {
  if (!raw || typeof raw !== "string") return "";

  let html = decodeEntities(raw);

  // Word namespace tags: <o:p>...</o:p>, <w:...>, <m:...>
  html = html.replace(/<\/?[a-z]+:[a-z]+[^>]*>/gi, "");

  // Strip every attribute except href/src/alt/colspan/rowspan — this is
  // what removes the mso-list / Symbol-bullet / MsoNormal noise.
  html = html.replace(/<([a-z0-9]+)((?:\s+[a-z-]+(?:=(?:"[^"]*"|'[^']*'))?)*)\s*(\/?)>/gi,
    (match, tag, attrs, selfClose) => {
      const tagName = tag.toLowerCase();

      if (BLOCKED_TAGS.has(tagName)) return "";
      if (!ALLOWED_TAGS.has(tagName)) return "";

      const kept = [];
      const attrRe = /([a-z-]+)(?:=("([^"]*)"|'([^']*)'))?/gi;
      let attrMatch;

      while ((attrMatch = attrRe.exec(attrs))) {
        const name = attrMatch[1].toLowerCase();
        const value = attrMatch[3] ?? attrMatch[4] ?? "";

        if (name === "href" && tagName === "a") {
          if (/^\s*javascript:/i.test(value)) continue;
          kept.push(`href="${value}" target="_blank" rel="noopener noreferrer"`);
        } else if ((name === "colspan" || name === "rowspan") && /^\d+$/.test(value)) {
          kept.push(`${name}="${value}"`);
        }
      }

      return `<${tagName}${kept.length ? " " + kept.join(" ") : ""}${selfClose ? " /" : ""}>`;
    },
  );

  // Drop closing tags for anything we didn't allow through above.
  html = html.replace(/<\/([a-z0-9]+)>/gi, (match, tag) =>
    ALLOWED_TAGS.has(tag.toLowerCase()) ? match : "",
  );

  // Collapse empty paragraphs (Word loves leaving a page of them) and stray
  // whitespace runs left behind by the strips above.
  html = html
    .replace(/<p[^>]*>(\s|&nbsp;)*<\/p>/gi, "")
    .replace(/(\s|&nbsp;){3,}/g, " ")
    .trim();

  return html;
}

export function hasRenderableText(html) {
  return decodeEntities(html || "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim().length > 0;
}
