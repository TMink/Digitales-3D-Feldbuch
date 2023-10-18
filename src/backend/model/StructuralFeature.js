const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const structuralFeatureSchema = new Schema({
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
    default: "structural",
    required: true,
  },
  construction: String,
  masonry: String,
  structure: String,
  style_features: String,
  material: String,
  stone_size: String,
  stone_material: String,
  stone_processing: String,
  spolia: String,
  brick_type: String,
  brick_size: String,
  production_characteristics: String,
  binding: String,
  binding_composition: String,
  grain_size: String,
  bond_consistency: String,
  joint_pattern: String,
  joint_dimensions: String,
  plaster_surface_design: String,
  plaster_thickness: String,
  plaster_expansion: String,
  plaster_composition: String,
  plaster_consistency: String,
  plaster_aggregates: String,
  multilayer: String,
});

module.exports = mongoose.model("StructuralFeature", structuralFeatureSchema, "features");
