import axios from "axios";

const API = axios.create({
  baseURL:
   "https://finma-invest-1.onrender.com/api",
});

export const registerUser = (data) =>
  API.post("/auth/register", data);

export const loginUser = (data) =>
  API.post("/auth/login", data);

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/* =========================
   ANALYTICS
========================= */

export const getAnalyticsSummary = () =>
  API.get("/analytics/summary", getAuthConfig());

export const getPerformanceTrend = () =>
  API.get("/analytics/performance-trend", getAuthConfig());

export const getAssetAllocation = () =>
  API.get("/analytics/asset-allocation", getAuthConfig());

export const getInsights = () =>
  API.get("/analytics/insights", getAuthConfig());

/* =========================
   PORTFOLIO
========================= */

export const getUserPortfolio = () =>
  API.get("/portfolio", getAuthConfig());

export const addInvestment = (data) =>
  API.post("/portfolio", data, getAuthConfig());

export const getAvailableInvestments = () =>
  API.get("/portfolio/investments", getAuthConfig());

/* =========================
   WALLET
========================= */

export const getWallet = () =>
  API.get("/wallet", getAuthConfig());

export const fundWallet = (data) =>
  API.post("/wallet/fund", data, getAuthConfig());

export const initializeWalletFunding = (data) =>
  API.post("/wallet/initialize", data, getAuthConfig());

export const verifyWalletFunding = (reference) =>
  API.get(
    `/wallet/verify?reference=${reference}`,
    getAuthConfig()
  );

/* =========================
   TRANSACTIONS
========================= */

export const getTransactions = () =>
  API.get("/wallet/transactions", getAuthConfig());

export const getRecentTransactions = () =>
  API.get("/wallet/transactions", getAuthConfig());

/* =========================
   MARKET NEWS
========================= */

export const getMarketNews = () =>
  API.get("/news/market", getAuthConfig());

export default API;