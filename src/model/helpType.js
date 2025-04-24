const mongoose = require("mongoose");

const HelpTypeSchema = new mongoose.Schema(
  {
    type: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    showIfAuthenticated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const HelpType = mongoose.model("HelpType", HelpTypeSchema);
module.exports = HelpType;
