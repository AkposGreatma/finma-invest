import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyWalletFunding } from "../services/api";

function WalletPaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference");

      if (!reference) {
        setStatus("error");
        setMessage("Missing transaction reference");
        setTimeout(() => navigate("/wallet"), 2000);
        return;
      }

      try {
        const res = await verifyWalletFunding(reference);

        setStatus("success");
        setMessage(res.data.message || "Payment successful!");

        // wait a bit then go back
        setTimeout(() => {
          navigate("/wallet");
        }, 2000);
      } catch (error) {
        setStatus("error");

        setMessage(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "Payment verification failed"
        );

        setTimeout(() => {
          navigate("/wallet");
        }, 2500);
      }
    };

    verifyPayment();
  }, [navigate, searchParams]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* ICON */}
        <div
          style={{
            ...styles.icon,
            background:
              status === "success"
                ? "#ECFDF5"
                : status === "error"
                ? "#FEF2F2"
                : "#F1F5F9",
            color:
              status === "success"
                ? "#10B981"
                : status === "error"
                ? "#EF4444"
                : "#64748B",
          }}
        >
          {status === "loading" && "⏳"}
          {status === "success" && "✓"}
          {status === "error" && "✕"}
        </div>

        {/* TITLE */}
        <h2 style={styles.title}>
          {status === "loading" && "Verifying Payment"}
          {status === "success" && "Payment Successful"}
          {status === "error" && "Payment Failed"}
        </h2>

        {/* MESSAGE */}
        <p style={styles.text}>{message}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#F8FAFC",
    fontFamily: "Inter, sans-serif",
    padding: "24px",
  },

  card: {
    background: "#FFFFFF",
    padding: "32px",
    borderRadius: "18px",
    border: "1px solid #E2E8F0",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
    textAlign: "center",
    maxWidth: "420px",
    width: "100%",
  },

  icon: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "26px",
    margin: "0 auto 16px",
  },

  title: {
    margin: "0 0 10px 0",
    color: "#0F172A",
  },

  text: {
    margin: 0,
    color: "#64748B",
    fontSize: "14px",
    lineHeight: "1.7",
  },
};

export default WalletPaymentCallback;