const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// ================= REGISTER =================
const registerUser = (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password are required",
    });
  }

  // check if user exists
  const checkUserSql = "SELECT * FROM users WHERE email = ?";
  db.query(checkUserSql, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (results.length > 0) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertUserSql = `
        INSERT INTO users (name, email, password, phone)
        VALUES (?, ?, ?, ?)
      `;

      db.query(
        insertUserSql,
        [name, email, hashedPassword, phone || null],
        (err, result) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          }

          const userId = result.insertId;

          // create wallet automatically
          const walletSql = `
            INSERT INTO wallets (user_id, balance)
            VALUES (?, 0)
          `;

          db.query(walletSql, [userId]);

          const token = jwt.sign(
            { id: userId, email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
          );

          res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
              id: userId,
              name,
              email,
            },
          });
        }
      );
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// ================= LOGIN =================
const loginUser = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = results[0];

    try {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }

      const token = jwt.sign(
        { id: user.user_id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.user_id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// 🔥 VERY IMPORTANT EXPORT
module.exports = {
  registerUser,
  loginUser,
};