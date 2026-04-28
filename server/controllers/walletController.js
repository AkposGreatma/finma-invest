const db = require("../config/db");
const axios = require("axios");

exports.initializeWalletFunding = async (req, res) => {
  const userId = req.user.id;
  const { amount, email } = req.body;

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({
      message: "Enter a valid funding amount",
    });
  }

  if (!email) {
    return res.status(400).json({
      message: "User email is required for payment initialization",
    });
  }

  try {
    const reference = `FUND-${userId}-${Date.now()}`;

    const paystackRes = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: Math.round(Number(amount) * 100),
        reference,
        callback_url: process.env.PAYSTACK_CALLBACK_URL,
        metadata: {
          user_id: userId,
          purpose: "wallet_funding",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      message: "Payment initialized",
      authorization_url: paystackRes.data.data.authorization_url,
      reference,
    });
  } catch (error) {
    console.error(
      "Paystack initialize error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      message: "Failed to initialize payment",
      error:
        error.response?.data?.message ||
        error.message ||
        "Unknown Paystack initialization error",
    });
  }
};

// Get wallet balance
exports.getWallet = (req, res) => {
  const userId = req.user.id;

  const checkSql = `
    SELECT * FROM wallets WHERE user_id = ?
  `;

  db.query(checkSql, [userId], (checkErr, checkResults) => {
    if (checkErr) {
      return res.status(500).json({
        message: "Failed to fetch wallet",
        error: checkErr.message,
      });
    }

    if (checkResults.length === 0) {
      const createSql = `
        INSERT INTO wallets (user_id, balance)
        VALUES (?, 0)
      `;

      db.query(createSql, [userId], (createErr) => {
        if (createErr) {
          return res.status(500).json({
            message: "Failed to create wallet",
            error: createErr.message,
          });
        }

        return res.json({
          balance: 0,
        });
      });
    } else {
      res.json({
        balance: Number(checkResults[0].balance),
      });
    }
  });
};

// Manual fund wallet fallback
exports.fundWallet = (req, res) => {
  const userId = req.user.id;
  const { amount } = req.body;

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({
      message: "Enter a valid funding amount",
    });
  }

  const checkSql = `
    SELECT * FROM wallets WHERE user_id = ?
  `;

  db.query(checkSql, [userId], (checkErr, checkResults) => {
    if (checkErr) {
      return res.status(500).json({
        message: "Failed to access wallet",
        error: checkErr.message,
      });
    }

    const ensureWallet = (callback) => {
      if (checkResults.length === 0) {
        const createSql = `
          INSERT INTO wallets (user_id, balance)
          VALUES (?, 0)
        `;

        db.query(createSql, [userId], (createErr) => {
          if (createErr) {
            return res.status(500).json({
              message: "Failed to create wallet",
              error: createErr.message,
            });
          }

          callback();
        });
      } else {
        callback();
      }
    };

    ensureWallet(() => {
      const updateSql = `
        UPDATE wallets
        SET balance = balance + ?
        WHERE user_id = ?
      `;

      db.query(updateSql, [amount, userId], (updateErr) => {
        if (updateErr) {
          return res.status(500).json({
            message: "Failed to fund wallet",
            error: updateErr.message,
          });
        }

        const referenceCode = `FUND-${Date.now()}`;

        const transactionSql = `
          INSERT INTO \`transactions\` (\`user_id\`, \`type\`, \`amount\`, \`status\`, \`reference_code\`)
          VALUES (?, 'wallet_funding', ?, 'successful', ?)
        `;

        db.query(
          transactionSql,
          [userId, amount, referenceCode],
          (transactionErr) => {
            if (transactionErr) {
              return res.status(500).json({
                message: "Wallet funded but transaction log failed",
                error: transactionErr.message,
              });
            }

            const walletSql = `
              SELECT balance FROM wallets WHERE user_id = ?
            `;

            db.query(walletSql, [userId], (walletErr, walletResults) => {
              if (walletErr) {
                return res.status(500).json({
                  message: "Funding succeeded but failed to fetch updated balance",
                  error: walletErr.message,
                });
              }

              res.json({
                message: "Wallet funded successfully",
                balance: Number(walletResults[0].balance),
              });
            });
          }
        );
      });
    });
  });
};

