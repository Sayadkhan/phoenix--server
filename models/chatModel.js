const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    members: Array,
  },
  {
    timestamps: true,
  }
);

const chatModle = mongoose.model("chat", chatSchema);

module.exports = chatModle;
