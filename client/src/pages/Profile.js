import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import MobileBottomNav from "../components/MobileBottomNav";
import { useTheme } from "../context/ThemeContext";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const { colors } = useTheme();

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenWidth <= 768;
  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "U";

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
              color: colors.text,
              fontSize: isMobile ? "24px" : "32px",
            }}
          >
            Profile
          </h1>

          <p style={{ ...styles.subtitle, color: colors.muted }}>
            View your personal account information.
          </p>

          <div
            style={{
              ...styles.card,
              background: colors.card,
              border: `1px solid ${colors.border}`,
            }}
          >
            <div style={styles.avatar}>{firstLetter}</div>

            <div>
              <p style={{ ...styles.label, color: colors.muted }}>Full Name</p>
              <h3 style={{ ...styles.value, color: colors.text }}>
                {user?.name || "User"}
              </h3>

              <p style={{ ...styles.label, color: colors.muted }}>
                Email Address
              </p>
              <h3 style={{ ...styles.value, color: colors.text }}>
                {user?.email || "Not available"}
              </h3>

              <p style={{ ...styles.label, color: colors.muted }}>
                Account Type
              </p>
              <h3 style={{ ...styles.value, color: colors.text }}>Investor</h3>
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

  card: {
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
    display: "flex",
    gap: "24px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },

  avatar: {
    width: "76px",
    height: "76px",
    borderRadius: "50%",
    background: "#10B981",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    fontWeight: "700",
  },

  label: {
    margin: "0 0 6px 0",
    fontSize: "13px",
  },

  value: {
    margin: "0 0 18px 0",
    fontSize: "18px",
  },
};

export default Profile;