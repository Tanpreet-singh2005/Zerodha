const { OrdersModel } = require("../model/OrdersModel");
const { HoldingsModel } = require("../model/HoldingsModel");
const User = require("../model/UserModel");

module.exports.placeOrder = async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;
    const userId = req.userId;

    if (!name || !qty || !price || !mode) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const quantity = Number(qty);
    const orderPrice = Number(price);

    if (quantity <= 0 || orderPrice <= 0) {
      return res.status(400).json({ message: "Quantity and price must be positive", success: false });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const totalCost = orderPrice * quantity;

    if (mode === "BUY") {
      // Check if user has sufficient balance
      if (user.balance < totalCost) {
        return res.status(400).json({
          message: `Insufficient funds. Required: ₹${totalCost.toFixed(2)}, Available: ₹${user.balance.toFixed(2)}`,
          success: false,
        });
      }

      // Deduct balance
      user.balance -= totalCost;
      await user.save();

      // Find existing holding for this user + stock
      const existingHolding = await HoldingsModel.findOne({ user: userId, name: name });

      if (existingHolding) {
        // Update: recalculate avg cost and increase qty
        const totalOldCost = existingHolding.avg * existingHolding.qty;
        const totalNewCost = orderPrice * quantity;
        const newQty = existingHolding.qty + quantity;
        const newAvg = (totalOldCost + totalNewCost) / newQty;

        existingHolding.qty = newQty;
        existingHolding.avg = newAvg;
        existingHolding.price = orderPrice;
        existingHolding.net = (((orderPrice - newAvg) / newAvg) * 100).toFixed(2) + "%";
        existingHolding.day = "+0.00%";
        await existingHolding.save();
      } else {
        // Create new holding
        const newHolding = new HoldingsModel({
          name: name,
          qty: quantity,
          avg: orderPrice,
          price: orderPrice,
          net: "+0.00%",
          day: "+0.00%",
          user: userId,
        });
        await newHolding.save();
      }

      // Create order record
      const order = new OrdersModel({
        name: name,
        qty: quantity,
        price: orderPrice,
        mode: "BUY",
        user: userId,
      });
      await order.save();

      return res.status(201).json({
        message: "Buy order placed successfully",
        success: true,
        balance: user.balance,
      });

    } else if (mode === "SELL") {
      // Find existing holding
      const existingHolding = await HoldingsModel.findOne({ user: userId, name: name });

      if (!existingHolding) {
        return res.status(400).json({ message: "You don't hold this stock", success: false });
      }

      if (existingHolding.qty < quantity) {
        return res.status(400).json({
          message: `Insufficient quantity. You hold ${existingHolding.qty} shares of ${name}`,
          success: false,
        });
      }

      // Add sale proceeds to balance
      user.balance += totalCost;
      await user.save();

      // Reduce qty
      existingHolding.qty -= quantity;

      if (existingHolding.qty === 0) {
        await HoldingsModel.deleteOne({ _id: existingHolding._id });
      } else {
        existingHolding.price = orderPrice;
        existingHolding.net = (((orderPrice - existingHolding.avg) / existingHolding.avg) * 100).toFixed(2) + "%";
        await existingHolding.save();
      }

      // Create order record
      const order = new OrdersModel({
        name: name,
        qty: quantity,
        price: orderPrice,
        mode: "SELL",
        user: userId,
      });
      await order.save();

      return res.status(201).json({
        message: "Sell order placed successfully",
        success: true,
        balance: user.balance,
      });

    } else {
      return res.status(400).json({ message: "Invalid mode. Use BUY or SELL", success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error placing order", success: false });
  }
};

module.exports.getUserOrders = async (req, res) => {
  try {
    const orders = await OrdersModel.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching orders", success: false });
  }
};
