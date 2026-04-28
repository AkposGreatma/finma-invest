const express = require("express");
const router = express.Router();
const { getWallet, fundWallet, getTransactions, initializeWalletFunding, verifyWalletFunding, } = require("../controllers/walletController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/transactions", authMiddleware, getTransactions);
router.get("/", authMiddleware, getWallet);
router.post("/fund", authMiddleware, fundWallet);
router.post("/initialize", authMiddleware, initializeWalletFunding);
router.get("/verify", authMiddleware, verifyWalletFunding);

module.exports = router;