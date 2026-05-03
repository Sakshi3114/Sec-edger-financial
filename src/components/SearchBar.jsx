import { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';

function debounce(fn, delay) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

export default function SearchBar({ onSelect }) {
  const { searchCompanies, searchResults, searchLoading, searchError } = useApp();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Debounced search
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((q) => searchCompanies(q), 350),
    [searchCompanies]
  );

  useEffect(() => {
    if (query.trim().length >= 2) {
      debouncedSearch(query);
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [query, debouncedSearch]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSelect(company) {
    setQuery(company.name);
    setOpen(false);
    onSelect?.(company);
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-200 pointer-events-none">
          {searchLoading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" d="m21 21-4.35-4.35" />
            </svg>
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search by company name or ticker (e.g. Apple, AAPL)"
          className="input-dark w-full pl-12 pr-12 py-4 text-base"
          autoComplete="off"
          spellCheck={false}
        />

        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-200 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card overflow-hidden shadow-2xl shadow-black/50 z-50 animate-fade-in">
          {searchError ? (
            <div className="px-4 py-3 text-sm text-bear/80 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
              </svg>
              {searchError}
            </div>
          ) : searchResults.length === 0 && !searchLoading ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-ink-200">No companies found for "{query}"</p>
              <p className="text-xs text-ink-200/60 mt-1">Try searching by full name or ticker symbol</p>
            </div>
          ) : (
            <ul className="max-h-72 overflow-y-auto divide-y divide-white/5">
              {searchResults.map((company) => (
                <li key={company.cik}>
                  <button
                    onClick={() => handleSelect(company)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left group"
                  >
                    {/* Ticker Badge */}
                    <div className="flex-shrink-0 w-14 text-center">
                      <span className="font-mono text-xs font-medium text-ledger bg-ledger/10 border border-ledger/20 rounded px-2 py-0.5">
                        {company.ticker}
                      </span>
                    </div>

                    {/* Company Name */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate group-hover:text-ledger transition-colors">
                        {company.name}
                      </p>
                      <p className="text-xs text-ink-200 font-mono">CIK: {company.cik}</p>
                    </div>

                    {/* Arrow */}
                    <svg className="w-4 h-4 text-ink-200 group-hover:text-ledger transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
