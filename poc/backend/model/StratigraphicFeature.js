const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stratigraphicFeatureSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  description: String,
  interpretation: String,
  rel_localization: String,
  artifacts: [String],
  type: {
    type: String,
    default: "stratigraphic",
    required: true,
  },
  height_values: String,
  expansion: String,
  consistency_out: String,
  consistency_in: String,
});

module.exports =  mongoose.model("StratigraphicFeature", stratigraphicFeatureSchema, "features");