// Get user transactions
exports.getTransactions = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      \`transaction_id\`,
      \`type\`,
      \`amount\`,
      \`status\`,
      \`reference_code\`,
      \`created_at\`
    FROM \`transactions\`
    WHERE \`user_id\` = ?
    ORDER BY \`created_at\` DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Transactions fetch error:", err);
      return res.status(500).json({
        message: "Failed to fetch transactions",
        error: err.message,
      });
    }

    res.json(results);
  });
};

exports.verifyWalletFunding = async (req, res) => {
  const userId = req.user.id;
  const { reference } = req.query;

  if (!reference) {
    return res.status(400).json({
      message: "Transaction reference is required",
    });
  }

  try {
    const verifyRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paymentData = verifyRes.data.data;

    if (paymentData.status !== "success") {
      return res.status(400).json({
        message: "Payment not successful",
        status: paymentData.status,
      });
    }

    const amount = Number(paymentData.amount) / 100;

    const checkWalletSql = `SELECT * FROM wallets WHERE user_id = ?`;

    db.query(checkWalletSql, [userId], (checkErr, checkResults) => {
      if (checkErr) {
        return res.status(500).json({
          message: "Failed to access wallet",
          error: checkErr.message,
        });
      }

      const ensureWallet = (callback) => {
        if (checkResults.length === 0) {
          const createSql = `
            INSERT INTO wallets (user_id, balance)
            VALUES (?, 0)
          `;

          db.query(createSql, [userId], (createErr) => {
            if (createErr) {
              return res.status(500).json({
                message: "Failed to create wallet",
                error: createErr.message,
              });
            }

            callback();
          });
        } else {
          callback();
        }
      };

      ensureWallet(() => {
        const duplicateCheckSql = `
          SELECT *
          FROM \`transactions\`
          WHERE \`reference_code\` = ? AND \`user_id\` = ?
          LIMIT 1
        `;

        db.query(
          duplicateCheckSql,
          [reference, userId],
          (dupErr, dupResults) => {
            if (dupErr) {
              console.error("Duplicate reference check error:", dupErr);
              return res.status(500).json({
                message: "Failed to validate transaction reference",
                error: dupErr.message,
              });
            }

            if (dupResults.length > 0) {
              const walletSql = `SELECT balance FROM wallets WHERE user_id = ?`;

              return db.query(
                walletSql,
                [userId],
                (walletErr, walletResults) => {
                  if (walletErr) {
                    return res.status(500).json({
                      message:
                        "Payment already verified, but failed to fetch wallet",
                      error: walletErr.message,
                    });
                  }

                  return res.json({
                    message: "Payment already verified previously",
                    balance: Number(walletResults[0]?.balance || 0),
                  });
                }
              );
            }

            const updateWalletSql = `
              UPDATE wallets
              SET balance = balance + ?
              WHERE user_id = ?
            `;

            db.query(updateWalletSql, [amount, userId], (walletErr) => {
              if (walletErr) {
                return res.status(500).json({
                  message: "Failed to update wallet balance",
                  error: walletErr.message,
                });
              }

              const transactionSql = `
                INSERT INTO \`transactions\` (\`user_id\`, \`type\`, \`amount\`, \`status\`, \`reference_code\`)
                VALUES (?, 'wallet_funding', ?, 'successful', ?)
              `;

              db.query(transactionSql, [userId, amount, reference], (txErr) => {
                if (txErr) {
                  console.error("Transaction insert error:", txErr);
                  return res.status(500).json({
                    message: "Wallet updated but transaction log failed",
                    error: txErr.message,
                  });
                }

                const walletSql = `SELECT balance FROM wallets WHERE user_id = ?`;

                db.query(
                  walletSql,
                  [userId],
                  (finalErr, finalResults) => {
                    if (finalErr) {
                      return res.status(500).json({
                        message:
                          "Verification succeeded but failed to fetch wallet",
                        error: finalErr.message,
                      });
                    }

                    res.json({
                      message:
                        "Payment verified and wallet funded successfully",
                      balance: Number(finalResults[0].balance),
                    });
                  }
                );
              });
            });
          }
        );
      });
    });
  } catch (error) {
    console.error(
      "Paystack verify error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      message: "Failed to verify payment",
      error:
        error.response?.data?.message ||
        error.message ||
        "Unknown Paystack verification error",
    });
  }
};