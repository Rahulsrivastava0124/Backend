const Master = require("../../models/Master");

// Get all records from masters collection
exports.getMasters = async (req, res) => {
  try {
    const masters = await Master.find().lean();
    res.json(masters);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
