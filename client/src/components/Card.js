import React from "react";

function Card({ title, value, subtitle, accent, trend }) {
  return (
    <div style={styles.card}>
      <div style={styles.topRow}>
        <p style={styles.title}>{title}</p>
        {trend && (
          <span style={{ ...styles.trendBadge, color: accent || "#10B981" }}>
            {trend}
          </span>
        )}
      </div>

      <h2 style={{ ...styles.value, color: accent || "#0F172A" }}>{value}</h2>
      <p style={styles.subtitle}>{subtitle}</p>
    </div>
  );
}

const styles = {
  card: {
    background: "#FFFFFF",
    borderRadius: "20px",
    padding: "22px",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
    border: "1px solid #E2E8F0",
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  title: {
    fontSize: "14px",
    color: "#64748B",
    margin: 0,
  },
  trendBadge: {
    fontSize: "12px",
    fontWeight: "700",
    background: "rgba(16, 185, 129, 0.08)",
    padding: "6px 10px",
    borderRadius: "999px",
  },
  value: {
    fontSize: "30px",
    fontWeight: "700",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "13px",
    color: "#94A3B8",
    margin: 0,
    lineHeight: "1.5",
  },
};

export default Card;