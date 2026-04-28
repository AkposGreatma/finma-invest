const db = require("../config/db");


// Summary cards - user specific
exports.getSummary = (req, res) => {
  const userId = req.user.id;

  const summarySql = `
    SELECT 
      COALESCE(SUM(amount_invested), 0) AS totalInvested
    FROM portfolios
    WHERE user_id = ?
  `;

  const bestAssetSql = `
    SELECT 
      i.asset_name,
      SUM(p.amount_invested) AS totalAmount
    FROM portfolios p
    JOIN investments i
      ON p.investment_id = i.investment_id
    WHERE p.user_id = ?
    GROUP BY i.investment_id, i.asset_name
    ORDER BY totalAmount DESC
    LIMIT 1
  `;

  const monthlyGrowthSql = `
    SELECT
      SUM(
        CASE
          WHEN YEAR(date_invested) = YEAR(CURDATE())
           AND MONTH(date_invested) = MONTH(CURDATE())
          THEN amount_invested
          ELSE 0
        END
      ) AS currentMonthTotal,
      SUM(
        CASE
          WHEN YEAR(date_invested) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
           AND MONTH(date_invested) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
          THEN amount_invested
          ELSE 0
        END
      ) AS previousMonthTotal
    FROM portfolios
    WHERE user_id = ?
  `;

  const profitLossSql = `
    SELECT 
      COALESCE(SUM((i.current_price - p.avg_buy_price) * p.units_owned), 0) AS totalProfitLoss
    FROM portfolios p
    JOIN investments i
      ON p.investment_id = i.investment_id
    WHERE p.user_id = ?
  `;

  db.query(summarySql, [userId], (summaryErr, summaryResults) => {
    if (summaryErr) {
      return res.status(500).json({
        message: "Failed to fetch analytics summary",
        error: summaryErr.message,
      });
    }

    const totalInvested = Number(summaryResults[0]?.totalInvested || 0);

    db.query(bestAssetSql, [userId], (assetErr, assetResults) => {
      if (assetErr) {
        return res.status(500).json({
          message: "Failed to fetch best asset",
          error: assetErr.message,
        });
      }

      const bestAsset =
        assetResults.length > 0 ? assetResults[0].asset_name : "No asset yet";

      db.query(monthlyGrowthSql, [userId], (growthErr, growthResults) => {
        if (growthErr) {
          return res.status(500).json({
            message: "Failed to fetch monthly growth",
            error: growthErr.message,
          });
        }

        const currentMonthTotal = Number(growthResults[0]?.currentMonthTotal || 0);
        const previousMonthTotal = Number(growthResults[0]?.previousMonthTotal || 0);

        let monthlyGrowth = "0%";

        if (previousMonthTotal > 0) {
          const growth =
            ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;
          monthlyGrowth = `${growth.toFixed(1)}%`;
        } else if (currentMonthTotal > 0) {
          monthlyGrowth = "100.0%";
        }

        db.query(profitLossSql, [userId], (profitErr, profitResults) => {
          if (profitErr) {
            return res.status(500).json({
              message: "Failed to fetch profit/loss",
              error: profitErr.message,
            });
          }

          const profitLoss = Number(profitResults[0]?.totalProfitLoss || 0);

          res.json({
            portfolioValue: totalInvested,
            profitLoss,
            monthlyGrowth,
            bestAsset,
          });
        });
      });
    });
  });
};
// Line chart data
exports.getPerformanceTrend = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      DATE_FORMAT(date_invested, '%b') AS monthLabel,
      MONTH(date_invested) AS monthNumber,
      COALESCE(SUM(amount_invested), 0) AS monthlyTotal
    FROM portfolios
    WHERE user_id = ?
    GROUP BY MONTH(date_invested), DATE_FORMAT(date_invested, '%b')
    ORDER BY monthNumber ASC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch performance trend",
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res.json({
        labels: [],
        values: [],
      });
    }

    const labels = [];
    const values = [];

    let runningTotal = 0;

    results.forEach((row) => {
      runningTotal += Number(row.monthlyTotal);

      labels.push(row.monthLabel);
      values.push(runningTotal);
    });

    res.json({
      labels,
      values,
    });
  });
};

// Pie chart data
exports.getAssetAllocation = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      i.asset_type,
      SUM(p.amount_invested) AS total
    FROM portfolios p
    JOIN investments i ON p.investment_id = i.investment_id
    WHERE p.user_id = ?
    GROUP BY i.asset_type
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch asset allocation",
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res.json({
        labels: [],
        values: [],
      });
    }

    const labels = results.map((row) => row.asset_type);
    const values = results.map((row) => Number(row.total));

    res.json({
      labels,
      values,
    });
  });
};

exports.getInsights = (req, res) => {
  const userId = req.user.id;

  const largestHoldingSql = `
    SELECT 
      i.asset_name,
      SUM(p.amount_invested) AS totalAmount
    FROM portfolios p
    JOIN investments i
      ON p.investment_id = i.investment_id
    WHERE p.user_id = ?
    GROUP BY i.investment_id, i.asset_name
    ORDER BY totalAmount DESC
    LIMIT 1
  `;

  const allocationSql = `
    SELECT 
      i.asset_type,
      SUM(p.amount_invested) AS totalAmount
    FROM portfolios p
    JOIN investments i
      ON p.investment_id = i.investment_id
    WHERE p.user_id = ?
    GROUP BY i.asset_type
    ORDER BY totalAmount DESC
  `;

  db.query(largestHoldingSql, [userId], (largestErr, largestResults) => {
    if (largestErr) {
      return res.status(500).json({
        message: "Failed to fetch largest holding insight",
        error: largestErr.message,
      });
    }

    db.query(allocationSql, [userId], (allocationErr, allocationResults) => {
      if (allocationErr) {
        return res.status(500).json({
          message: "Failed to fetch allocation insights",
          error: allocationErr.message,
        });
      }

      if (allocationResults.length === 0) {
        return res.json([
          {
            label: "Portfolio Status",
            text: "No portfolio data is available yet. Add investments to begin analytics tracking.",
          },
        ]);
      }

      const largestHolding =
        largestResults.length > 0 ? largestResults[0].asset_name : "No asset yet";

      const dominantAssetType = allocationResults[0].asset_type;
      const assetClassCount = allocationResults.length;

      const insights = [
        {
          label: "Largest Holding",
          text: `${largestHolding} is currently your largest portfolio holding.`,
        },
        {
          label: "Allocation Insight",
          text: `${dominantAssetType} takes the largest share of your current portfolio allocation.`,
        },
        {
          label: "Diversification Insight",
          text: `Your portfolio currently spans ${assetClassCount} asset class${assetClassCount > 1 ? "es" : ""}.`,
        },
      ];

      res.json(insights);
    });
  });
};