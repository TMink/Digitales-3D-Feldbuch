/*
 * Created Date: 09.06.2023 12:37:21
 * Author: Julian Hardtung
 * 
 * Last Modified: 16.12.2023 12:38:46
 * Modified By: Julian Hardtung
 * 
 * Description: A mongoose Schema for Activities, which maps to a MongoDb collection.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activitySchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    activityNumber: String,
    number: Number,
    branchOffice: String,
    year: Number,
    places: [Number],
    lastChanged: Number,
    lastSync: Number,
    editor: [String],

});

module.exports = mongoose.model("Activity", activitySchema);
