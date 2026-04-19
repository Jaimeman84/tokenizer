interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <svg
        className="mt-0.5 h-4 w-4 shrink-0"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9v4h2V9H9zm0-1h2V7H9v1z"
          clipRule="evenodd"
        />
      </svg>
      <div>
        <p className="font-medium">Tokenizer unavailable</p>
        <p className="text-red-600">{message}</p>
        <p className="mt-1 text-red-500">
          Make sure the Python backend is running on{" "}
          <code className="font-mono text-xs">localhost:8000</code>.
        </p>
      </div>
    </div>
  );
}
