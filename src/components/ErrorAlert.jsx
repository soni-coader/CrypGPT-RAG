/**
 * Friendly "Agent unavailable" state when webhook/chat fails.
 * Replaces harsh red error screen with a clear, actionable UI.
 */
export function ErrorAlert({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="flex justify-center px-2 py-4">
      <div className="max-w-md w-full rounded-2xl border border-white/10 bg-[#2a2b2e] p-6 text-center shadow-lg">
        {/* Icon */}
        <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-amber-500/15 flex items-center justify-center">
          <svg
            className="w-7 h-7 text-amber-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
        </div>

        <h3 className="text-lg font-semibold text-white mb-1">
          Agent unavailable
        </h3>
        <p className="text-sm text-white/70 mb-5">
          We couldn&apos;t reach the assistant. Please check your connection and try again.
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try again
          </button>
        )}

        {import.meta.env.DEV && message && (
          <details className="mt-4 text-left">
            <summary className="text-xs text-white/50 cursor-pointer hover:text-white/70">
              Technical details
            </summary>
            <p className="mt-2 text-xs text-white/50 font-mono break-all">
              {message}
            </p>
          </details>
        )}
      </div>
    </div>
  );
}
