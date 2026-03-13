const mongoose = require("mongoose");

const MasterSchema = new mongoose.Schema(
  {},
  {
    strict: false,
    collection: "masters",
  },
);

module.exports =
  mongoose.models.Master || mongoose.model("Master", MasterSchema);
