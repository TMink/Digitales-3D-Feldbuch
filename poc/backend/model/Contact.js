const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    firstname: String,
  surname: {
    type: String,
    required: true,
  },
  mail: String,
  phone: String,
  role: String
});

module.exports = mongoose.model("Contact", contactSchema);
