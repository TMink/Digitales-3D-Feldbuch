const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const excavationSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  client: String,
  focus: String,
  length: String,
  location: String,
  organization: String,
  dates: [String],
  sections: [String],
  contacts: [String],
});

module.exports = mongoose.model("Excavation", excavationSchema);
