const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sectionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  startLevel: String,
  endLevel: String,
  contacts: [String],
  features: [String],
  artifacts: [String],
  models: [String],
});

module.exports = mongoose.model("Section", sectionSchema);
