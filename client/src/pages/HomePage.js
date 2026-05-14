import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dashboardImg from "../assets/images/dashboard.png";
import { useTheme } from "../context/ThemeContext";

function HomePage() {
  const navigate = useNavigate();
  const { colors, theme } = useTheme();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isTablet = screenWidth <= 1024;
  const isMobile = screenWidth <= 768;

  const themedCard = {
    background: colors.card,
    border: `1px solid ${colors.border}`,
  };

  return (
    <div
      style={{
        ...styles.page,
        background: colors.page,
        color: colors.text,
      }}
    >
      <header
        style={{
          ...styles.navbar,
          background:
            theme === "dark"
              ? "rgba(15, 23, 42, 0.92)"
              : "rgba(255,255,255,0.88)",
          borderBottom: `1px solid ${colors.border}`,
          padding: isMobile ? "16px 20px" : "20px 48px",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "14px" : "0",
          alignItems: isMobile ? "flex-start" : "center",
        }}
      >
        <h2 style={{ ...styles.logo, color: colors.text }}>
          FIN<span style={styles.logoAccent}>MA</span> INVEST
        </h2>

        <div
          style={{
            ...styles.navActions,
            width: isMobile ? "100%" : "auto",
            justifyContent: isMobile ? "space-between" : "flex-start",
          }}
        >
          <button
            style={{
              ...styles.loginButton,
              background: colors.card,
              color: colors.text,
              border: `1px solid ${colors.border}`,
            }}
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            style={styles.getStartedButton}
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>
        </div>
      </header>

      <section
        style={{
          ...styles.heroSection,
          gridTemplateColumns: isTablet ? "1fr" : "1.1fr 1fr",
          padding: isMobile
            ? "40px 20px"
            : isTablet
            ? "56px 32px"
            : "72px 48px 56px",
          gap: isMobile ? "28px" : "48px",
        }}
      >
        <div
          style={{
            ...styles.heroTextWrap,
            maxWidth: isTablet ? "100%" : "620px",
          }}
        >
          <p style={styles.heroTag}>Analytics-driven investing</p>

          <h1
            style={{
              ...styles.heroTitle,
              color: colors.text,
              fontSize: isMobile ? "38px" : isTablet ? "48px" : "60px",
              lineHeight: isMobile ? "1.12" : "1.05",
            }}
          >
            Track, analyze, and grow your investments with confidence.
          </h1>

          <p
            style={{
              ...styles.heroSubtitle,
              color: colors.muted,
              fontSize: isMobile ? "15px" : "17px",
              maxWidth: isTablet ? "100%" : "560px",
            }}
          >
            FINMA INVEST gives you a clean, analytics-driven way to manage your
            portfolio, monitor growth, and make better financial decisions.
          </p>

          <div
            style={{
              ...styles.heroButtons,
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "stretch" : "center",
            }}
          >
            <button
              style={styles.primaryButton}
              onClick={() => navigate("/register")}
            >
              Start Investing
            </button>
          </div>
        </div>

        <div
          style={{
            ...styles.heroVisual,
            width: "100%",
            maxWidth: isTablet ? "100%" : "560px",
            margin: isTablet ? "0 auto" : "0",
          }}
        >
          <div style={{ ...styles.visualCardLarge, ...themedCard }}>
            <p style={{ ...styles.cardLabel, color: colors.muted }}>
              Portfolio Value
            </p>
            <h3 style={{ ...styles.cardValue, color: colors.text }}>
              ₦1,550,000
            </h3>
            <p style={styles.cardGrowth}>+380.0% this month</p>
          </div>

          <div
            style={{
              ...styles.visualRow,
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            }}
          >
            <div style={{ ...styles.visualCardSmall, ...themedCard }}>
              <p style={{ ...styles.cardLabel, color: colors.muted }}>
                Best Asset
              </p>
              <h4 style={{ ...styles.smallCardValue, color: colors.text }}>
                Tech Growth Fund
              </h4>
            </div>

            <div style={{ ...styles.visualCardSmall, ...themedCard }}>
              <p style={{ ...styles.cardLabel, color: colors.muted }}>
                Allocation
              </p>
              <h4 style={{ ...styles.smallCardValue, color: colors.text }}>
                4 Asset Classes
              </h4>
            </div>
          </div>

          <img
            src={dashboardImg}
            alt="Dashboard preview"
            style={{
              ...styles.heroImage,
              border: `1px solid ${colors.border}`,
              width: "100%",
              minHeight: isMobile ? "260px" : "auto",
              objectFit: "cover",
            }}
          />
        </div>
      </section>

      <section
        style={{
          ...styles.section,
          padding: isMobile ? "28px 20px 8px" : "36px 48px 12px",
        }}
      >
        <div style={styles.sectionHeader}>
          <p style={styles.sectionTag}>Why FINMA INVEST</p>
          <h2
            style={{
              ...styles.sectionTitle,
              color: colors.text,
              fontSize: isMobile ? "28px" : "36px",
            }}
          >
            Built for clarity, insight, and confidence
          </h2>
        </div>

        <div
          style={{
            ...styles.featureGrid,
            gridTemplateColumns: isMobile
              ? "1fr"
              : isTablet
              ? "repeat(2, 1fr)"
              : "repeat(4, 1fr)",
          }}
        >
          {[
            [
              "Portfolio Analytics",
              "Monitor your portfolio value, growth trend, and allocation from one unified dashboard.",
            ],
            [
              "Insight Engine",
              "Get simple portfolio insights that help you understand your largest holdings and diversification.",
            ],
            [
              "Secure User Access",
              "Protected routes and token-based authentication help secure each user’s portfolio data.",
            ],
            [
              "Smart Portfolio Management",
              "Add and manage your investment records with a clean and structured interface.",
            ],
          ].map(([title, text]) => (
            <div key={title} style={{ ...styles.featureCard, ...themedCard }}>
              <h3 style={{ ...styles.featureTitle, color: colors.text }}>
                {title}
              </h3>
              <p style={{ ...styles.featureText, color: colors.muted }}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          ...styles.analyticsSection,
          gridTemplateColumns: isTablet ? "1fr" : "1.1fr 1fr",
          padding: isMobile ? "40px 20px" : "52px 48px",
        }}
      >
        <div>
          <p style={styles.sectionTag}>Your advantage</p>
          <h2
            style={{
              ...styles.sectionTitle,
              color: colors.text,
              fontSize: isMobile ? "28px" : "36px",
            }}
          >
            Understand your investments, not just store them
          </h2>
          <p style={{ ...styles.analyticsParagraph, color: colors.muted }}>
            FINMA INVEST goes beyond record keeping by turning portfolio data
            into meaningful charts, allocation summaries, and decision-support
            insights.
          </p>
        </div>

        <div style={{ ...styles.analyticsPanel, ...themedCard }}>
          {[
            "Live portfolio tracking",
            "Cumulative trend analysis",
            "Asset allocation breakdown",
            "User-specific insights",
          ].map((item) => (
            <div
              key={item}
              style={{
                ...styles.analyticsStat,
                background: theme === "dark" ? "#1E293B" : "#F8FAFC",
                border: `1px solid ${colors.border}`,
                color: colors.text,
              }}
            >
              <span style={styles.analyticsDot}></span>
              {item}
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          ...styles.section,
          padding: isMobile ? "28px 20px 8px" : "36px 48px 12px",
        }}
      >
        <div style={styles.sectionHeader}>
          <p style={styles.sectionTag}>How it works</p>
          <h2
            style={{
              ...styles.sectionTitle,
              color: colors.text,
              fontSize: isMobile ? "28px" : "36px",
            }}
          >
            A simple path to smarter investing
          </h2>
        </div>

        <div
          style={{
            ...styles.stepsGrid,
            gridTemplateColumns: isMobile
              ? "1fr"
              : isTablet
              ? "repeat(2, 1fr)"
              : "repeat(3, 1fr)",
          }}
        >
          {[
            [
              "01",
              "Create an account",
              "Sign up securely and access your personal investment workspace.",
            ],
            [
              "02",
              "Build your portfolio",
              "Add investment records and organize your portfolio across different asset classes.",
            ],
            [
              "03",
              "Track and analyze",
              "View trends, allocation, and intelligent insights from your dashboard.",
            ],
          ].map(([num, title, text]) => (
            <div key={num} style={{ ...styles.stepCard, ...themedCard }}>
              <div style={styles.stepNumber}>{num}</div>
              <h3 style={{ ...styles.featureTitle, color: colors.text }}>
                {title}
              </h3>
              <p style={{ ...styles.featureText, color: colors.muted }}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          ...styles.ctaSection,
          padding: isMobile ? "48px 20px" : "72px 48px",
        }}
      >
        <h2
          style={{
            ...styles.ctaTitle,
            color: colors.text,
            fontSize: isMobile ? "32px" : "40px",
          }}
        >
          Start building your investment future today.
        </h2>
        <p style={{ ...styles.ctaText, color: colors.muted }}>
          Join FINMA INVEST and manage your portfolio with smarter insight and
          cleaner structure.
        </p>
        <button
          style={styles.primaryButton}
          onClick={() => navigate("/register")}
        >
          Get Started
        </button>
      </section>

      <footer
        style={{
          ...styles.footer,
          background: colors.card,
          borderTop: `1px solid ${colors.border}`,
          padding: isMobile ? "28px 20px 36px" : "32px 48px 44px",
        }}
      >
        <h3 style={{ ...styles.logo, color: colors.text }}>
          FIN<span style={styles.logoAccent}>MA</span> INVEST
        </h3>
        <p style={{ ...styles.footerText, color: colors.muted }}>
          Analytics-driven investment and portfolio management experience.
        </p>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 10,
    backdropFilter: "blur(10px)",
  },

  logo: {
    margin: 0,
    fontSize: "24px",
  },

  logoAccent: {
    color: "#10B981",
  },

  navActions: {
    display: "flex",
    gap: "12px",
  },

  loginButton: {
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  getStartedButton: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#10B981",
    color: "#FFFFFF",
    cursor: "pointer",
    fontWeight: "600",
  },

  heroSection: {
    display: "grid",
    alignItems: "center",
  },

  heroTextWrap: {
    maxWidth: "620px",
  },

  heroTag: {
    color: "#10B981",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    fontSize: "13px",
    marginBottom: "12px",
  },

  heroTitle: {
    margin: "0 0 18px 0",
    letterSpacing: "-1.2px",
  },

  heroSubtitle: {
    lineHeight: "1.8",
    marginBottom: "28px",
  },

  heroButtons: {
    display: "flex",
    gap: "14px",
  },

  primaryButton: {
    padding: "14px 22px",
    borderRadius: "10px",
    border: "none",
    background: "#10B981",
    color: "#FFFFFF",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    boxShadow: "0 12px 24px rgba(16, 185, 129, 0.18)",
  },

  heroVisual: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  visualCardLarge: {
    borderRadius: "22px",
    padding: "24px",
    boxShadow: "0 16px 36px rgba(15, 23, 42, 0.06)",
  },

  visualRow: {
    display: "grid",
    gap: "18px",
  },

  visualCardSmall: {
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 12px 28px rgba(15, 23, 42, 0.05)",
  },

  heroImage: {
    borderRadius: "22px",
    boxShadow: "0 20px 40px rgba(15, 23, 42, 0.08)",
    display: "block",
  },

  cardLabel: {
    fontSize: "13px",
    marginBottom: "8px",
  },

  cardValue: {
    margin: 0,
    fontSize: "34px",
  },

  cardGrowth: {
    marginTop: "8px",
    color: "#10B981",
    fontWeight: "600",
    fontSize: "14px",
  },

  smallCardValue: {
    margin: 0,
    fontSize: "18px",
    lineHeight: "1.4",
  },

  section: {},

  sectionHeader: {
    marginBottom: "22px",
  },

  sectionTag: {
    color: "#10B981",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    fontSize: "12px",
    marginBottom: "8px",
  },

  sectionTitle: {
    margin: 0,
    lineHeight: "1.2",
    letterSpacing: "-0.6px",
  },

  featureGrid: {
    display: "grid",
    gap: "18px",
  },

  featureCard: {
    borderRadius: "18px",
    padding: "22px",
    boxShadow: "0 12px 28px rgba(15, 23, 42, 0.04)",
  },

  featureTitle: {
    marginTop: 0,
    marginBottom: "10px",
    fontSize: "20px",
    lineHeight: "1.3",
  },

  featureText: {
    margin: 0,
    lineHeight: "1.7",
    fontSize: "14px",
  },

  analyticsSection: {
    display: "grid",
    gap: "32px",
    alignItems: "center",
  },

  analyticsParagraph: {
    lineHeight: "1.8",
    fontSize: "15px",
    maxWidth: "560px",
  },

  analyticsPanel: {
    borderRadius: "22px",
    padding: "24px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
    display: "grid",
    gap: "14px",
  },

  analyticsStat: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 14px",
    borderRadius: "14px",
    fontSize: "14px",
  },

  analyticsDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#10B981",
  },

  stepsGrid: {
    display: "grid",
    gap: "18px",
  },

  stepCard: {
    borderRadius: "18px",
    padding: "22px",
    boxShadow: "0 12px 28px rgba(15, 23, 42, 0.04)",
  },

  stepNumber: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "#ECFDF5",
    color: "#10B981",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    marginBottom: "14px",
  },

  ctaSection: {
    textAlign: "center",
  },

  ctaTitle: {
    marginBottom: "12px",
    letterSpacing: "-0.8px",
  },

  ctaText: {
    fontSize: "16px",
    lineHeight: "1.7",
    maxWidth: "680px",
    margin: "0 auto 24px",
  },

  footer: {
    marginTop: "24px",
  },

  footerText: {
    marginTop: "8px",
    fontSize: "14px",
    maxWidth: "460px",
  },
};

export default HomePage;