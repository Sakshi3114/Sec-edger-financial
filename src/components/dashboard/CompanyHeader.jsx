import { useApp } from "../../context/AppContext";
import { formatFYE } from "../../utils/api";

export default function CompanyHeader() {
  const { company, companyInfo: info, clearCompany } = useApp();
  if (!company) return null;

  const name = info?.name || company.name;
  const exchange = info?.exchanges?.[0] || null;

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0">
            <span className="text-blue-700 font-bold text-lg">
              {name.charAt(0)}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
            <div className="flex flex-wrap gap-2 mt-1">
              {company.ticker && (
                <span className="text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                  {company.ticker}
                </span>
              )}
              {exchange && (
                <span className="text-xs text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded">
                  {exchange}
                </span>
              )}
              {info?.stateOfIncorporation && (
                <span className="text-xs text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded">
                  {info.stateOfIncorporation}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={clearCompany}
          className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 shrink-0"
          title="Clear"
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
      </div>

      <div className="border-t border-gray-100 mt-4 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "CIK", value: company.cik },
          {
            label: "SIC",
            value: info?.sic
              ? `${info.sic} — ${info.sicDescription || ""}`
              : "—",
          },
          {
            label: "Fiscal Year End",
            value: info?.fiscalYearEnd ? formatFYE(info.fiscalYearEnd) : "—",
          },
          {
            label: "Total Filings",
            value: info?.filingCount ? `${info.filingCount}+` : "—",
          },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
              {label}
            </p>
            <p
              className="text-xs text-gray-700 font-medium truncate"
              title={String(value)}
            >
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
