import React, { useState, useEffect } from "react";
import { registerUser } from "../services/api";
import illustration from "../assets/images/register2.png";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function Register() {
  const navigate = useNavigate();
  const { colors, theme } = useTheme();

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isMobile = screenWidth <= 768;

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) navigate("/dashboard");
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setMessage("Please fill in all fields.");
      setMessageType("error");
      return;
    }

    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      setMessageType("error");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };

      const res = await registerUser(payload);

      setMessage(res.data.message || "Registration successful.");
      setMessageType("success");

      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed.");
      setMessageType("error");
    }
  };

  return (
    <div
      style={{
        ...styles.page,
        background: colors.page,
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      {!isMobile && (
        <div style={styles.leftPanel}>
          <div style={styles.brandWrap}>
            <p style={styles.brandTag}>
              FIN<span style={{ color: "#A7F3D0" }}>MA</span> INVEST
            </p>

            <h1 style={styles.heroTitle}>
              Build your investment future with clarity.
            </h1>

            <p style={styles.heroText}>
              Manage your portfolio, monitor growth, and handle payments in one
              premium experience.
            </p>

            <div style={styles.featureList}>
              <div style={styles.imageContainer}>
                <img
                  src={illustration}
                  alt="Investment Growth"
                  style={styles.image}
                />
              </div>

              <div style={styles.featureItem}>Secure portfolio tracking</div>
              <div style={styles.featureItem}>Clean analytics dashboard</div>
              <div style={styles.featureItem}>Seamless payment flow</div>
            </div>
          </div>
        </div>
      )}

      <div style={styles.rightPanel}>
        <div
          style={{
            ...styles.formCard,
            background: colors.card,
            border: `1px solid ${colors.border}`,
            boxShadow:
              theme === "dark"
                ? "0 10px 30px rgba(0,0,0,0.5)"
                : "0 25px 60px rgba(0,0,0,0.08)",
          }}
        >
          {isMobile && (
            <p style={{ ...styles.mobileBrand, color: colors.text }}>
              FIN<span style={{ color: "#10B981" }}>MA</span> INVEST
            </p>
          )}

          <h2 style={{ ...styles.formTitle, color: colors.text }}>
            Create Account
          </h2>

          <p style={{ ...styles.formSubtitle, color: colors.muted }}>
            Start your journey with a smarter investment experience.
          </p>

          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              style={{
                ...styles.input,
                background: colors.page,
                color: colors.text,
                border: `1px solid ${colors.border}`,
              }}
            />

            <input
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              style={{
                ...styles.input,
                background: colors.page,
                color: colors.text,
                border: `1px solid ${colors.border}`,
              }}
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              style={{
                ...styles.input,
                background: colors.page,
                color: colors.text,
                border: `1px solid ${colors.border}`,
              }}
            />

            <div style={styles.inputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  ...styles.inputWithIcon,
                  background: colors.page,
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                }}
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <div style={styles.inputWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{
                  ...styles.inputWithIcon,
                  background: colors.page,
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                }}
              />

              <span
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                style={styles.eyeIcon}
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </span>
            </div>

            <button style={styles.button}>Get Started</button>
          </form>

          {message && (
            <p
              style={{
                color: messageType === "success" ? "#10B981" : "#EF4444",
              }}
            >
              {message}
            </p>
          )}

          <p style={styles.bottomText}>
            Already have an account?{" "}
            <span
              style={styles.linkText}
              onClick={() => navigate("/login")}
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
  },

  leftPanel: {
    flex: 1,
    background: "linear-gradient(135deg, #10B981, #059669)",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px",
  },

  brandWrap: { maxWidth: "460px" },

  brandTag: {
    fontSize: "14px",
    fontWeight: "700",
    marginBottom: "18px",
  },

  heroTitle: {
    fontSize: "42px",
    marginBottom: "18px",
  },

  heroText: {
    fontSize: "17px",
    lineHeight: "1.7",
    marginBottom: "28px",
  },

  featureList: { display: "flex", flexDirection: "column", gap: "12px" },

  featureItem: {
    background: "rgba(255,255,255,0.12)",
    padding: "14px",
    borderRadius: "12px",
  },

  imageContainer: {
    background: "rgba(255,255,255,0.1)",
    borderRadius: "20px",
    padding: "20px",
    marginTop: "30px",
  },

  image: { width: "100%", maxWidth: "320px" },

  rightPanel: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
  },

  formCard: {
    width: "100%",
    maxWidth: "440px",
    borderRadius: "20px",
    padding: "36px",
  },

  mobileBrand: { fontSize: "14px", fontWeight: "700" },

  formTitle: { fontSize: "30px" },

  formSubtitle: { marginBottom: "24px" },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "16px",
    borderRadius: "12px",
  },

  inputWrapper: { position: "relative", marginBottom: "16px" },

  inputWithIcon: {
    width: "100%",
    padding: "14px",
    paddingRight: "45px",
    borderRadius: "12px",
  },

  eyeIcon: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
  },

  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    background: "#10B981",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },

  bottomText: {
    marginTop: "20px",
    textAlign: "center",
  },

  linkText: {
    color: "#10B981",
    cursor: "pointer",
  },
};

export default Register;