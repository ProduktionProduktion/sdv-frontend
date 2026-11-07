const VOID_TAGS = new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'source',
    'track',
    'wbr',
]);

const TOKENS = /(<!--[\s\S]*?-->)|<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*>|([^<]+)/g;

const addClass = (tag, className) => {
    const classAttr = /(\sclass=)(["'])(.*?)\2/i;

    if (classAttr.test(tag)) {
        return tag.replace(classAttr, (_, attr, quote, value) => `${attr}${quote}${value} ${className}${quote}`);
    }

    return tag.replace(/^<([a-zA-Z][a-zA-Z0-9-]*)/, `<$1 class="${className}"`);
};

/**
 * Adds a class to every top-level element of an HTML string and wraps loose
 * top-level text in a span. Mirrors the backend [mono] shortcode.
 */
export function addClassToTopLevel(html, className) {
    let depth = 0;

    return html.replace(TOKENS, (match, comment, closing, tagName, text) => {
        if (comment) {
            return match;
        }

        if (text !== undefined) {
            return depth === 0 && text.trim() ? `<span class="${className}">${text}</span>` : text;
        }

        if (closing) {
            depth = Math.max(0, depth - 1);
            return match;
        }

        const output = depth === 0 ? addClass(match, className) : match;

        if (!VOID_TAGS.has(tagName.toLowerCase()) && !match.endsWith('/>')) {
            depth++;
        }

        return output;
    });
}
