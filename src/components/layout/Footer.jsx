export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-12 py-6">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
        <p>
          Data from{' '}
          <a href="https://data.sec.gov" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            SEC EDGAR
          </a>{' '}
          — free public API, no auth required.
        </p>
        <p>Built with React + Vite</p>
      </div>
    </footer>
  );
}
