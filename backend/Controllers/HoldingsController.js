const { HoldingsModel } = require("../model/HoldingsModel");

module.exports.getUserHoldings = async (req, res) => {
  try {
    const holdings = await HoldingsModel.find({ user: req.userId });
    res.json(holdings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching holdings", success: false });
  }
};
