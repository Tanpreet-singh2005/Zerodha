const User = require("../model/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ status: false });
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      const user = await User.findById(data.id);
      if (user) return res.json({ status: true, user: user.username });
      else return res.json({ status: false });
    }
  });
};

// Reusable middleware for protecting routes
module.exports.authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Authentication required", success: false });
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token", success: false });
    }
    try {
      const user = await User.findById(data.id);
      if (!user) {
        return res.status(401).json({ message: "User not found", success: false });
      }
      req.userId = user._id;
      req.username = user.username;
      next();
    } catch (error) {
      return res.status(500).json({ message: "Server error", success: false });
    }
  });
};