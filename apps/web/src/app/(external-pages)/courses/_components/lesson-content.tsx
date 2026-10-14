// Tiny dependency-free renderer for the lesson body format used in the seed:
// paragraphs separated by blank lines, `## ` subheadings, `- ` list items,
// **bold** and `code` inline.

function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={key} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={key}
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={key}>{part}</span>;
  });
}

export function LessonContent({ content }: { content: string }) {
  const blocks = content.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const elements: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="my-4 list-disc space-y-2 pl-6">
          {listBuffer.map((item, i) => (
            <li key={i} className="leading-7 text-muted-foreground">
              {renderInline(item, `li-${elements.length}-${i}`)}
            </li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  };

  blocks.forEach((block, bi) => {
    if (block.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={bi} className="mt-8 mb-3 text-2xl font-bold tracking-tight">
          {renderInline(block.slice(3), `h2-${bi}`)}
        </h2>
      );
    } else if (/^[-•] /.test(block) || block.split('\n').every((l) => /^[-•] /.test(l.trim()))) {
      block.split('\n').forEach((line) => {
        const t = line.trim().replace(/^[-•] /, '');
        if (t) listBuffer.push(t);
      });
    } else {
      flushList();
      elements.push(
        <p key={bi} className="my-4 leading-7 text-muted-foreground">
          {renderInline(block.replace(/\n/g, ' '), `p-${bi}`)}
        </p>
      );
    }
  });
  flushList();

  return <div className="prose-fix">{elements}</div>;
}
