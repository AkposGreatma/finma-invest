import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import PerformanceChart from "../components/PerformanceChart";
import AssetAllocationChart from "../components/AssetAllocationChart";
import {
  getAnalyticsSummary,
  getInsights,
  getMarketNews,
} from "../services/api";
import { useNavigate } from "react-router-dom";
import MobileBottomNav from "../components/MobileBottomNav";
import { useTheme } from "../context/ThemeContext";

function Dashboard() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [analytics, setAnalytics] = useState(null);
  const [insights, setInsights] = useState([]);
  const [marketNews, setMarketNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);

  const navigate = useNavigate();
  const { colors, theme } = useTheme();

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isTablet = screenWidth <= 1024;
  const isMobile = screenWidth <= 768;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, insightsRes, newsRes] = await Promise.all([
          getAnalyticsSummary(),
          getInsights(),
          getMarketNews(),
        ]);

        setAnalytics(summaryRes.data);
        setInsights(insightsRes.data);
        setMarketNews(newsRes.data);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setNewsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const style = document.createElement("style");

    style.innerHTML = `
      @keyframes shimmer {
        0% { background-position: 100% 0 }
        100% { background-position: -100% 0 }
      }
    `;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div
      style={{
        ...styles.container,
        background: colors.page,
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      {!isMobile && <Sidebar />}

      <main style={{ ...styles.main, background: colors.page }}>
        <Navbar />

        <div
          style={{
            ...styles.content,
            padding: isMobile ? "20px 20px 96px" : "30px",
          }}
        >
          <section
            style={{
              ...styles.heroSection,
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
            }}
          >
            <div>
              <h1
                style={{
                  ...styles.pageTitle,
                  fontSize: isMobile ? "24px" : "32px",
                  color: colors.text,
                }}
              >
                Investment Analytics Overview
              </h1>

              <p style={{ ...styles.pageText, color: colors.muted }}>
                Track portfolio performance, monitor asset allocation, and
                uncover meaningful investment insights.
              </p>
            </div>

            <div
              style={{
                ...styles.heroActions,
                width: isMobile ? "100%" : "auto",
              }}
            >
              <button
                onClick={() => navigate("/portfolio")}
                style={styles.portfolioButton}
              >
                View Portfolio
              </button>

              <div
                style={{
                  ...styles.heroBadge,
                  background: colors.card,
                  border: `1px solid ${colors.border}`,
                  color: colors.text,
                }}
              >
                <span style={styles.heroDot}></span>
                Live Portfolio Snapshot
              </div>
            </div>
          </section>

          <section style={styles.section}>
            <div
              style={{
                ...styles.kpiGrid,
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : isTablet
                  ? "repeat(2, 1fr)"
                  : "repeat(auto-fit, minmax(220px, 1fr))",
              }}
            >
              <div
                style={{
                  ...styles.kpiCard,
                  background: colors.card,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <p style={{ ...styles.kpiLabel, color: colors.muted }}>
                  📊 Portfolio Value
                </p>
                <h2 style={{ ...styles.kpiValue, color: colors.text }}>
                  ₦{analytics?.portfolioValue?.toLocaleString() || "0"}
                </h2>
              </div>

              <div
                style={{
                  ...styles.kpiCard,
                  background: colors.card,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <p style={{ ...styles.kpiLabel, color: colors.muted }}>
                  📈 Profit / Loss
                </p>
                <h2
                  style={{
                    ...styles.kpiValue,
                    color: analytics?.profitLoss >= 0 ? "#10B981" : "#EF4444",
                  }}
                >
                  ₦{analytics?.profitLoss?.toLocaleString() || "0"}
                </h2>
              </div>

              <div
                style={{
                  ...styles.kpiCard,
                  background: colors.card,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <p style={{ ...styles.kpiLabel, color: colors.muted }}>
                  🚀 Monthly Growth
                </p>
                <h2 style={{ ...styles.kpiValue, color: colors.text }}>
                  {analytics?.monthlyGrowth || "0%"}
                </h2>
              </div>

              <div
                style={{
                  ...styles.kpiCard,
                  background: colors.card,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <p style={{ ...styles.kpiLabel, color: colors.muted }}>
                  🏆 Best Asset
                </p>
                <h2 style={{ ...styles.kpiValue, color: colors.text }}>
                  {analytics?.bestAsset || "-"}
                </h2>
              </div>
            </div>
          </section>

          <section style={styles.section}>
            <h3 style={{ ...styles.sectionTitle, color: colors.text }}>
              Performance Overview
            </h3>

            <div
              style={{
                ...styles.chartGrid,
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              }}
            >
              <div
                style={{
                  ...styles.chartCard,
                  background: colors.card,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <p style={{ ...styles.chartTitle, color: colors.muted }}>
                  Portfolio Trend
                </p>
                <div
                  style={{
                    ...styles.chartContainer,
                    height: isMobile ? "260px" : "300px",
                  }}
                >
                  <PerformanceChart />
                </div>
              </div>

              <div
                style={{
                  ...styles.chartCard,
                  background: colors.card,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <p style={{ ...styles.chartTitle, color: colors.muted }}>
                  Asset Allocation
                </p>
                <div
                  style={{
                    ...styles.allocationContainer,
                    height: isMobile ? "260px" : "300px",
                  }}
                >
                  <AssetAllocationChart />
                </div>
              </div>
            </div>
          </section>

          <section style={styles.section}>
            <h3 style={{ ...styles.sectionTitle, color: colors.text }}>
              Insights
            </h3>

            <div
              style={{
                ...styles.insightCard,
                background: colors.card,
                border: `1px solid ${colors.border}`,
              }}
            >
              {insights.length > 0 ? (
                insights.map((insight, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.insightItem,
                      background: theme === "dark" ? "#1E293B" : "#F8FAFC",
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <p style={styles.insightLabel}>💡 {insight.label}</p>
                    <p style={{ ...styles.insightText, color: colors.text }}>
                      {insight.text}
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ ...styles.emptyInsightText, color: colors.muted }}>
                  No insights yet.
                </p>
              )}
            </div>
          </section>

          <section style={styles.section}>
            <h3 style={{ ...styles.sectionTitle, color: colors.text }}>
              Market News
            </h3>

            <div style={styles.newsGrid}>
              {newsLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} style={styles.newsSkeleton}></div>
                  ))
                : marketNews.map((article, index) => (
                    <div
                      key={index}
                      style={{
                        ...styles.newsCard,
                        background: colors.card,
                        border: `1px solid ${colors.border}`,
                      }}
                      onClick={() => window.open(article.url, "_blank")}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow =
                          "0 12px 28px rgba(15, 23, 42, 0.12)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 6px 16px rgba(15, 23, 42, 0.05)";
                      }}
                    >
                      {article.imageUrl && (
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          style={styles.newsImage}
                        />
                      )}

                      <p style={{ ...styles.newsTitle, color: colors.text }}>
                        {article.title}
                      </p>

                      <p style={{ ...styles.newsMeta, color: colors.muted }}>
                        {article.source} •{" "}
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
            </div>
          </section>
        </div>

        {isMobile && <MobileBottomNav />}
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    fontFamily: "Inter, sans-serif",
    width: "100%",
    overflowX: "hidden",
  },

  main: {
    flex: 1,
    minHeight: "100vh",
    minWidth: 0,
  },

  content: {
    padding: "30px",
    width: "100%",
    boxSizing: "border-box",
  },

  heroSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "26px",
    gap: "20px",
    flexWrap: "wrap",
  },

  heroActions: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
  },

  pageTitle: {
    fontSize: "32px",
    margin: 0,
    marginBottom: "8px",
    letterSpacing: "-0.6px",
  },

  pageText: {
    fontSize: "15px",
    margin: 0,
    lineHeight: "1.6",
    maxWidth: "680px",
  },

  portfolioButton: {
    padding: "10px 16px",
    backgroundColor: "#10B981",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    boxShadow: "0 10px 20px rgba(16, 185, 129, 0.16)",
  },

  heroBadge: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderRadius: "999px",
    padding: "12px 16px",
    fontSize: "14px",
    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.04)",
  },

  heroDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#10B981",
  },

  section: {
    marginBottom: "30px",
  },

  sectionTitle: {
    fontSize: "18px",
    margin: "0 0 14px 0",
    letterSpacing: "-0.2px",
  },

  kpiGrid: {
    display: "grid",
    gap: "20px",
  },

  kpiCard: {
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
    minWidth: 0,
  },

  kpiLabel: {
    fontSize: "13px",
    marginBottom: "8px",
  },

  kpiValue: {
    margin: 0,
    fontSize: "26px",
    fontWeight: "700",
    lineHeight: "1.3",
    wordBreak: "break-word",
  },

  chartGrid: {
    display: "grid",
    gap: "20px",
    width: "100%",
  },

  chartCard: {
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
    minWidth: 0,
  },

  chartTitle: {
    fontSize: "14px",
    margin: "0 0 10px 0",
    fontWeight: "600",
  },

  chartContainer: {
    height: "300px",
  },

  allocationContainer: {
    height: "300px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  insightCard: {
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
  },

  insightItem: {
    borderRadius: "14px",
    padding: "16px",
    marginBottom: "14px",
  },

  insightLabel: {
    margin: "0 0 8px 0",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    color: "#10B981",
  },

  insightText: {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.7",
  },

  emptyInsightText: {
    margin: 0,
    fontSize: "14px",
  },

  newsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
  },

  newsCard: {
    borderRadius: "16px",
    padding: "14px",
    cursor: "pointer",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
    boxShadow: "0 6px 16px rgba(15, 23, 42, 0.05)",
  },

  newsImage: {
    width: "100%",
    height: "130px",
    objectFit: "cover",
    borderRadius: "12px",
    marginBottom: "12px",
    background: "#F1F5F9",
  },

  newsTitle: {
    margin: "0 0 10px 0",
    fontSize: "14px",
    fontWeight: "700",
    lineHeight: "1.5",
  },

  newsMeta: {
    margin: 0,
    fontSize: "12px",
  },

  newsSkeleton: {
    height: "110px",
    borderRadius: "16px",
    background:
      "linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 37%, #F1F5F9 63%)",
    backgroundSize: "400% 100%",
    animation: "shimmer 1.4s ease infinite",
  },
};

export default Dashboard;