import { formatCount } from "@/lib/formatters";

interface TokenStatsProps {
  tokenCount: number;
  charCount: number;
}

export function TokenStats({ tokenCount, charCount }: TokenStatsProps) {
  return (
    <div className="flex items-center gap-4">
      <Stat label="Tokens" value={tokenCount} accent />
      <Stat label="Characters" value={charCount} />
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span
        className={`text-lg font-bold tabular-nums ${
          accent ? "text-blue-600" : "text-gray-700"
        }`}
      >
        {formatCount(value)}
      </span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}
