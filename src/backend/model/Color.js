const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const colorSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  hexa: String,
  red: String,
  green: String,
  blue: String,
});

module.exports = mongoose.model("Color", colorSchema);
