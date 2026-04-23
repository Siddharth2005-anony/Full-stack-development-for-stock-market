import React from "react";
import { COMPANY_LIST } from "./companyData";

function getLatestRevenue(company) {
  const { annualRevenue } = company;
  if (!annualRevenue.length) {
    return 0;
  }

  return annualRevenue[annualRevenue.length - 1].value;
}

function getYearlyGrowth(company) {
  const { annualRevenue } = company;
  if (annualRevenue.length < 2) {
    return 0;
  }

  const latest = annualRevenue[annualRevenue.length - 1].value;
  const previous = annualRevenue[annualRevenue.length - 2].value;
  if (!previous) {
    return 0;
  }

  return ((latest - previous) / previous) * 100;
}

export default function InsightsPage({
  companyProfiles,
  selectedSymbol,
  onSelectSymbol,
  onOpenDashboard,
}) {
  const rankedByRevenue = [...COMPANY_LIST].sort(
    (companyA, companyB) => getLatestRevenue(companyB) - getLatestRevenue(companyA)
  );
  const rankedByGrowth = [...COMPANY_LIST].sort(
    (companyA, companyB) => getYearlyGrowth(companyB) - getYearlyGrowth(companyA)
  );

  const topRevenueCompany = rankedByRevenue[0];
  const topGrowthCompany = rankedByGrowth[0];
  const selectedCompany = companyProfiles[selectedSymbol] || topRevenueCompany;
  const averageGrowth =
    rankedByGrowth.reduce((acc, company) => acc + getYearlyGrowth(company), 0) /
    rankedByGrowth.length;
  const benchmarkRevenue = getLatestRevenue(topRevenueCompany) || 1;

  return (
    <section className="insights-page">
      <header className="page-title">
        <h2>Portfolio Insights</h2>
        <p>
          Curated intelligence generated from the company dataset to help you narrate trends quickly.
        </p>
      </header>

      <div className="insights-kpi-grid">
        <article className="insight-kpi-card">
          <span>Largest Revenue Base</span>
          <strong>{topRevenueCompany.name}</strong>
          <p>₹{getLatestRevenue(topRevenueCompany).toFixed(2)}T in latest fiscal year</p>
        </article>

        <article className="insight-kpi-card">
          <span>Fastest YoY Growth</span>
          <strong>{topGrowthCompany.symbol}</strong>
          <p>{getYearlyGrowth(topGrowthCompany).toFixed(1)}% latest annual acceleration</p>
        </article>

        <article className="insight-kpi-card">
          <span>Average Revenue Growth</span>
          <strong>{averageGrowth.toFixed(1)}%</strong>
          <p>Across {rankedByGrowth.length} tracked companies</p>
        </article>
      </div>

      <div className="insights-panel-grid">
        <article className="insight-panel">
          <h3>Revenue League Table (Dummy Data)</h3>
          <ul className="insight-list">
            {rankedByRevenue.map((company) => {
              const latestRevenue = getLatestRevenue(company);
              const barWidth = Math.max((latestRevenue / benchmarkRevenue) * 100, 8);

              return (
                <li className="insight-item" key={company.symbol}>
                  <div className="insight-list-row">
                    <span>{company.symbol}</span>
                    <strong>₹{latestRevenue.toFixed(2)}T</strong>
                  </div>
                  <div className="insight-progress">
                    <span style={{ width: `${barWidth}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </article>

        <article className="insight-panel">
          <h3>{selectedCompany.name} Narrative</h3>
          <p>{selectedCompany.description}</p>

          <ul className="selected-insight-list">
            {selectedCompany.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>

          <button
            className="insight-action-btn"
            onClick={() => {
              onSelectSymbol(selectedCompany.symbol);
              if (onOpenDashboard) {
                onOpenDashboard();
              }
            }}
            type="button"
          >
            Open {selectedCompany.symbol} Dashboard
          </button>
        </article>
      </div>
    </section>
  );
}
