import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-gray-900 text-lg">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          SEC Explorer
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              pathname === '/' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              pathname === '/dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Dashboard
          </Link>
          <a
            href="https://www.sec.gov/developer"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            SEC EDGAR ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
