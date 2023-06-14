const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imagesSchema = new Schema({
  _id: {
    type: Number,
    required: true,
  },
  positionID: Number,
  imageNumber: Number,
  title: String,
  image: [String],
});

module.exports = mongoose.model("Image", imagesSchema);
