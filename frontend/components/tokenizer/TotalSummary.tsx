import { formatCount } from "@/lib/formatters";

interface TotalSummaryProps {
  totalTokens: number;
  totalChars: number;
  encoding: string;
}

export function TotalSummary({ totalTokens, totalChars, encoding }: TotalSummaryProps) {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-blue-500">
            Total
          </p>
          <div className="mt-1 flex items-baseline gap-3">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold tabular-nums text-blue-700">
                {formatCount(totalTokens)}
              </span>
              <span className="text-sm text-blue-600">tokens</span>
            </div>
            <span className="text-gray-300">·</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-semibold tabular-nums text-gray-600">
                {formatCount(totalChars)}
              </span>
              <span className="text-sm text-gray-500">characters</span>
            </div>
          </div>
        </div>
        <div className="rounded-md bg-white border border-blue-100 px-3 py-1.5 text-xs font-mono text-gray-500">
          {encoding}
        </div>
      </div>
    </div>
  );
}
