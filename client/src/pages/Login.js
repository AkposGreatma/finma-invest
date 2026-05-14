import React, { useState, useEffect } from "react";
import illustration from "../assets/images/investment.png";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function Login() {
  const navigate = useNavigate();
  const { colors, theme } = useTheme();

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setMessage("Please fill in all fields.");
      setMessageType("error");
      return;
    }

    try {
      const res = await loginUser(formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage("Login successful");
      setMessageType("success");

      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
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

            <h1 style={styles.heroTitle}>Smarter investing starts here.</h1>

            <p style={styles.heroText}>
              Track your portfolio, manage assets, and grow your wealth with confidence.
            </p>

            <div style={styles.imageContainer}>
              <img src={illustration} alt="Investment" style={styles.image} />
            </div>
          </div>
        </div>
      )}

      <div style={{ ...styles.rightPanel, padding: isMobile ? "20px" : "40px" }}>
        <div
          style={{
            ...styles.formCard,
            background: colors.card,
            border: `1px solid ${colors.border}`,
            boxShadow: theme === "dark"
              ? "0 10px 30px rgba(0,0,0,0.5)"
              : "0 25px 60px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ ...styles.formTitle, color: colors.text }}>
            Welcome Back
          </h2>

          <p style={{ ...styles.formSubtitle, color: colors.muted }}>
            Login to continue managing your investments.
          </p>

          <form onSubmit={handleSubmit}>
            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              style={{ ...styles.input, background: colors.page, color: colors.text, border: `1px solid ${colors.border}` }}
            />

            <div style={styles.inputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                style={{ ...styles.inputWithIcon, background: colors.page, color: colors.text, border: `1px solid ${colors.border}` }}
              />

              <span onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <button style={styles.button}>Sign In</button>
          </form>

          {message && (
            <p style={{ color: messageType === "success" ? "#10B981" : "#EF4444" }}>
              {message}
            </p>
          )}

          <p style={styles.bottomText}>
            Don’t have an account?{" "}
            <span style={styles.linkText} onClick={() => navigate("/register")}>
              Create one
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

  brandWrap: {
    maxWidth: "460px",
  },

  brandTag: {
    fontSize: "14px",
    fontWeight: "700",
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "16px",
  },

  heroTitle: {
    fontSize: "40px",
    marginBottom: "16px",
  },

  heroText: {
    fontSize: "16px",
    lineHeight: "1.6",
    marginBottom: "30px",
  },

  imageContainer: {
    background: "rgba(255,255,255,0.1)",
    borderRadius: "20px",
    padding: "20px",
    marginTop: "30px",
  },

  image: {
    width: "100%",
    maxWidth: "320px",
    marginTop: "40px",
    display: "block",
  },

  rightPanel: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  formCard: {
    width: "100%",
    maxWidth: "420px",
    borderRadius: "20px",
    padding: "36px",
  },

  formTitle: {
    fontSize: "28px",
    marginBottom: "8px",
  },

  formSubtitle: {
    marginBottom: "24px",
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    marginBottom: "16px",
    borderRadius: "12px",
    fontSize: "15px",
    boxSizing: "border-box",
    outline: "none",
  },

  inputWrapper: {
    position: "relative",
    marginBottom: "16px",
  },

  inputWithIcon: {
    width: "100%",
    padding: "14px 16px",
    paddingRight: "45px",
    borderRadius: "12px",
    fontSize: "15px",
    boxSizing: "border-box",
    outline: "none",
  },

  eyeIcon: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#64748B",
    height: "100%",
    display: "flex",
    alignItems: "center",
  },

  button: {
    width: "100%",
    padding: "14px",
    background: "#10B981",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
  },

  bottomText: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "14px",
  },

  linkText: {
    color: "#10B981",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default Login;