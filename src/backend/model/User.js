/*
 * Created Date: 30.11.2023 15:04:12
 * Author: Julian Hardtung
 * 
 * Last Modified: 29.03.2024 14:20:22
 * Modified By: Julian Hardtung
 * 
 * Description: A mongoose Schema for Users, which maps to a MongoDb collection
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
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
  activities: {
    type: [String],
  },
});

module.exports = mongoose.model("User", userSchema);
