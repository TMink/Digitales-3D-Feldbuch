const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const artifactSchema = new Schema({
  number: {
    type: Number,
    required: true,
  },
  description: String,
  inscriptions: String,
  state: String,
  literature: String,
  producer: String,
  material: String,
  type: String,
  images: [String],
  colors: [String],
  datings: [String],
  utmPoints: [String],
  measurements: [String],
  dates: [String],
});

module.exports = mongoose.model("Artifact", artifactSchema);
