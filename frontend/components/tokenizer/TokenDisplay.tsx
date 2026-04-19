import { TokenData } from "@/types/tokenizer";
import { TokenBadge } from "./TokenBadge";

interface TokenDisplayProps {
  tokens: TokenData[];
  showIds: boolean;
  placeholder?: string;
}

export function TokenDisplay({ tokens, showIds, placeholder }: TokenDisplayProps) {
  if (tokens.length === 0) {
    return (
      <div className="flex min-h-[60px] items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-3">
        <p className="text-sm text-gray-400">{placeholder ?? "Tokens will appear here"}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 min-h-[60px]">
      {tokens.map((token) => (
        <TokenBadge key={token.index} token={token} showId={showIds} />
      ))}
    </div>
  );
}
