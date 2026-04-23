import React, { useEffect, useState } from "react";
import axios from "axios";

const api = "8de25e2061537f03700bacef79246730";
const url = `https://gnews.io/api/v4/top-headlines?category=business&lang=en&country=uk&max=6&apikey=${api}`;

const demoArticles = [
  {
    title: "Indian IT services firms increase AI-led enterprise transformation deals",
    description:
      "Large enterprises are accelerating automation, cloud migration, and AI modernization programs to improve efficiency and reduce long-term operating costs.",
    source: { name: "Demo Desk" },
    publishedAt: "2026-04-07T09:00:00Z",
    url: "https://example.com/it-services-ai",
  },
  {
    title: "Retail giants focus on premium product mix to improve margins",
    description:
      "Consumer demand in urban markets is shifting toward premium categories, helping companies improve blended margins despite moderate volume growth.",
    source: { name: "Demo Desk" },
    publishedAt: "2026-04-07T10:00:00Z",
    url: "https://example.com/retail-premiumization",
  },
  {
    title: "Energy sector outlines gradual transition toward low-carbon investments",
    description:
      "Oil and gas companies continue balancing legacy fuel businesses with renewables and cleaner mobility initiatives over the next decade.",
    source: { name: "Demo Desk" },
    publishedAt: "2026-04-07T11:00:00Z",
    url: "https://example.com/energy-transition",
  },
  {
    title: "Private banks expand digital onboarding and cross-sell platforms",
    description:
      "Improved mobile onboarding journeys and data-led personalization are helping banks improve customer retention and product penetration.",
    source: { name: "Demo Desk" },
    publishedAt: "2026-04-07T12:00:00Z",
    url: "https://example.com/banking-digital-onboarding",
  },
];

function formatPublishedDate(dateString) {
  if (!dateString) {
    return "Updated recently";
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "Updated recently";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Cards() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(url);
      const data = Array.isArray(response.data?.articles) ? response.data.articles : [];

      if (!data.length) {
        throw new Error("Live feed returned no stories.");
      }

      setArticles(data);
    } catch (err) {
      setError(`Live feed unavailable (${err.message}). Showing curated demo headlines.`);
      setArticles(demoArticles);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <section className="news-wrap">
      <div className="news-header">
        <h2>Top Business Headlines</h2>
        <button className="news-button" onClick={fetchNews} type="button">
          {isLoading ? "Refreshing..." : "Refresh News"}
        </button>
      </div>

      {error && <p className="news-error">{error}</p>}

      <div className="news-grid">
        {articles.map((article, index) => (
          <article className="news-card" key={`${article.title}-${index}`}>
            <p className="news-meta">
              <span>{article.source?.name || "News Desk"}</span>
              <span>{formatPublishedDate(article.publishedAt)}</span>
            </p>
            <h3>{article.title}</h3>
            <p>{article.description}</p>
            {article.url && (
              <a className="news-link" href={article.url} target="_blank" rel="noreferrer">
                Read full coverage
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
