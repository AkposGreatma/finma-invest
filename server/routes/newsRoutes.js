const express = require("express");
const router = express.Router();
const { getMarketNews } = require("../controllers/newsController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/market", authMiddleware, getMarketNews);

module.exports = router;