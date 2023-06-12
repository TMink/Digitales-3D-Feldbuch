const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const positionsSchema = new Schema({
  _id: {
    type: Number,
    required: true,
  },
  placeID: Number,
  positionNumber: Number,
  date: String,
  description: String,
  images: [Number],
  places: [Number],
});

module.exports = mongoose.model("Position", positionsSchema);
