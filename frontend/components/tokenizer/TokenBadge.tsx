import { TokenData } from "@/types/tokenizer";
import { getTokenColor } from "@/lib/tokenColors";

interface TokenBadgeProps {
  token: TokenData;
  showId: boolean;
}

export function TokenBadge({ token, showId }: TokenBadgeProps) {
  const colorClass = getTokenColor(token.index);

  // Render whitespace visually
  const display = token.text.replace(/ /g, "·").replace(/\n/g, "↵");

  return (
    <span
      className={`inline-flex flex-col items-center rounded border px-1.5 py-0.5 text-xs font-mono leading-tight ${colorClass}`}
      title={`Token ID: ${token.id}`}
    >
      <span className="whitespace-pre">{display || "␣"}</span>
      {showId && (
        <span className="mt-0.5 text-[10px] opacity-60">{token.id}</span>
      )}
    </span>
  );
}
