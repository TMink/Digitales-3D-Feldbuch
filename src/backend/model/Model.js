const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const modelsSchema = new Schema({
  _id: {
    type: Number,
    required: true,
  },
  placeID: Number,
  modelNumber: Number,
  title: String,
  model: String,
  texture: String,
});

module.exports = mongoose.model("Model", modelsSchema);
