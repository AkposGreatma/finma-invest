import React, { useEffect, useState } from "react";
import {
  getWallet,
  getRecentTransactions,
  initializeWalletFunding,
} from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { ArrowDown, ArrowUpRight, ArrowUpDown } from "lucide-react";
import MobileBottomNav from "../components/MobileBottomNav";
import { useTheme } from "../context/ThemeContext";

function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState("");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();
  const { colors, theme } = useTheme();

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenWidth <= 768;
  const isTablet = screenWidth <= 1024;

  const fetchWallet = async () => {
    try {
      const res = await getWallet();
      setWallet(res.data);
    } catch (error) {
      console.error("Error fetching wallet:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await getRecentTransactions();
      setTransactions(res.data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching recent transactions:", error);
    }
  };

  useEffect(() => {
    const loadWalletData = async () => {
      await fetchWallet();
      await fetchTransactions();
    };

    loadWalletData();
  }, []);

  const handleFundWallet = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await initializeWalletFunding({
        amount,
        email: user?.email,
      });

      if (res.data.authorization_url) {
        window.location.href = res.data.authorization_url;
      } else {
        alert("Failed to launch payment page");
      }
    } catch (error) {
      console.error("Error initializing wallet funding:", error);
      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to initialize payment"
      );
    }
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
          <section style={styles.heroSection}>
            <div>
              <h1
                style={{
                  ...styles.pageTitle,
                  fontSize: isMobile ? "24px" : "32px",
                  color: colors.text,
                }}
              >
                Wallet
              </h1>
              <p style={{ ...styles.pageText, color: colors.muted }}>
                Fund your wallet, track your available balance, and prepare for
                investment activity.
              </p>
            </div>
          </section>

          <section style={styles.section}>
            <div style={styles.balanceCard}>
              <p style={styles.balanceLabel}>Available Wallet Balance</p>
              <h2
                style={{
                  ...styles.balanceValue,
                  fontSize: isMobile ? "36px" : "48px",
                }}
              >
                ₦{wallet?.balance?.toLocaleString() || "0"}
              </h2>
              <p style={styles.balanceSubtext}>
                This balance can be used to support funding and investment
                operations within your account.
              </p>
            </div>
          </section>

          <section style={styles.section}>
            <div
              style={{
                ...styles.quickActions,
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : isTablet
                  ? "repeat(2, 1fr)"
                  : "repeat(3, 1fr)",
              }}
            >
              <button
                style={{
                  ...styles.actionCard,
                  background: colors.card,
                  border: `1px solid ${colors.border}`,
                }}
                onClick={() =>
                  document
                    .getElementById("fund-wallet-form")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <span
                  style={{
                    ...styles.actionIcon,
                    background: theme === "dark" ? "#1E293B" : "#F1F5F9",
                  }}
                >
                  <ArrowDown size={22} />
                </span>
                <span style={{ ...styles.actionTitle, color: colors.text }}>
                  Add Money
                </span>
                <span style={{ ...styles.actionText, color: colors.muted }}>
                  Fund your wallet balance
                </span>
              </button>

              <button
                style={{
                  ...styles.actionCard,
                  background: colors.card,
                  border: `1px solid ${colors.border}`,
                }}
                onClick={() => navigate("/portfolio")}
              >
                <span
                  style={{
                    ...styles.actionIcon,
                    background: theme === "dark" ? "#1E293B" : "#F1F5F9",
                  }}
                >
                  <ArrowUpDown size={22} />
                </span>
                <span style={{ ...styles.actionTitle, color: colors.text }}>
                  Invest
                </span>
                <span style={{ ...styles.actionText, color: colors.muted }}>
                  Go to portfolio management
                </span>
              </button>

              <button
                style={{
                  ...styles.actionCardMuted,
                  background: colors.card,
                  border: `1px solid ${colors.border}`,
                }}
                type="button"
              >
                <span
                  style={{
                    ...styles.actionIcon,
                    background: theme === "dark" ? "#1E293B" : "#F1F5F9",
                  }}
                >
                  <ArrowUpRight size={22} />
                </span>
                <span style={{ ...styles.actionTitle, color: colors.text }}>
                  Withdraw
                </span>
                <span style={{ ...styles.actionText, color: colors.muted }}>
                  Available in future update
                </span>
              </button>
            </div>
          </section>

          <section style={styles.section} id="fund-wallet-form">
            <div
              style={{
                ...styles.formCard,
                background: colors.card,
                border: `1px solid ${colors.border}`,
              }}
            >
              <h3 style={{ ...styles.sectionTitle, color: colors.text }}>
                Quick Funding Form
              </h3>
              <p style={{ ...styles.formText, color: colors.muted }}>
                Enter the amount you want to add to your wallet.
              </p>

              <form onSubmit={handleFundWallet}>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  style={{
                    ...styles.input,
                    background: colors.card,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                  }}
                />

                <button type="submit" style={styles.button}>
                  Fund Wallet
                </button>
              </form>
            </div>
          </section>

          <section style={styles.section}>
            <div
              style={{
                ...styles.transactionsCard,
                background: colors.card,
                border: `1px solid ${colors.border}`,
              }}
            >
              <div style={styles.transactionsHeader}>
                <div>
                  <h3 style={{ ...styles.sectionTitle, color: colors.text }}>
                    Recent Transactions
                  </h3>
                  <p style={{ ...styles.formText, color: colors.muted }}>
                    Your most recent wallet activity appears here.
                  </p>
                </div>

                <button
                  style={{
                    ...styles.viewAllButton,
                    background: colors.card,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                  }}
                  onClick={() => navigate("/transactions")}
                >
                  View All
                </button>
              </div>

              {transactions.length === 0 ? (
                <div
                  style={{
                    ...styles.emptyTransactionState,
                    background: theme === "dark" ? "#1E293B" : "#F8FAFC",
                    border: `1px dashed ${colors.border}`,
                  }}
                >
                  <p
                    style={{
                      ...styles.emptyTransactionTitle,
                      color: colors.text,
                    }}
                  >
                    No transactions yet
                  </p>
                  <p
                    style={{
                      ...styles.emptyTransactionText,
                      color: colors.muted,
                    }}
                  >
                    Once you fund your wallet, your recent transaction history
                    will appear here.
                  </p>
                </div>
              ) : (
                <div style={styles.transactionList}>
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.transaction_id}
                      style={{
                        ...styles.transactionItem,
                        borderBottom: `1px solid ${colors.border}`,
                      }}
                    >
                      <div>
                        <p
                          style={{
                            ...styles.transactionType,
                            color: colors.text,
                          }}
                        >
                          {transaction.type === "wallet_funding"
                            ? "Wallet Funding"
                            : transaction.type}
                        </p>
                        <p
                          style={{
                            ...styles.transactionMeta,
                            color: colors.muted,
                          }}
                        >
                          {new Date(transaction.created_at).toLocaleString()}
                        </p>
                      </div>

                      <div style={styles.transactionRight}>
                        <p
                          style={{
                            ...styles.transactionAmount,
                            color: colors.text,
                          }}
                        >
                          ₦{Number(transaction.amount).toLocaleString()}
                        </p>
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
                      </div>
                    </div>
                  ))}
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

  sectionTitle: {
    fontSize: "18px",
    margin: "0 0 10px 0",
    letterSpacing: "-0.2px",
  },

  balanceCard: {
    background: "linear-gradient(135deg, #0F172A, #1E293B)",
    borderRadius: "22px",
    padding: "28px",
    boxShadow: "0 16px 36px rgba(15, 23, 42, 0.18)",
    color: "#FFFFFF",
  },

  balanceLabel: {
    fontSize: "13px",
    color: "#CBD5E1",
    marginBottom: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
  },

  balanceValue: {
    margin: 0,
    fontWeight: "700",
    lineHeight: "1.2",
    color: "#FFFFFF",
  },

  balanceSubtext: {
    marginTop: "12px",
    marginBottom: 0,
    color: "#CBD5E1",
    fontSize: "14px",
    lineHeight: "1.7",
    maxWidth: "640px",
  },

  quickActions: {
    display: "grid",
    gap: "16px",
  },

  actionCard: {
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
    textAlign: "left",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  actionCardMuted: {
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
    textAlign: "left",
    cursor: "not-allowed",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    opacity: 0.85,
  },

  actionIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    color: "#10B981",
  },

  actionTitle: {
    fontSize: "16px",
    fontWeight: "700",
  },

  actionText: {
    fontSize: "14px",
    lineHeight: "1.6",
  },

  formCard: {
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
  },

  formText: {
    margin: "0 0 16px 0",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  input: {
    display: "block",
    marginBottom: "14px",
    padding: "12px",
    width: "100%",
    maxWidth: "320px",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },

  button: {
    padding: "12px 18px",
    backgroundColor: "#10B981",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    boxShadow: "0 10px 20px rgba(16, 185, 129, 0.16)",
  },

  transactionsCard: {
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
  },

  transactionsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },

  transactionList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  transactionItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    padding: "14px 0",
  },

  transactionType: {
    margin: "0 0 6px 0",
    fontSize: "14px",
    fontWeight: "700",
    textTransform: "capitalize",
  },

  transactionMeta: {
    margin: 0,
    fontSize: "13px",
  },

  transactionRight: {
    textAlign: "right",
  },

  transactionAmount: {
    margin: "0 0 6px 0",
    fontSize: "14px",
    fontWeight: "700",
  },

  statusBadge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "capitalize",
  },

  viewAllButton: {
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  emptyTransactionState: {
    borderRadius: "16px",
    padding: "24px",
  },

  emptyTransactionTitle: {
    margin: "0 0 8px 0",
    fontSize: "15px",
    fontWeight: "700",
  },

  emptyTransactionText: {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.7",
  },
};

export default Wallet;