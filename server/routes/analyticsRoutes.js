const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/summary", authMiddleware, analyticsController.getSummary);
router.get("/performance-trend", authMiddleware, analyticsController.getPerformanceTrend);
router.get("/asset-allocation", authMiddleware, analyticsController.getAssetAllocation);
router.get("/insights", authMiddleware, analyticsController.getInsights);

module.exports = router;