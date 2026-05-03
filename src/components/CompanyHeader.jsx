import { useApp } from '../context/AppContext';

export default function CompanyHeader() {
  const { selectedCompany, companyInfo, clearCompany } = useApp();

  if (!selectedCompany) return null;

  const info = companyInfo;
  const sic = info?.sic;
  const sicDesc = info?.sicDescription;
  const state = info?.stateOfIncorporation;
  const exchanges = info?.exchanges?.filter(Boolean) || [];
  const filingCount = info?.filings?.recent?.form?.length || 0;
  const fiscalYearEnd = info?.fiscalYearEnd;

  function formatFiscalYear(fy) {
    if (!fy || fy.length !== 4) return fy;
    const month = parseInt(fy.slice(0, 2));
    const day = parseInt(fy.slice(2));
    return new Date(2000, month - 1, day).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  }

  return (
    <div className="glass-card p-5 sm:p-6 animate-fade-up">
      {/* Top Row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          {/* Company Initial Avatar */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-ledger/10 border border-ledger/20 flex items-center justify-center flex-shrink-0">
            <span className="font-display font-bold text-ledger text-xl">
              {selectedCompany.name.charAt(0)}
            </span>
          </div>

          <div className="min-w-0">
            <h2 className="font-display font-bold text-white text-xl sm:text-2xl truncate">
              {info?.name || selectedCompany.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {selectedCompany.ticker && (
                <span className="tag text-ledger border-ledger/20">
                  {selectedCompany.ticker}
                </span>
              )}
              {exchanges.slice(0, 1).map(ex => (
                <span key={ex} className="tag">{ex}</span>
              ))}
              {state && <span className="tag">{state}</span>}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={clearCompany}
          className="flex-shrink-0 p-2 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-ink-200 hover:text-white"
          title="Back to search"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Metadata Row */}
      <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'CIK', value: selectedCompany.cik },
          { label: 'SIC Code', value: sic ? `${sic} · ${sicDesc || ''}` : '—' },
          { label: 'Fiscal Year End', value: fiscalYearEnd ? formatFiscalYear(fiscalYearEnd) : '—' },
          { label: 'Total Filings', value: filingCount > 0 ? `${filingCount.toLocaleString()}+` : '—' },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="stat-label text-[9px]">{label}</p>
            <p className="font-mono text-xs text-white mt-0.5 truncate" title={String(value)}>
              {value || '—'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
