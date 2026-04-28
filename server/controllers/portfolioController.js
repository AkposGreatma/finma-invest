const db = require("../config/db");

exports.getUserPortfolio = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      p.portfolio_id,
      i.asset_name,
      i.asset_type,
      p.amount_invested,
      p.units_owned
    FROM portfolios p
    JOIN investments i
      ON p.investment_id = i.investment_id
    WHERE p.user_id = ?
    ORDER BY p.portfolio_id DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch portfolio",
        error: err.message,
      });
    }

    res.json(results);
  });
};

exports.getAvailableInvestments = (req, res) => {
  const sql = `
    SELECT investment_id, asset_name, asset_type
    FROM investments
    ORDER BY asset_name ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch available investments",
        error: err.message,
      });
    }

    res.json(results);
  });
};

exports.addInvestment = (req, res) => {
  const userId = req.user.id;
  const { investment_id, amount_invested, units_owned } = req.body;

  const amount = Number(amount_invested);
  const units = Number(units_owned);

  if (!investment_id || !amount || amount <= 0 || !units || units <= 0) {
    return res.status(400).json({
      message: "Please provide a valid investment, amount, and units.",
    });
  }

  db.beginTransaction((transactionErr) => {
    if (transactionErr) {
      return res.status(500).json({
        message: "Failed to start investment transaction",
        error: transactionErr.message,
      });
    }

    const ensureWalletSql = `
      INSERT INTO wallets (user_id, balance)
      VALUES (?, 0)
      ON DUPLICATE KEY UPDATE user_id = user_id
    `;

    db.query(ensureWalletSql, [userId], (walletCreateErr) => {
      if (walletCreateErr) {
        return db.rollback(() => {
          res.status(500).json({
            message: "Failed to prepare wallet",
            error: walletCreateErr.message,
          });
        });
      }

      const checkWalletSql = `
        SELECT balance FROM wallets
        WHERE user_id = ?
        FOR UPDATE
      `;

      db.query(checkWalletSql, [userId], (walletErr, walletResults) => {
        if (walletErr) {
          return db.rollback(() => {
            res.status(500).json({
              message: "Failed to check wallet balance",
              error: walletErr.message,
            });
          });
        }

        const currentBalance = Number(walletResults[0]?.balance || 0);

        if (currentBalance < amount) {
          return db.rollback(() => {
            res.status(400).json({
              message: "Insufficient wallet balance. Please fund your wallet.",
              walletBalance: currentBalance,
            });
          });
        }

        const deductWalletSql = `
          UPDATE wallets
          SET balance = balance - ?
          WHERE user_id = ?
        `;

        db.query(deductWalletSql, [amount, userId], (deductErr) => {
          if (deductErr) {
            return db.rollback(() => {
              res.status(500).json({
                message: "Failed to deduct wallet balance",
                error: deductErr.message,
              });
            });
          }

          const portfolioSql = `
            INSERT INTO portfolios 
              (user_id, investment_id, amount_invested, units_owned)
            VALUES (?, ?, ?, ?)
          `;

          db.query(
            portfolioSql,
            [userId, investment_id, amount, units],
            (portfolioErr) => {
              if (portfolioErr) {
                return db.rollback(() => {
                  res.status(500).json({
                    message: "Failed to create investment holding",
                    error: portfolioErr.message,
                  });
                });
              }

              const referenceCode = `INVEST-${userId}-${Date.now()}`;

              const transactionSql = `
                INSERT INTO \`transactions\`
                  (\`user_id\`, \`type\`, \`amount\`, \`status\`, \`reference_code\`)
                VALUES (?, 'investment_purchase', ?, 'successful', ?)
              `;

              db.query(
                transactionSql,
                [userId, amount, referenceCode],
                (txErr) => {
                  if (txErr) {
                    return db.rollback(() => {
                      res.status(500).json({
                        message:
                          "Investment created but transaction log failed",
                        error: txErr.message,
                      });
                    });
                  }

                  db.commit((commitErr) => {
                    if (commitErr) {
                      return db.rollback(() => {
                        res.status(500).json({
                          message: "Failed to complete investment purchase",
                          error: commitErr.message,
                        });
                      });
                    }

                    res.json({
                      message: "Investment purchased successfully",
                      amountInvested: amount,
                      unitsOwned: units,
                      referenceCode,
                      walletBalance: currentBalance - amount,
                    });
                  });
                }
              );
            }
          );
        });
      });
    });
  });
};