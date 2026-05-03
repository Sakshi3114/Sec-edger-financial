export default function ErrorCard({ error, onRetry }) {
  return (
    <div className="glass-card p-8 text-center animate-fade-in border-bear/20">
      <div className="w-14 h-14 rounded-full bg-bear/10 border border-bear/20 flex items-center justify-center mx-auto mb-4">
        <svg className="w-7 h-7 text-bear" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>

      <h3 className="font-display font-bold text-white text-lg mb-2">
        Failed to Load Data
      </h3>
      <p className="text-sm text-ink-200 max-w-md mx-auto mb-6 leading-relaxed">
        {error || 'An unexpected error occurred while fetching SEC EDGAR data.'}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onRetry && (
          <button onClick={onRetry} className="btn-primary">
            Try Again
          </button>
        )}
        <a
          href="https://www.sec.gov/cgi-bin/browse-edgar"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost text-center"
        >
          Open SEC EDGAR
        </a>
      </div>

      <p className="text-xs text-ink-200/40 mt-6 font-mono">
        SEC EDGAR may be temporarily unavailable or the company may not have XBRL filings
      </p>
    </div>
  );
}
