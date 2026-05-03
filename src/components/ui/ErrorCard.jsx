export default function ErrorCard({ error, onRetry }) {
  return (
    <div className="card p-8 text-center max-w-lg mx-auto">
      <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4">
        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        </svg>
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">Failed to load data</h3>
      <p className="text-sm text-gray-500 mb-5">
        {error || 'Something went wrong while fetching SEC EDGAR data.'}
      </p>
      <div className="flex gap-3 justify-center">
        {onRetry && (
          <button onClick={onRetry} className="btn-primary">
            Try again
          </button>
        )}
        <a
          href="https://www.sec.gov/cgi-bin/browse-edgar"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
        >
          Open SEC EDGAR
        </a>
      </div>
      <p className="text-xs text-gray-400 mt-4">
        Note: not all companies have XBRL filings available.
      </p>
    </div>
  );
}
