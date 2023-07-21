const express = require("express");
const router = express.Router();

const Section = require("../model/Section");
const RemainsFeature = require("../model/RemainsFeature");
const StratigraphicFeature = require("../model/StratigraphicFeature");
const StructuralFeature = require("../model/StructuralFeature");

/**
 * Returns a full 'feature' object combined
 * with the specific type data for remains
 * @param {JSON} feature feature data
 * @returns
 */
function getRemainsJson(feature) {
  var feature = {
    number: feature.number,
    title: feature.title,
    description: feature.description,
    interpretation: feature.interpretation,
    rel_localization: feature.rel_localization,
    artifacts: feature.artifacts,
    type: feature.type,
    preserved_bones: feature.preserved_bones,
    pathology: feature.pathology,
    gender: feature.gender,
    funeral_type: feature.funeral_type,
    burial_type: feature.burial_type,
    burial_construction: feature.burial_construction,
    age: feature.age,
  };

  return feature;
}

/**
 * Returns a full 'feature' object combined with
 * the specific type data for a statigrafic unit
 *
 * @param {JSON} feature feature data
 * @returns
 */
function getStratigraphicJson(feature) {
  var feature = {
    number: feature.number,
    title: feature.title,
    description: feature.description,
    interpretation: feature.interpretation,
    rel_localization: feature.rel_localization,
    artifacts: feature.artifacts,
    type: feature.type,
    height_values: feature.height_values,
    expansion: feature.expansion,
    consistency_out: feature.consistency_out,
    consistency_in: feature.consistency_in,
  };
  return feature;
}

/**
 * Returns a full 'feature' object combined with
 * the specific type data for a structural inventory
 *
 * @param {JSON} feature feature data
 * @returns
 */
function getStructuralJson(feature) {
  var feature = {
    number: feature.number,
    title: feature.title,
    description: feature.description,
    interpretation: feature.interpretation,
    rel_localization: feature.rel_localization,
    artifacts: feature.artifacts,
    type: feature.type,
    construction: feature.construction,
    masonry: feature.masonry,
    structure: feature.structure,
    style_features: feature.style_features,
    material: feature.material,
    stone_size: feature.stone_size,
    stone_material: feature.stone_material,
    stone_processing: feature.stone_processing,
    spolia: feature.spolia,
    brick_type: feature.brick_type,
    brick_size: feature.brick_size,
    production_characteristics: feature.production_characteristics,
    binding: feature.binding,
    binding_composition: feature.binding_composition,
    grain_size: feature.grain_size,
    bond_consistency: feature.bond_consistency,
    joint_pattern: feature.joint_pattern,
    joint_dimensions: feature.joint_dimensions,
    plaster_surface_design: feature.plaster_surface_design,
    plaster_thickness: feature.plaster_thickness,
    plaster_expansion: feature.plaster_expansion,
    plaster_composition: feature.plaster_composition,
    plaster_consistency: feature.plaster_consistency,
    plaster_aggregates: feature.plaster_aggregates,
    multilayer: feature.multilayer,
  };

  return feature;
}

/**
 * Builds a Json-Object with all information for a feature,
 * depending on which type `(remains, stratigraphic, structural)` it is
 *
 * @param {*} doc raw feature data 
 * @returns feature Json-Object with all required fields
 */
async function getFeatureJson(doc) {
  // get correct feature Json data depending on feature type
  if (doc.type == "remains") {
    return getRemainsJson(doc);
  } else if (doc.type == "stratigraphic") {
    return getStratigraphicJson(doc);
  } else {
    return getStructuralJson(doc);
  }
}


/**
 * GET all features by id-array in params separated by `,`
 */
router.get("/list/:feature_ids", async function (req, res, next) {

  var feature_ids = req.params.feature_ids.split(",");

  try {
    var featuresArray = await RemainsFeature.find({ _id: feature_ids }).exec();
  } catch (error) {
    res.status(404).send("No features found");
  }

  res.status(200).send(featuresArray);
});


/**
 * GET one feature from MongoDB by feature_id
 */
router.get("/:feature_id", async function (req, res, next) {
  try {
    var feature = await RemainsFeature.findById(req.params.feature_id).exec();
  } catch (error) {
    res.status(404).send("No feature with ID: " + req.params.feature_id + " found");
  }
  res.status(200).send(feature);
});


/**
 * GET features by section_id
 */
router.get("/section_id/:section_id", async function (req, res, next) {
  // get section by id from MongoDB
  try {
    var section = await Section.findById(req.params.section_id).exec();
  } catch (error) {
    res.status(404).send("No section with id: " + req.params.section_id);
  }

  //get all excavations by id from the excavation.sections array
  try {
    var featuresArray = await RemainsFeature.find({ _id: section.features }).exec();
  } catch (error) {
    res.status(404).send("No features found");
  }

  res.status(200).send(featuresArray);
});


/**
 * POST new feature to MongoDB
 */
router.post("/:section_id", async function (req, res, next) {
  //create feature JSON object for updating the featureDB

  var newFeature = await getFeatureJson(req.body);
  var featRes;

  // create new feature depending on type in MongoDB
  if (req.body.type == "remains") {
    featRes = await RemainsFeature.create(newFeature);
  } else if (req.body.type == "stratigraphic") {
    featRes = await StratigraphicFeature.create(newFeature);
  } else {
    featRes = await StructuralFeature.create(newFeature);
  }

  // get currently used section by id
  try {
    var section = await Section.findById(req.params.section_id).exec();
  } catch (error) {
    res.status(404).send("No section with ID: " + req.params.section_id + " found");
  }

  // add newly created feature id to this section
  section.features.push(featRes.id);

  // update the edited section in MongoDB
  try {
    var section = await Section.findByIdAndUpdate(req.params.section_id, section);
  } catch (error) {
    res.status(404).send("No section with ID: " + req.params.section_id + " found");
  }

  res.status(200).send("Successfully added the feature");
});


/**
 * PUT existing feature in MongoDB by id
 */
router.put("/:feature_id", async function (req, res, next) {
  var updatedFeature = await getFeatureJson(req.body);

  try {
    const result = await RemainsFeature.findByIdAndUpdate(req.params.feature_id, updatedFeature);

    res.status(200).send("Edited Feature: " + result);
  } catch (error) {
    res.status(500).send("Couldn't edit Feature: " + error.message);
  }
});


/**
 * DELETE existing feature from MongoDB
 * Also deletes its id from the section.features array
 */
router.delete("/:section_id/:feature_id", async function (req, res, next) {
  // delete section from MongoDB by id
  try {
    const result = await RemainsFeature.findByIdAndDelete(req.params.feature_id);
  } catch (error) {
    res.status(500).send("Couldn't delete Feature: " + error.message);
  }

  // get section from MongoDB by id
  try {
    var section = await Section.findById(req.params.section_id).exec();
  } catch (error) {
    res.status(404).send("No section with ID: " + req.params.section_id + " found");
  }

  // remove the deleted feature id from this section
  const index = section.features.indexOf(req.params.feature_id);

  if (index > -1) {
    section.features.splice(index, 1);
  } else {
    res.status(400).send("The deleted feature is not part of the current section");
  }

  // update the edited section in MongoDB
  try {
    var section = await Section.findByIdAndUpdate(req.params.section_id, section);
  } catch (error) {
    res.status(404).send("No section with ID: " + req.params.section_id + " found");
  }

  res.status(200).send("Successfully deleted feature");
});

module.exports = router;
