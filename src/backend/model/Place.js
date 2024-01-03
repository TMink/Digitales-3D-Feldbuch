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
    type: String,
    required: true,
  },
  activityID: String,
  placeNumber: Number,
  title: String,
  dating: String,
  restFinding: Boolean,
  right: Number,
  rightTo: Number,
  up: Number,
  upTo: Number,
  depthBot: Number,
  depthTop: Number,
  plane: String,
  profile: String,
  visibility: Number,
  drawing: [Number],
  description: String,
  editor: String,
  date: String,
  technical: String,
  positions: [Number],
  images: [Number],
  models: [Number],
  lines: [Number],
  modulePreset: Object,
  lastChanged: Number,
  lastSync: Number
});

module.exports = mongoose.model("Place", placeSchema);
