interface InsightCardProps {
  icon: string;
  title: string;
  body: string;
}

export function InsightCard({ icon, title, body }: InsightCardProps) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-3.5">
      <div className="flex items-start gap-2.5">
        <span className="text-base leading-none mt-0.5">{icon}</span>
        <div>
          <p className="text-sm font-semibold text-gray-800">{title}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{body}</p>
        </div>
      </div>
    </div>
  );
}
