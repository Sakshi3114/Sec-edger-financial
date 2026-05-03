export default function SearchDropdown({
  results,
  loading,
  error,
  query,
  onSelect,
}) {
  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden">
      {error && <div className="px-4 py-3 text-sm text-red-600">{error}</div>}

      {!error && !loading && results.length === 0 && (
        <div className="px-4 py-6 text-center text-sm text-gray-500">
          No results for &quot;{query}&quot;
        </div>
      )}

      {results.length > 0 && (
        <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100">
          {results.map((company) => (
            <li key={company.cik}>
              <button
                onClick={() => onSelect(company)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 text-left"
              >
                <span className="text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded w-16 text-center shrink-0">
                  {company.ticker}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {company.name}
                  </p>
                  <p className="text-xs text-gray-400">CIK: {company.cik}</p>
                </div>
                <svg
                  className="w-4 h-4 text-gray-400 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
