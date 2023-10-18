const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const remainsFeatureSchema = new Schema({
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
    default: "remains",
    required: true,
  },
  preserved_bones: String,
  pathology: String,
  gender: String,
  funeral_type: String,
  burial_type: String,
  burial_construction: String,
  age: String,
});

module.exports = mongoose.model("RemainsFeature", remainsFeatureSchema, "features");
