const router = require("express").Router();
const { authenticateToken } = require("../Middlewares/AuthMiddleware");
const { placeOrder, getUserOrders } = require("../Controllers/OrdersController");

router.post("/orders", authenticateToken, placeOrder);
router.get("/orders", authenticateToken, getUserOrders);

module.exports = router;
