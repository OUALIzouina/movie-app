export default function ErrorBanner({ message, onRetry }) {
  if (!message) return null
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-velvet/50 bg-velvet/10 px-4 py-3 text-sm text-velvet-bright">
      <span>{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="whitespace-nowrap rounded border border-velvet/50 px-2 py-1 text-xs font-medium text-velvet-bright transition-colors hover:bg-velvet/20"
        >
          Try again
        </button>
      )}
    </div>
  )
}
