import { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { useDebounce } from "../../hooks/useDebounce";
import SearchDropdown from "./SearchDropdown";

export default function SearchBar({
  onSelect,
  placeholder = "Search company name or ticker...",
}) {
  const {
    searchCompanies,
    searchResults,
    searchLoading,
    searchError,
    clearSearch,
  } = useApp();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const debouncedQuery = useDebounce(query, 350);

  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      searchCompanies(debouncedQuery.trim());
      setOpen(true);
    } else {
      setOpen(false);
      clearSearch();
    }
  }, [debouncedQuery, searchCompanies, clearSearch]);

  useEffect(() => {
    function handleClick(e) {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(company) {
    setQuery(company.name);
    setOpen(false);
    onSelect?.(company);
  }

  function handleClear() {
    setQuery("");
    setOpen(false);
    clearSearch();
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {searchLoading ? (
            <svg className="w-4 h-4 spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" d="m21 21-4.35-4.35" />
            </svg>
          )}
        </span>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setOpen(true)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          placeholder={placeholder}
          className="input pl-10 pr-8"
          autoComplete="off"
          spellCheck={false}
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {open && (
        <SearchDropdown
          results={searchResults}
          loading={searchLoading}
          error={searchError}
          query={query}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
}
