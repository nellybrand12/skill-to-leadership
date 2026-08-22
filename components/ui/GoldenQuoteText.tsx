import React from 'react';

interface GoldenQuoteTextProps {
  text: string;
  className?: string;
  goldClassName?: string;
}

/**
 * Renders quote text where any substring enclosed in double quotation marks
 * (e.g. "Skill" or "succès") is highlighted in the website's gold accent color,
 * while the remaining text is rendered in the default/parent text color.
 */
export function GoldenQuoteText({
  text,
  className = '',
  goldClassName = 'text-gold-700 font-bold',
}: GoldenQuoteTextProps) {
  if (!text) return null;

  // Split by double quotes: ("[^"]*")
  // Odd indexed elements will be the quoted portions (including quotes)
  const parts = text.split(/(".*?")/g);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('"') && part.endsWith('"')) {
          return (
            <span key={index} className={goldClassName}>
              {part}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}
