# SEC Financial Explorer

A clean, responsive financial data explorer that fetches real company data from the [SEC EDGAR API](https://www.sec.gov/developer), displays interactive charts, and lets users explore key financial metrics for any publicly traded US company.

**Live Demo:** https://sec-edger-financial.vercel.app/

---

## Features

- 🔍 **Search** any public company by name, ticker symbol, or CIK number
- 📊 **8 financial metrics** — Revenue, Net Income, Total Assets, Liabilities, Equity, Operating Income, EPS, Cash
- 📈 **Interactive charts** (Area + Bar) with Recharts — up to 10 years of annual data
- 📋 **Data table** with YoY growth calculations per metric
- ⚡ **Real-time** SEC EDGAR XBRL data (no API key required)
- 💾 **15 popular companies** as quick-access shortcuts
- 🌐 Fully responsive — mobile, tablet, and desktop

---

## Tech Stack

| Layer     | Choice                    | Why                                     |
| --------- | ------------------------- | --------------------------------------- |
| Framework | React 18 + Vite           | Fast HMR, modern bundler                |
| Styling   | Tailwind CSS v3           | Utility-first, consistent design system |
| State     | Context API + useReducer  | Built-in, no extra deps for this scale  |
| Routing   | React Router v6           | SPA multi-page navigation               |
| Charts    | Recharts                  | Composable, works great with React      |
| API       | SEC EDGAR (free, no auth) | Official US regulatory data             |

---

## Setup

```bash
# 1. Clone the repo
git clone https://github.com/your-username/sec-financial-explorer.git
cd sec-financial-explorer

# 2. Install dependencies
npm install

# 3. Start dev server (Vite proxy handles CORS for SEC EDGAR)
npm run dev

# 4. Open http://localhost:5173
```

### Building for Production

```bash
npm run build
# Output in /dist — deploy to Vercel, Netlify, or Render
```

### Deployment (Vercel)

```bash
npm i -g vercel
vercel --prod
```

For Vercel add a `vercel.json` with rewrite rules to proxy SEC EDGAR (see notes below).

---

## API Usage

This app uses two SEC EDGAR endpoints — **no authentication or API key required**:

```
# Company financial facts (XBRL)
https://data.sec.gov/api/xbrl/companyfacts/CIK{10-digit-CIK}.json

# Company metadata & filings list
https://data.sec.gov/submissions/CIK{10-digit-CIK}.json

# All company tickers (for search)
https://data.sec.gov/files/company_tickers.json
```

> **Required:** The SEC EDGAR API requires a `User-Agent` header identifying your app. Vite's dev proxy adds this automatically.

---

## Project Structure

```
src/
├── context/
│   └── AppContext.jsx      # Global state (Context API + useReducer)
├── components/
│   ├── Header.jsx          # Top navigation
│   ├── SearchBar.jsx       # Debounced company search with autocomplete
│   ├── CompanyHeader.jsx   # Company metadata display
│   ├── MetricsGrid.jsx     # KPI cards grid
│   ├── FinancialChart.jsx  # Area/Bar chart (Recharts)
│   ├── DataTable.jsx       # Historical data table with YoY
│   ├── ErrorCard.jsx       # Error state UI
│   └── Skeleton.jsx        # Loading skeletons
├── pages/
│   ├── HomePage.jsx        # Search + popular companies
│   └── DashboardPage.jsx   # Company financial dashboard
├── utils/
│   └── api.js              # SEC EDGAR fetch helpers + formatters
└── constants/
    └── index.js            # CIK list, metric definitions, colors
```

---

## Known Limitations

- **CORS in production:** SEC EDGAR doesn't send CORS headers for browser requests. Vite's dev proxy works locally. For production, you need a server-side proxy or a Cloudflare Worker / Vercel Edge Function as a middleware.
- **Data availability:** Not all companies have XBRL-tagged filings (especially older or smaller companies). The app gracefully handles missing data.
- **Annual only:** Currently shows 10-K (annual) filings only. Quarterly (10-Q) data is available from the same API but not yet implemented.
- **EPS unit mismatch:** Some companies report EPS in `USD/shares` vs `USD` — the extractor handles common cases but edge cases may show no data.
- **Rate limiting:** SEC EDGAR asks for ≤10 requests/second. The app doesn't currently throttle parallel searches.

---

## Git Workflow

```
main          ← protected, production
  └── dev     ← development branch (PR → main)
        └── feature/sec-app  ← feature branch
```

---

## License

MIT
