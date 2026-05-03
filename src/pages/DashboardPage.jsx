import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import SearchBar from "../components/search/SearchBar";
import CompanyHeader from "../components/dashboard/CompanyHeader";
import MetricsGrid from "../components/dashboard/MetricsGrid";
import FinancialChart from "../components/dashboard/FinancialChart";
import DataTable from "../components/dashboard/DataTable";
import TabNav from "../components/dashboard/TabNav";
import ErrorCard from "../components/ui/ErrorCard";
import EmptyState from "../components/ui/EmptyState";
import { DashboardSkeleton } from "../components/ui/Skeleton";
import { METRIC_DEFS } from "../constants";

export default function DashboardPage() {
  const {
    company,
    loading,
    error,
    metrics,
    activeMetric,
    activeTab,
    setActiveMetric,
    loadCompany,
  } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!company && !loading && !error) navigate("/");
  }, [company, loading, error, navigate]);

  const available = Object.keys(METRIC_DEFS).filter((k) => metrics[k]?.latest);

  function MetricPicker() {
    return (
      <div className="flex flex-wrap gap-2">
        {available.map((key) => (
          <button
            key={key}
            onClick={() => setActiveMetric(key)}
            className={`text-xs px-3 py-1.5 rounded border font-medium transition-colors ${
              activeMetric === key
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            {METRIC_DEFS[key].label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Top search */}
      <div className="mb-5 max-w-lg">
        <SearchBar onSelect={(c) => loadCompany(c)} />
      </div>

      {loading && <DashboardSkeleton />}

      {!loading && error && (
        <ErrorCard
          error={error}
          onRetry={company ? () => loadCompany(company) : undefined}
        />
      )}

      {!loading && !error && !company && (
        <EmptyState
          title="No company selected"
          description="Use the search bar above to find a company."
          action={
            <button onClick={() => navigate("/")} className="btn-primary">
              Back to search
            </button>
          }
        />
      )}

      {!loading && !error && company && (
        <div className="space-y-5">
          <CompanyHeader />
          <TabNav />

          {activeTab === "overview" && (
            <div className="space-y-5">
              <MetricsGrid />
              {available.length > 0 && (
                <>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs text-gray-500 font-medium">
                      Chart:
                    </span>
                    <MetricPicker />
                  </div>
                  <FinancialChart />
                </>
              )}
            </div>
          )}

          {activeTab === "charts" && (
            <div className="space-y-4">
              <MetricPicker />
              <FinancialChart />
            </div>
          )}

          {activeTab === "table" && (
            <div className="space-y-4">
              <MetricPicker />
              <DataTable />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
