const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  created: {
    type: Date,
  },
  updated: {
    type: Date,
  },
});

module.exports = Task = mongoose.model("task", TaskSchema);