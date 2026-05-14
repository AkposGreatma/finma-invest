import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { theme, colors } = useTheme();

  const user = JSON.parse(localStorage.getItem("user")) || { name: "Maro" };
  const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : "M";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header
      style={{
        ...styles.nav,
        background:
          theme === "dark"
            ? "rgba(15, 23, 42, 0.92)"
            : "rgba(255,255,255,0.85)",
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <div>
        <p style={{ ...styles.smallLabel, color: colors.muted }}>Overview</p>
        <h3 style={{ ...styles.title, color: colors.text }}>Dashboard</h3>
      </div>

      <div style={styles.rightArea} ref={dropdownRef}>
        <div
          style={styles.profileButton}
          onClick={() => setOpen((prev) => !prev)}
        >
          <div style={styles.userTextWrap}>
            <p style={{ ...styles.userName, color: colors.text }}>
              {user.name}
            </p>
            <p style={{ ...styles.userSub, color: colors.muted }}>Investor</p>
          </div>

          <div style={styles.avatar}>{firstLetter}</div>
          <ChevronDown size={16} style={{ color: colors.muted }} />
        </div>

        {open && (
          <div
            style={{
              ...styles.dropdown,
              background: colors.card,
              border: `1px solid ${colors.border}`,
            }}
          >
            <button
              style={{ ...styles.item, color: colors.text }}
              onClick={() => {
                setOpen(false);
                navigate("/profile");
              }}
            >
              <User size={16} />
              Profile
            </button>

            <button
              style={{ ...styles.item, color: colors.text }}
              onClick={() => {
                setOpen(false);
                navigate("/settings");
              }}
            >
              <Settings size={16} />
              Settings
            </button>

            <button
              style={{ ...styles.item, ...styles.logout }}
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

const styles = {
  nav: {
    height: "78px",
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 32px",
    boxSizing: "border-box",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  smallLabel: {
    margin: 0,
    fontSize: "13px",
  },

  title: {
    margin: "4px 0 0 0",
    fontSize: "24px",
  },

  rightArea: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  profileButton: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    padding: "6px 8px",
    borderRadius: "10px",
  },

  userTextWrap: {
    textAlign: "right",
  },

  userName: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "600",
  },

  userSub: {
    margin: "3px 0 0 0",
    fontSize: "12px",
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#10B981",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
  },

  dropdown: {
    position: "absolute",
    top: "58px",
    right: 0,
    width: "180px",
    borderRadius: "12px",
    boxShadow: "0 12px 24px rgba(15, 23, 42, 0.12)",
    padding: "6px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  item: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    borderRadius: "8px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
  },

  logout: {
    color: "#EF4444",
  },
};

export default Navbar;