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
