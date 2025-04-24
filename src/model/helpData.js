const mongoose = require("mongoose");

const HelpDataSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, ref: "HelpType" }, 
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const HelpData = mongoose.model("HelpData", HelpDataSchema);
module.exports = HelpData;
