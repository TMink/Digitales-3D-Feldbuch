/**
 * @ Author: Julian Hardtung
 * @ Create Time: 13.06.2023 13:50:06
 * @ Modified by: Julian Hardtung
 * @ Modified time: 05.12.2023 11:06:01
 * 
 * A mongoose Schema for Models, which maps to a MongoDb collection.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const modelsSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  placeID: Number,
  modelNumber: Number,
  title: String,
  model: String,
  texture: String,
});

module.exports = mongoose.model("Model", modelsSchema);
