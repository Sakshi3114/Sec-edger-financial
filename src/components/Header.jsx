import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-ink-500/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-ledger/20 border border-ledger/30 flex items-center justify-center group-hover:bg-ledger/30 transition-colors">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-4 h-4"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                className="stroke-ledger"
                d="M3 3h18v18H3zM3 9h18M9 9v12M15 3v6"
              />
            </svg>
          </div>
          <div>
            <span className="font-display font-bold text-white text-lg leading-none">
              SEC
            </span>
            <span className="font-display text-ledger text-lg leading-none ml-1">
              Explorer
            </span>
          </div>
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/"
                ? "bg-white/10 text-white"
                : "text-ink-200 hover:text-white hover:bg-white/5"
            }`}
          >
            Home
          </Link>
          <a
            href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg text-sm font-medium text-ink-200 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
          >
            SEC EDGAR
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-ledger animate-pulse-soft" />
          <span className="text-xs font-mono text-ink-200 hidden sm:block">
            Live Data
          </span>
        </div>
      </div>
    </header>
  );
}
