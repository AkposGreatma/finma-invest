const express = require("express");
const router = express.Router();

const {
  getUserPortfolio,
  addInvestment,
  getAvailableInvestments,
} = require("../controllers/portfolioController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getUserPortfolio);
router.post("/", authMiddleware, addInvestment);
router.get("/investments", authMiddleware, getAvailableInvestments);

module.exports = router;