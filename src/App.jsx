import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Bars from "./Bars";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function formatValue(value, suffix = "") {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "--";
  }

  return `${value.toFixed(2)}${suffix}`;
}

function Basix({ selectedSymbol, onSelectSymbol, companyProfiles }) {
  const [activeSymbol, setActiveSymbol] = useState(selectedSymbol);
  const [searchInput, setSearchInput] = useState(selectedSymbol);
  const [searchError, setSearchError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [closePrices, setClosePrices] = useState([]);
  const [dates, setDates] = useState([]);
  const [availableSymbols, setAvailableSymbols] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/symbols")
      .then((res) => {
        setAvailableSymbols(res.data.symbols || []);
      })
      .catch((err) => {
        console.error("Error fetching symbols:", err);
      });
  }, []);

  const fetchStockData = useCallback((targetSymbol) => {
    setIsLoading(true);
    setSearchError("");

    axios
      .get("http://localhost:5000/data", {
        params: { symbol: targetSymbol },
      })
      .then((res) => {
        const incomingPrices = Array.isArray(res.data.closePrices) ? res.data.closePrices : [];
        const incomingDates = Array.isArray(res.data.dates) ? res.data.dates : [];

        if (incomingPrices.length === 0) {
          setClosePrices([]);
          setDates([]);
          setSearchError(`No pricing data found for ${targetSymbol}.`);
          return;
        }

        setActiveSymbol(targetSymbol);
        setClosePrices(incomingPrices);
        setDates(incomingDates);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setSearchError(`Could not fetch data for ${targetSymbol}.`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchStockData(selectedSymbol);
  }, [fetchStockData, selectedSymbol]);

  const handleSearch = (e) => {
    e.preventDefault();
    const normalized = searchInput.trim().toUpperCase();

    if (!normalized) {
      setSearchError("Please enter a stock symbol.");
      return;
    }

    const supportedSymbols =
      availableSymbols.length > 0 ? availableSymbols : Object.keys(companyProfiles);
    if (!supportedSymbols.includes(normalized)) {
      const symbolList = supportedSymbols.slice(0, 6).join(", ");
      setSearchError(`Symbol "${normalized}" is unavailable. Try: ${symbolList}`);
      return;
    }

    if (normalized === selectedSymbol) {
      fetchStockData(normalized);
      return;
    }

    onSelectSymbol(normalized);
  };

  const labels = dates.length > 0 ? dates : closePrices.map((_, i) => `Day ${i + 1}`);
  const companyProfile = companyProfiles[activeSymbol] || {
    symbol: activeSymbol,
    name: activeSymbol,
    sector: "Sector data unavailable",
    headquarters: "HQ unavailable",
    marketCap: "N/A",
    description:
      "No additional company profile is currently available for this symbol. Revenue chart will show fallback values.",
    highlights: ["Profile details pending"],
    annualRevenue: [
      { year: "2023", value: 0.8 },
      { year: "2024", value: 0.9 },
      { year: "2025", value: 1.0 },
    ],
  };
  const quickSymbols = Object.keys(companyProfiles);

  const latestClose = closePrices.length ? closePrices[closePrices.length - 1] : null;
  const previousClose = closePrices.length > 1 ? closePrices[closePrices.length - 2] : null;
  const dayChange =
    latestClose !== null && previousClose !== null ? latestClose - previousClose : null;
  const dayChangePct =
    dayChange !== null && previousClose ? (dayChange / previousClose) * 100 : null;
  const periodLow = closePrices.length ? Math.min(...closePrices) : null;
  const periodHigh = closePrices.length ? Math.max(...closePrices) : null;
  const periodReturn =
    closePrices.length > 1 && closePrices[0] !== 0
      ? ((closePrices[closePrices.length - 1] - closePrices[0]) / closePrices[0]) * 100
      : null;

  const lineData = {
    labels,
    datasets: [
      {
        label: `${activeSymbol} Close Price`,
        data: closePrices,
        borderColor: "#00b39f",
        backgroundColor: "rgba(0, 179, 159, 0.25)",
        tension: 0.2,
        borderWidth: 3,
        pointBackgroundColor: "#0b1220",
        pointBorderColor: "#00b39f",
        pointRadius: closePrices.length > 60 ? 0 : 4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#0b1220",
          font: { weight: 600 },
        },
      },
      title: {
        display: true,
        text: `${activeSymbol} Closing Trend (${closePrices.length} Days)`,
        color: "#0b1220",
        font: { size: 16, weight: "bold" },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(11, 18, 32, 0.08)" },
        ticks: {
          color: "#3a4a68",
          maxTicksLimit: 12,
          maxRotation: 45,
        },
      },
      y: {
        grid: { color: "rgba(11, 18, 32, 0.08)" },
        ticks: { color: "#3a4a68" },
      },
    },
  };

  return (
    <section className="dashboard-wrap">
      <header className="dashboard-header">
        <h1>Stock Intelligence Command Center</h1>
        <p>
          Track market movement, business context, and annual revenue stories in one
          presentation-ready dashboard.
        </p>
        <form className="symbol-search" onSubmit={handleSearch}>
          <label htmlFor="symbol-search-input">Search Symbol</label>
          <div className="symbol-search-row">
            <input
              id="symbol-search-input"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="ITC, RELIANCE, TCS, INFY, BPCL..."
              maxLength={15}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>
          <div className="symbol-chip-row">
            {quickSymbols.map((ticker) => (
              <button
                className={`symbol-chip ${selectedSymbol === ticker ? "active" : ""}`}
                key={ticker}
                onClick={() => {
                  setSearchInput(ticker);
                  if (ticker === selectedSymbol) {
                    fetchStockData(ticker);
                    return;
                  }
                  onSelectSymbol(ticker);
                }}
                type="button"
              >
                {ticker}
              </button>
            ))}
          </div>
          {searchError && <p className="search-error">{searchError}</p>}
        </form>
      </header>

      <article className="company-profile-card">
        <div className="company-profile-head">
          <div>
            <h2>
              {companyProfile.name} <span className="symbol-badge">{companyProfile.symbol}</span>
            </h2>
            <p>
              {companyProfile.sector} • {companyProfile.headquarters}
            </p>
          </div>
          <span className="market-cap-badge">Market Cap: {companyProfile.marketCap}</span>
        </div>
        <p className="company-description">{companyProfile.description}</p>
        <div className="company-highlight-row">
          {companyProfile.highlights.map((highlight) => (
            <span className="highlight-tag" key={highlight}>
              {highlight}
            </span>
          ))}
        </div>
      </article>

      <div className="kpi-grid">
        <article className="kpi-card">
          <span>Latest Close</span>
          <strong>{formatValue(latestClose)}</strong>
          <p>Last recorded trading session</p>
        </article>
        <article className={`kpi-card ${dayChange !== null && dayChange >= 0 ? "rise" : "fall"}`}>
          <span>1-Day Change</span>
          <strong>
            {dayChange !== null ? `${dayChange >= 0 ? "+" : ""}${dayChange.toFixed(2)}` : "--"}
          </strong>
          <p>{dayChangePct !== null ? `${dayChangePct.toFixed(2)}%` : "--"}</p>
        </article>
        <article className="kpi-card">
          <span>Period Range</span>
          <strong>
            {formatValue(periodLow)} - {formatValue(periodHigh)}
          </strong>
          <p>Low to high in selected timeline</p>
        </article>
        <article className={`kpi-card ${periodReturn !== null && periodReturn >= 0 ? "rise" : "fall"}`}>
          <span>Total Return</span>
          <strong>{periodReturn !== null ? `${periodReturn.toFixed(2)}%` : "--"}</strong>
          <p>{closePrices.length} price points analyzed</p>
        </article>
      </div>

      <div className="charts-grid">
        <div className="panel panel-large">
          <div className="panel-head">
            <h2>Market Dashboard of {activeSymbol}</h2>
          </div>
          {closePrices.length > 0 ? (
            <div className="chart-shell">
              <Line options={lineOptions} data={lineData} />
            </div>
          ) : (
            <p className="loading-state">Loading line chart...</p>
          )}
        </div>

        <div className="panel panel-small">
          <div className="chart-shell">
            <Bars company={companyProfile} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Basix;
