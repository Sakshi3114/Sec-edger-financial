import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from "react";
import {
  fetchCompanyTickers,
  fetchCompanyFacts,
  fetchCompanySubmissions,
  searchFromTickers,
  extractMetricSeries,
} from "../utils/api";
import { METRIC_DEFS } from "../constants";

const init = {
  searchQuery: "",
  searchResults: [],
  searchLoading: false,
  searchError: null,

  company: null,
  companyInfo: null,
  metrics: {},

  loading: false,
  error: null,
  activeMetric: "revenue",
  activeTab: "overview",
};

const A = {
  SET_SEARCH_QUERY: "SET_SEARCH_QUERY",
  SET_SEARCH_RESULTS: "SET_SEARCH_RESULTS",
  SET_SEARCH_LOADING: "SET_SEARCH_LOADING",
  SET_SEARCH_ERROR: "SET_SEARCH_ERROR",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_COMPANY: "SET_COMPANY",
  SET_METRICS: "SET_METRICS",
  SET_ACTIVE_METRIC: "SET_ACTIVE_METRIC",
  SET_ACTIVE_TAB: "SET_ACTIVE_TAB",
  CLEAR_COMPANY: "CLEAR_COMPANY",
  CLEAR_SEARCH: "CLEAR_SEARCH",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case A.SET_SEARCH_QUERY:
      return { ...state, searchQuery: payload };
    case A.SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: payload,
        searchLoading: false,
        searchError: null,
      };
    case A.SET_SEARCH_LOADING:
      return { ...state, searchLoading: payload };
    case A.SET_SEARCH_ERROR:
      return { ...state, searchError: payload, searchLoading: false };
    case A.SET_LOADING:
      return { ...state, loading: payload, error: null };
    case A.SET_ERROR:
      return { ...state, error: payload, loading: false };
    case A.SET_COMPANY:
      return {
        ...state,
        company: payload.company,
        companyInfo: payload.info,
        loading: false,
        error: null,
      };
    case A.SET_METRICS:
      return { ...state, metrics: payload };
    case A.SET_ACTIVE_METRIC:
      return { ...state, activeMetric: payload };
    case A.SET_ACTIVE_TAB:
      return { ...state, activeTab: payload };
    case A.CLEAR_COMPANY:
      return {
        ...state,
        company: null,
        companyInfo: null,
        metrics: {},
        error: null,
        activeTab: "overview",
      };
    case A.CLEAR_SEARCH:
      return {
        ...state,
        searchQuery: "",
        searchResults: [],
        searchError: null,
      };
    default:
      return state;
  }
}

const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, init);

  const tickersCacheRef = useRef(null);

  const searchCompanies = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      dispatch({ type: A.SET_SEARCH_RESULTS, payload: [] });
      return;
    }

    dispatch({ type: A.SET_SEARCH_LOADING, payload: true });
    dispatch({ type: A.SET_SEARCH_QUERY, payload: query });

    try {
      if (!tickersCacheRef.current) {
        tickersCacheRef.current = await fetchCompanyTickers();
      }

      const results = searchFromTickers(tickersCacheRef.current, query.trim());
      dispatch({ type: A.SET_SEARCH_RESULTS, payload: results });
    } catch (err) {
      dispatch({ type: A.SET_SEARCH_ERROR, payload: err.message });
    }
  }, []);

  const loadCompany = useCallback(async (company) => {
    dispatch({ type: A.SET_LOADING, payload: true });
    dispatch({ type: A.CLEAR_COMPANY });

    try {
      const [rawInfo, facts] = await Promise.all([
        fetchCompanySubmissions(company.cik),
        fetchCompanyFacts(company.cik),
      ]);

      const companyInfo = {
        name: rawInfo.name,
        cik: rawInfo.cik,
        sic: rawInfo.sic,
        sicDescription: rawInfo.sicDescription,
        stateOfIncorporation: rawInfo.stateOfIncorporation,
        exchanges: rawInfo.exchanges ?? [],
        fiscalYearEnd: rawInfo.fiscalYearEnd,
        filingCount: rawInfo.filings?.recent?.form?.length ?? 0,
      };

      dispatch({
        type: A.SET_COMPANY,
        payload: { company, info: companyInfo },
      });

      const processed = {};

      for (const [key, def] of Object.entries(METRIC_DEFS)) {
        const preferredUnit = def.format === "decimal" ? "USD/shares" : "USD";

        const series = extractMetricSeries(facts, def.tags, preferredUnit);
        if (series.length === 0) continue;
        console.log("Series", series);
        const latest = series[series.length - 1];
        console.log(latest);
        const prev = series.length >= 2 ? series[series.length - 2] : null;
        const growth =
          prev?.value != null
            ? ((latest.value - prev.value) / Math.abs(prev.value)) * 100
            : null;

        processed[key] = { series, latest, growth };
      }

      dispatch({ type: A.SET_METRICS, payload: processed });
    } catch (err) {
      dispatch({ type: A.SET_ERROR, payload: err.message });
    }
  }, []);

  const setActiveMetric = useCallback(
    (m) => dispatch({ type: A.SET_ACTIVE_METRIC, payload: m }),
    []
  );
  const setActiveTab = useCallback(
    (t) => dispatch({ type: A.SET_ACTIVE_TAB, payload: t }),
    []
  );
  const clearCompany = useCallback(
    () => dispatch({ type: A.CLEAR_COMPANY }),
    []
  );
  const clearSearch = useCallback(() => dispatch({ type: A.CLEAR_SEARCH }), []);

  return (
    <Ctx.Provider
      value={{
        ...state,
        searchCompanies,
        loadCompany,
        setActiveMetric,
        setActiveTab,
        clearCompany,
        clearSearch,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
