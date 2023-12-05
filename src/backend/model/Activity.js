/**
 * @ Author: Julian Hardtung
 * @ Create Time: 09.06.2023 12:37:21
 * @ Modified by: Julian Hardtung
 * @ Modified time: 05.12.2023 11:05:25
 * 
 * A mongoose Schema for Activities, which maps to a MongoDb collection.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activitySchema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    number: Number,
    branchOffice: String,
    year: Number,
    places: [Number]
});

module.exports = mongoose.model("Activity", activitySchema);
