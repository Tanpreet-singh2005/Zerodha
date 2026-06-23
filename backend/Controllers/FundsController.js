const User = require("../model/UserModel");
const { OrdersModel } = require("../model/OrdersModel");
const { HoldingsModel } = require("../model/HoldingsModel");

module.exports.getFunds = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Calculate used margin from holdings
    const holdings = await HoldingsModel.find({ user: req.userId });
    const usedMargin = holdings.reduce((sum, h) => sum + h.avg * h.qty, 0);

    // Calculate total buy/sell amounts for payin/payout
    const orders = await OrdersModel.find({ user: req.userId });
    const totalBought = orders
      .filter((o) => o.mode === "BUY")
      .reduce((sum, o) => sum + o.price * o.qty, 0);
    const totalSold = orders
      .filter((o) => o.mode === "SELL")
      .reduce((sum, o) => sum + o.price * o.qty, 0);

    res.json({
      balance: user.balance,
      availableMargin: user.balance,
      usedMargin: usedMargin,
      availableCash: user.balance,
      openingBalance: user.balance,
      payin: totalBought,
      payout: totalSold,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching funds", success: false });
  }
};

module.exports.addFunds = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: "Enter a valid amount", success: false });
    }

    const fundAmount = Number(amount);

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    user.balance += fundAmount;
    await user.save();

    res.json({
      message: `₹${fundAmount.toLocaleString("en-IN")} added successfully`,
      balance: user.balance,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding funds", success: false });
  }
};

module.exports.withdrawFunds = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: "Enter a valid amount", success: false });
    }

    const withdrawAmount = Number(amount);

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    if (user.balance < withdrawAmount) {
      return res.status(400).json({
        message: `Insufficient balance. Available: ₹${user.balance.toLocaleString("en-IN")}`,
        success: false,
      });
    }

    user.balance -= withdrawAmount;
    await user.save();

    res.json({
      message: `₹${withdrawAmount.toLocaleString("en-IN")} withdrawn successfully`,
      balance: user.balance,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error withdrawing funds", success: false });
  }
};
