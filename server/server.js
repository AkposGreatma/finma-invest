const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const walletRoutes = require("./routes/walletRoutes");
const newsRoutes = require("./routes/newsRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/news", newsRoutes);

app.get("/", (req, res) => {
  res.send("Investment System API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/analytics", analyticsRoutes);

const PORT = process.env.PORT || 22745;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});