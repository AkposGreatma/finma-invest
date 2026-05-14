import React, { useEffect, useMemo, useState } from "react";
import {
  getUserPortfolio,
  addInvestment,
  getAvailableInvestments,
} from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import MobileBottomNav from "../components/MobileBottomNav";
import { useTheme } from "../context/ThemeContext";

function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [availableInvestments, setAvailableInvestments] = useState([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const [formData, setFormData] = useState({
    investment_id: "",
    amount_invested: "",
    units_owned: "",
  });

  const { colors } = useTheme();

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenWidth <= 768;

  const fetchPortfolioData = async () => {
    try {
      const [portfolioRes, investmentsRes] = await Promise.all([
        getUserPortfolio(),
        getAvailableInvestments(),
      ]);

      setPortfolio(portfolioRes.data);
      setAvailableInvestments(investmentsRes.data);
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await addInvestment(formData);
      alert(res.data.message || "Investment added!");

      setFormData({
        investment_id: "",
        amount_invested: "",
        units_owned: "",
      });

      await fetchPortfolioData();
    } catch (error) {
      console.error("Error adding investment:", error);
      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to add investment"
      );
    }
  };

  const totalInvested = useMemo(() => {
    return portfolio.reduce(
      (sum, item) => sum + Number(item.amount_invested || 0),
      0
    );
  }, [portfolio]);

  const holdingsCount = portfolio.length;

  const assetTypesCount = useMemo(() => {
    const types = new Set(portfolio.map((item) => item.asset_type));
    return types.size;
  }, [portfolio]);

  const themedInput = {
    ...styles.input,
    background: colors.card,
    border: `1px solid ${colors.border}`,
    color: colors.text,
  };

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
          {/* HEADER */}
          <section style={styles.heroSection}>
            <div>
              <h1 style={{ ...styles.pageTitle, color: colors.text }}>
                Investments
              </h1>
              <p style={{ ...styles.pageText, color: colors.muted }}>
                Track your holdings and manage your investment positions.
              </p>
            </div>
          </section>

          {/* SUMMARY */}
          <section style={styles.section}>
            <div style={styles.summaryGrid}>
              <div style={{ ...styles.summaryCard, background: colors.card, border: `1px solid ${colors.border}` }}>
                <p style={{ color: colors.muted }}>Total Invested</p>
                <h3 style={{ color: colors.text }}>
                  ₦{totalInvested.toLocaleString()}
                </h3>
              </div>

              <div style={{ ...styles.summaryCard, background: colors.card, border: `1px solid ${colors.border}` }}>
                <p style={{ color: colors.muted }}>Holdings</p>
                <h3 style={{ color: colors.text }}>{holdingsCount}</h3>
              </div>

              <div style={{ ...styles.summaryCard, background: colors.card, border: `1px solid ${colors.border}` }}>
                <p style={{ color: colors.muted }}>Asset Classes</p>
                <h3 style={{ color: colors.text }}>{assetTypesCount}</h3>
              </div>
            </div>
          </section>

          {/* ADD INVESTMENT */}
          <section style={styles.section}>
            <div style={{ ...styles.formCard, background: colors.card, border: `1px solid ${colors.border}` }}>
              <form style={styles.formGrid} onSubmit={handleSubmit}>
                <select
                  name="investment_id"
                  value={formData.investment_id}
                  onChange={handleChange}
                  required
                  style={themedInput}
                >
                  <option value="">Select Asset</option>
                  {availableInvestments.map((inv) => (
                    <option key={inv.investment_id} value={inv.investment_id}>
                      {inv.asset_name}
                    </option>
                  ))}
                </select>

                <input
                  name="amount_invested"
                  placeholder="Amount"
                  value={formData.amount_invested}
                  onChange={handleChange}
                  required
                  style={themedInput}
                />

                <input
                  name="units_owned"
                  placeholder="Units"
                  value={formData.units_owned}
                  onChange={handleChange}
                  required
                  style={themedInput}
                />

                <button type="submit" style={styles.primaryButton}>
                  Buy Investment
                </button>
              </form>
            </div>
          </section>

          {/* HOLDINGS TABLE */}
          <section style={styles.section}>
            <div style={{ ...styles.tableCard, background: colors.card, border: `1px solid ${colors.border}` }}>
              {portfolio.length === 0 ? (
                <p style={{ color: colors.muted }}>No investments yet</p>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={{ color: colors.muted }}>Asset</th>
                      <th style={{ color: colors.muted }}>Type</th>
                      <th style={{ color: colors.muted }}>Amount</th>
                      <th style={{ color: colors.muted }}>Units</th>
                      <th style={{ color: colors.muted }}>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {portfolio.map((item) => (
                      <tr key={item.portfolio_id}>
                        <td style={{ color: colors.text }}>{item.asset_name}</td>
                        <td style={{ color: colors.text }}>{item.asset_type}</td>
                        <td style={{ color: colors.text }}>
                          ₦{Number(item.amount_invested).toLocaleString()}
                        </td>
                        <td style={{ color: colors.text }}>
                          {Number(item.units_owned).toFixed(2)}
                        </td>
                        <td>
                          <span style={styles.holdingBadge}>
                            Purchased
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>

        {isMobile && <MobileBottomNav />}
      </main>
    </div>
  );
}

const styles = {
  container: { display: "flex", fontFamily: "Inter" },
  main: { flex: 1, minHeight: "100vh" },
  content: { padding: "30px" },

  heroSection: { marginBottom: "20px" },

  pageTitle: { fontSize: "32px", margin: 0 },
  pageText: { fontSize: "14px" },

  section: { marginBottom: "20px" },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
    gap: "12px",
  },

  summaryCard: {
    padding: "20px",
    borderRadius: "16px",
  },

  formCard: { padding: "20px", borderRadius: "16px" },

  formGrid: { display: "grid", gap: "10px" },

  input: { padding: "10px", borderRadius: "8px" },

  primaryButton: {
    background: "#10B981",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
  },

  tableCard: { padding: "20px", borderRadius: "16px" },

  table: { width: "100%" },

  holdingBadge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "rgba(16, 185, 129, 0.12)",
    color: "#10B981",
    fontSize: "12px",
    fontWeight: "700",
  },
};

export default Portfolio;