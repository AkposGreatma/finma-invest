import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import MobileBottomNav from "../components/MobileBottomNav";
import { useTheme } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

function Settings() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const { theme, toggleTheme, colors } = useTheme();

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenWidth <= 768;

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
          <h1
            style={{
              ...styles.title,
              fontSize: isMobile ? "24px" : "32px",
              color: colors.text,
            }}
          >
            Settings
          </h1>

          <p style={{ ...styles.subtitle, color: colors.muted }}>
            Manage account preferences and system appearance.
          </p>

          <div style={styles.grid}>
            {/* DARK MODE CARD */}
            <div
              style={{
                ...styles.card,
                background: colors.card,
                border: `1px solid ${colors.border}`,
              }}
            >
              <h3 style={{ ...styles.cardTitle, color: colors.text }}>
                Appearance
              </h3>

              <p style={{ ...styles.cardText, color: colors.muted }}>
                Switch between light and dark mode across the entire application.
              </p>

              <button
                onClick={toggleTheme}
                style={{
                  ...styles.themeToggle,
                  background: theme === "dark" ? "#10B981" : "#0F172A",
                }}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                {theme === "dark" ? " Light Mode" : " Dark Mode"}
              </button>
            </div>

            {/* OTHER SETTINGS */}
            <div
              style={{
                ...styles.card,
                background: colors.card,
                border: `1px solid ${colors.border}`,
              }}
            >
              <h3 style={{ ...styles.cardTitle, color: colors.text }}>
                Security
              </h3>
              <p style={{ ...styles.cardText, color: colors.muted }}>
                Manage password, login activity, and account protection options.
              </p>
              <span style={styles.badge}>Coming soon</span>
            </div>

            <div
              style={{
                ...styles.card,
                background: colors.card,
                border: `1px solid ${colors.border}`,
              }}
            >
              <h3 style={{ ...styles.cardTitle, color: colors.text }}>
                Notifications
              </h3>
              <p style={{ ...styles.cardText, color: colors.muted }}>
                Control wallet, investment, and transaction notifications.
              </p>
              <span style={styles.badge}>Coming soon</span>
            </div>
          </div>
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

  title: {
    margin: "0 0 8px 0",
    letterSpacing: "-0.6px",
  },

  subtitle: {
    margin: "0 0 24px 0",
    fontSize: "15px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
  },

  card: {
    borderRadius: "18px",
    padding: "22px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
  },

  cardTitle: {
    margin: "0 0 10px 0",
    fontSize: "18px",
  },

  cardText: {
    margin: "0 0 14px 0",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  themeToggle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 14px",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
  },

  badge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "#ECFDF5",
    color: "#10B981",
    fontSize: "12px",
    fontWeight: "700",
  },
};

export default Settings;