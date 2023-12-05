/**
 * @ Author: Julian Hardtung
 * @ Create Time: 11.06.2023 18:12:00
 * @ Modified by: Julian Hardtung
 * @ Modified time: 05.12.2023 11:05:47
 * 
 * A mongoose Schema for Places, which maps to a MongoDb collection.
 */

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
