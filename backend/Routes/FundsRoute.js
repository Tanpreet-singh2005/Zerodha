const router = require("express").Router();
const { authenticateToken } = require("../Middlewares/AuthMiddleware");
const { getFunds, addFunds, withdrawFunds } = require("../Controllers/FundsController");

router.get("/funds", authenticateToken, getFunds);
router.post("/funds/add", authenticateToken, addFunds);
router.post("/funds/withdraw", authenticateToken, withdrawFunds);

module.exports = router;
