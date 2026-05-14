import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Layers,
  Wallet,
  ArrowRightLeft,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { colors } = useTheme();

  const items = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Investments", path: "/portfolio", icon: Layers },
    { label: "Wallet", path: "/wallet", icon: Wallet },
    { label: "Transactions", path: "/transactions", icon: ArrowRightLeft },
  ];

  return (
    <nav
      style={{
        ...styles.nav,
        background: colors.card,
        borderTop: `1px solid ${colors.border}`,
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              ...styles.navItem,
              color: isActive ? "#10B981" : colors.muted,
              fontWeight: isActive ? "700" : "500",
            }}
          >
            <Icon size={18} />
            <span style={styles.label}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

const styles = {
  nav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: "72px",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    zIndex: 1000,
    boxShadow: "0 -8px 24px rgba(15, 23, 42, 0.10)",
  },

  navItem: {
    background: "transparent",
    border: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    fontSize: "12px",
    cursor: "pointer",
  },

  label: {
    fontSize: "11px",
    lineHeight: "1",
  },
};

export default MobileBottomNav;