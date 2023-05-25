const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const utmSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  eastvalue: String,
  northvalue: String,
  heightvalue: String,
});

module.exports = mongoose.model("UTMPoint", utmSchema);
