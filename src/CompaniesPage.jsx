import React from "react";
import { COMPANY_LIST } from "./companyData";

export default function CompaniesPage({
  selectedSymbol,
  onSelectSymbol,
  onOpenDashboard,
}) {
  const openCompanyDashboard = (symbol) => {
    onSelectSymbol(symbol);
    if (onOpenDashboard) {
      onOpenDashboard();
    }
  };

  return (
    <section className="companies-page">
      <header className="page-title">
        <h2>Company Explorer</h2>
        <p>
          Compare strategy, market positioning, and annual revenue direction across major companies.
        </p>
      </header>

      <div className="companies-grid">
        {COMPANY_LIST.map((company) => {
          const isActive = company.symbol === selectedSymbol;

          return (
            <article className={`company-card ${isActive ? "active" : ""}`} key={company.symbol}>
              <div className="company-card-head">
                <div>
                  <h3>{company.name}</h3>
                  <p>{company.headquarters}</p>
                </div>
                <span className="symbol-badge">{company.symbol}</span>
              </div>

              <p className="company-card-description">{company.description}</p>

              <div className="company-meta-grid">
                <div>
                  <span>Sector</span>
                  <strong>{company.sector}</strong>
                </div>
                <div>
                  <span>Market Cap</span>
                  <strong>{company.marketCap}</strong>
                </div>
              </div>

              <div className="company-highlight-row">
                {company.highlights.slice(0, 2).map((highlight) => (
                  <span className="highlight-tag" key={highlight}>
                    {highlight}
                  </span>
                ))}
              </div>

              <button
                className="company-action-btn"
                onClick={() => openCompanyDashboard(company.symbol)}
                type="button"
              >
                Analyze {company.symbol}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
