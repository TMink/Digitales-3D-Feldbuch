/**
 * @ Author: Julian Hardtung
 * @ Create Time: 30.11.2023 15:04:12
 * @ Modified by: Julian Hardtung
 * @ Modified time: 05.12.2023 11:04:56
 * 
 * A mongoose Schema for Users, which maps to a MongoDb collection.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  mail: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
