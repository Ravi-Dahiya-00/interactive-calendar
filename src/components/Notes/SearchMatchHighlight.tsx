// Highlights matching text in a note when the user types a search query.
// Wraps matching characters in a yellow highlight span.
import { memo } from 'react';

interface SearchMatchHighlightProps {
  text: string;
  query: string;
}

export function SearchMatchHighlight({ text, query }: SearchMatchHighlightProps) {
  if (!query.trim()) {
    return <>{text}</>;
  }

  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, 'gi'));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-cal-primary/20 text-cal-primary font-semibold rounded px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
