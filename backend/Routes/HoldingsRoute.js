const router = require("express").Router();
const { authenticateToken } = require("../Middlewares/AuthMiddleware");
const { getUserHoldings } = require("../Controllers/HoldingsController");

router.get("/holdings", authenticateToken, getUserHoldings);

module.exports = router;
