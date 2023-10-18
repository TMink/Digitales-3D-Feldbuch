const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const placeSchema = new Schema({
  _id: {
    type: Number,
    required: true,
  },
  number: Number,
  date: String,
  address: Number,
  models: [Number],
  positions: [Number]
});

module.exports = mongoose.model("Place", placeSchema);
