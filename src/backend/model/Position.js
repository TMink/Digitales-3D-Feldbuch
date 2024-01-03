/**
 * @ Author: Julian Hardtung
 * @ Create Time: 12.06.2023 11:06:44
 * @ Modified by: Julian Hardtung
 * @ Modified time: 05.12.2023 11:04:04
 * 
 * A mongoose Schema for Positions, which maps to a MongoDb collection.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const positionsSchema = new Schema({
  _id: {
    type: String,
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
