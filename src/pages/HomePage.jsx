import { useNavigate } from "react-router-dom";
import SearchBar from "../components/search/SearchBar";
import { useApp } from "../context/AppContext";
import { POPULAR_COMPANIES } from "../constants";

export default function HomePage() {
  const { loadCompany } = useApp();
  const navigate = useNavigate();

  async function handleSelect(company) {
    await loadCompany(company);
    navigate("/dashboard");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          SEC Financial Explorer
        </h1>
        <p className="text-gray-500 text-base">
          Search any US public company and view their financial data straight
          from SEC EDGAR — revenue, assets, liabilities and more.
        </p>
      </div>

      <div className="mb-2">
        <SearchBar onSelect={handleSelect} />
      </div>
      <p className="text-xs text-gray-400 text-center mb-12">
        Try "Apple", "MSFT", or enter a CIK number
      </p>

      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-3">
          Popular companies
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {POPULAR_COMPANIES.map((company) => (
            <button
              key={company.cik}
              onClick={() => handleSelect(company)}
              className="card px-3 py-3 text-center hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <p className="text-xs font-semibold text-blue-600 mb-0.5">
                {company.ticker}
              </p>
              <p className="text-[10px] text-gray-500 truncate leading-snug">
                {company.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-500 text-center">
        Data sourced from the{" "}
        <a
          href="https://data.sec.gov"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          SEC EDGAR public API
        </a>{" "}
        — no authentication required.
      </div>
    </div>
  );
}
