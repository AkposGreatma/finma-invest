import React, { useEffect, useState } from "react";
import { getTransactions } from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import MobileBottomNav from "../components/MobileBottomNav";
import { useTheme } from "../context/ThemeContext";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const { colors, theme } = useTheme();

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenWidth <= 768;

  const fetchTransactions = async () => {
    try {
      const res = await getTransactions();
      setTransactions(res.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
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
          <section style={styles.heroSection}>
            <div>
              <h1
                style={{
                  ...styles.pageTitle,
                  fontSize: isMobile ? "24px" : "32px",
                  color: colors.text,
                }}
              >
                Transactions
              </h1>
              <p style={{ ...styles.pageText, color: colors.muted }}>
                View your wallet funding records and track transaction activity.
              </p>
            </div>
          </section>

          <section style={styles.section}>
            <div
              style={{
                ...styles.tableCard,
                background: colors.card,
                border: `1px solid ${colors.border}`,
              }}
            >
              {transactions.length === 0 ? (
                <div
                  style={{
                    ...styles.emptyState,
                    background: theme === "dark" ? "#1E293B" : "#F8FAFC",
                    border: `1px dashed ${colors.border}`,
                  }}
                >
                  <p style={{ ...styles.emptyTitle, color: colors.text }}>
                    No transactions yet
                  </p>
                  <p style={{ ...styles.emptyText, color: colors.muted }}>
                    Your wallet funding activity will appear here once you begin
                    making transactions.
                  </p>
                </div>
              ) : (
                <div style={styles.tableWrap}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        {["Type", "Amount", "Status", "Reference", "Date"].map(
                          (head) => (
                            <th
                              key={head}
                              style={{
                                ...styles.th,
                                color: colors.muted,
                                borderBottom: `2px solid ${colors.border}`,
                              }}
                            >
                              {head}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction.transaction_id}>
                          <td
                            style={{
                              ...styles.td,
                              color: colors.text,
                              borderBottom: `1px solid ${colors.border}`,
                            }}
                          >
                            {transaction.type === "wallet_funding"
                              ? "Wallet Funding"
                              : transaction.type}
                          </td>
                          <td
                            style={{
                              ...styles.td,
                              color: colors.text,
                              borderBottom: `1px solid ${colors.border}`,
                            }}
                          >
                            ₦{Number(transaction.amount).toLocaleString()}
                          </td>
                          <td
                            style={{
                              ...styles.td,
                              borderBottom: `1px solid ${colors.border}`,
                            }}
                          >
                            <span
                              style={{
                                ...styles.statusBadge,
                                backgroundColor:
                                  transaction.status === "successful"
                                    ? "rgba(16, 185, 129, 0.12)"
                                    : "rgba(239, 68, 68, 0.12)",
                                color:
                                  transaction.status === "successful"
                                    ? "#10B981"
                                    : "#EF4444",
                              }}
                            >
                              {transaction.status}
                            </span>
                          </td>
                          <td
                            style={{
                              ...styles.td,
                              color: colors.text,
                              borderBottom: `1px solid ${colors.border}`,
                            }}
                          >
                            {transaction.reference_code || "-"}
                          </td>
                          <td
                            style={{
                              ...styles.td,
                              color: colors.text,
                              borderBottom: `1px solid ${colors.border}`,
                            }}
                          >
                            {new Date(transaction.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {isMobile && <MobileBottomNav />}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    fontFamily: "Inter, sans-serif",
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
    marginBottom: "26px",
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

  section: {
    marginBottom: "24px",
  },

  tableCard: {
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
  },

  tableWrap: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "14px 12px",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    whiteSpace: "nowrap",
  },

  td: {
    padding: "14px 12px",
    fontSize: "14px",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
  },

  statusBadge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "capitalize",
  },

  emptyState: {
    borderRadius: "16px",
    padding: "24px",
  },

  emptyTitle: {
    margin: "0 0 8px 0",
    fontSize: "16px",
    fontWeight: "700",
  },

  emptyText: {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.7",
  },
};

export default Transactions;