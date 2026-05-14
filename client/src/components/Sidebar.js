import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  BarChart3,
  Layers,
  Wallet,
  ArrowRightLeft,
  LogOut,
} from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside style={styles.sidebar}>
      <div>
        <div style={styles.brandWrap}>
          <h2 style={styles.logo}>
            FIN<span style={styles.logoAccent}>MA</span> INVEST
          </h2>
          <p style={styles.tagline}>Analytics-driven investing</p>
        </div>

        <nav style={styles.menu}>
          <div
            onClick={() => navigate("/dashboard")}
            style={{
              ...styles.item,
              ...(isActive("/dashboard") && styles.activeItem),
            }}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </div>

          <div
            onClick={() => navigate("/dashboard")}
            style={styles.item}
          >
            <BarChart3 size={18} />
            <span>Analytics</span>
          </div>

          <div
            onClick={() => navigate("/portfolio")}
            style={{
              ...styles.item,
              ...(isActive("/portfolio") && styles.activeItem),
            }}
          >
            <Layers size={18} />
            <span>Investments</span>
          </div>

          <div
            onClick={() => navigate("/wallet")}
            style={{
              ...styles.item,
              ...(isActive("/wallet") && styles.activeItem),
            }}
          >
            <Wallet size={18} />
            <span>Wallet</span>
          </div>

          <div
            onClick={() => navigate("/transactions")}
            style={styles.item}
          >
            <ArrowRightLeft size={18} />
            <span>Transactions</span>
          </div>
        </nav>
      </div>

      <div style={styles.logout} onClick={handleLogout}>
        <LogOut size={18} />
        <span>Logout</span>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "250px",
    minHeight: "100vh",
    background: "#0F172A",
    color: "#E2E8F0",
    padding: "28px 18px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxSizing: "border-box",
  },
  brandWrap: {
    marginBottom: "36px",
    padding: "0 8px",
  },
  logo: {
    fontSize: "22px",
    margin: 0,
    color: "#FFFFFF",
    letterSpacing: "0.2px",
  },
  logoAccent: {
    color: "#10B981",
  },
  tagline: {
    marginTop: "6px",
    fontSize: "13px",
    color: "#94A3B8",
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 14px",
    borderRadius: "14px",
    cursor: "pointer",
    color: "#CBD5E1",
    fontSize: "15px",
    transition: "0.2s",
  },
  activeItem: {
    background: "rgba(16, 185, 129, 0.14)",
    color: "#FFFFFF",
    border: "1px solid rgba(16, 185, 129, 0.18)",
  },
  logout: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 14px",
    borderRadius: "14px",
    cursor: "pointer",
    color: "#CBD5E1",
    fontSize: "15px",
  },
};

export default Sidebar;