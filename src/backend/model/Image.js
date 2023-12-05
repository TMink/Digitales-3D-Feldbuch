/**
 * @ Author: Julian Hardtung
 * @ Create Time: 13.06.2023 15:13:04
 * @ Modified by: Julian Hardtung
 * @ Modified time: 05.12.2023 11:05:38
 * 
 * A mongoose Schema for Images, which maps to a MongoDb collection.
 */

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
