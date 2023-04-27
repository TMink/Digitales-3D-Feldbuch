const express = require("express");
const router = express.Router();
const db = require("../fb");
const excavations = db.collection("excavations");
const featuresDB = db.collection("features");
const feature_typesDB = db.collection("feature-types");

/**
 * Returns a full 'feature' object combined
 * with the specific type data for remains
 * @param {JSON} feature general feature data
 * @param {JSON} type type specific feature data
 * @returns
 */
function getRemains(feature, type) {
  var feature = {
    id: feature.id,
    section_id: feature.data().section_id,
    number: feature.data().number,
    title: feature.data().title,
    description: feature.data().description,
    interpretation: feature.data().interpretation,
    rel_localization: feature.data().rel_localization,
    type_id: feature.data().type_id,
    preserved_bones: type.preserved_bones,
    pathology: type.pathology,
    gender: type.gender,
    funeral_type: type.funeral_type,
    burial_type: type.burial_type,
    burial_construction: type.burial_construction,
    age: type.age,
  };

  return feature;
}

/**
 * Returns a full 'feature' object combined with
 * the specific type data for a statigrafic unit
 *
 * @param {JSON} feature general feature data
 * @param {JSON} type type specific feature data
 * @returns
 */
function getStatigraphicUnit(feature, type) {
  var feature = {
    id: feature.id,
    section_id: feature.data().section_id,
    number: feature.data().number,
    title: feature.data().title,
    description: feature.data().description,
    interpretation: feature.data().interpretation,
    rel_localization: feature.data().rel_localization,
    type_id: feature.data().type_id,
    type: type.type,
    height_values: type.height_values,
    expansion: type.expansion,
    consistency_out: type.consistency_out,
    consistency_in: type.consistency_in,
  };
  return feature;
}

/**
 * Returns a full 'feature' object combined with
 * the specific type data for a structural inventory
 *
 * @param {JSON} feature general feature data
 * @param {JSON} type type specific feature data
 * @returns
 */
function getStructuralInventory(feature, type) {
  var feature = {
    id: feature.id,
    section_id: feature.data().section_id,
    number: feature.data().number,
    title: feature.data().title,
    description: feature.data().description,
    interpretation: feature.data().interpretation,
    rel_localization: feature.data().rel_localization,
    type_id: feature.data().type_id,
    type: type.type,
    construction: type.construction,
    masonry: type.masonry,
    structure: type.structure,
    style_features: type.style_features,
    material: type.material,
    stone_size: type.stone_size,
    stone_material: type.stone_material,
    stone_processing: type.stone_processing,
    spolia: type.spolia,
    brick_type: type.brick_type,
    brick_size: type.brick_size,
    production_characteristics: type.production_characteristics,
    binding: type.binding,
    binding_composition: type.binding_composition,
    grain_size: type.grain_size,
    bond_consistency: type.bond_consistency,
    joint_pattern: type.joint_pattern,
    joint_dimensions: type.joint_dimensions,
    plaster_surface_design: type.plaster_surface_design,
    plaster_thickness: type.plaster_thickness,
    plaster_expansion: type.plaster_expansion,
    plaster_composition: type.plaster_composition,
    plaster_consistency: type.plaster_consistency,
    plaster_aggregates: type.plaster_aggregates,
    multilayer: type.multilayer,
  };

  return feature;
}

/* GET ALL features */
router.get("/", async function (req, res, next) {
  var featuresArray = [];

  // get features from db
  try {
    var featuresArray = await featuresDB.get();
  } catch (error) {
    res.status(500).send("Error retrieving features from database");
  }

  //map through all features and combine them with the type specific data
  var fullFeaturesArray = await Promise.all(
    featuresArray.docs.map(async (item) => {
      // get the type specific data for each feature
      var featureType = await feature_typesDB.doc(item.data().type_id).get();

      // combine general feature data with the type specific data
      // depending if the type is remains, statigrafic or structural
      var fullFeature = {};

      if (featureType.data().type == "Stratigrafische Einheit") {
        fullFeature = getStatigraphicUnit(item, featureType.data());
      } else if (featureType.data().type === "Überreste") {
        fullFeature = getRemains(item, featureType.data());
      } else if (featureType.data().type === "Baulicher Bestand") {
        fullFeature = getStructuralInventory(item, featureType.data());
      } else {
        res.status(404).send("Couldn't find feature type");
      }
      return fullFeature;
    })
  );
  res.status(200).send(fullFeaturesArray);
});

/* GET feature by ID */
router.get("/:feature_id", function (req, res, next) {
  featuresDB
    .doc(req.params.feature_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        // get the type specific data for the feature
        feature_typesDB
          .doc(doc.data().type_id)
          .get()
          .then((featureType) => {
            // combine general feature data with the type specific data
            // depending if the type is remains, statigrafic or structural
            var fullFeature = {};

            if (featureType.data().type == "Stratigrafische Einheit") {
              fullFeature = getStatigraphicUnit(doc, featureType.data());
            } else if (featureType.data().type === "Überreste") {
              fullFeature = getRemains(doc, featureType.data());
            } else if (featureType.data().type === "Baulicher Bestand") {
              fullFeature = getStructuralInventory(doc, featureType.data());
            } else {
              res.status(404).send("Couldn't find feature type");
            }

            res.status(200).send(fullFeature);
          });
      } else {
        res.status(404).send("No such document: ");
      }
    })
    .catch((err) => {
      res.status(404).send("feature not found: " + err);
    });
});

/* POST new feature */
router.post("/", function (req, res, next) {
  //create feature JSON object for updating the featureDB
  var feature = {
    section_id: req.body.section_id,
    number: req.body.number,
    title: req.body.title,
    description: req.body.description,
    interpretation: req.body.interpretation,
    rel_localization: req.body.rel_localization,
    type_id: req.body.type_id,
  };

  var feature_type = req.body;

  //remove all feature fields so only the type data remains
  delete feature_type.section_id;
  delete feature_type.number;
  delete feature_type.title;
  delete feature_type.description;
  delete feature_type.interpretation;
  delete feature_type.rel_localization;
  delete feature_type.type_id;

  //add the feature_type to DB
  feature_typesDB
    .add(feature_type)
    .then((response) => {
      //add the newly created type_id to the feature json and write to DB
      feature.type_id = response.id;

      featuresDB
        .add(feature)
        .then((response) => {
          res.status(200).send("Added Feature + Type Documents");
        })
        .catch((err) => {
          res.status(404).send("Couldn't add feature: " + err);
        });
    })
    .catch((err) => {
      res.status(404).send("Couldn't add feature: " + err);
    });
});

/* UPDATE feature by ID*/
router.put("/:feature_id", function (req, res, next) {
  //create feature JSON object for updating the featureDB
  var feature = {
    section_id: req.body.section_id,
    number: req.body.number,
    title: req.body.title,
    description: req.body.description,
    interpretation: req.body.interpretation,
    rel_localization: req.body.rel_localization,
    type_id: req.body.type_id,
  };

  //update featureDB
  featuresDB
    .doc(req.params.feature_id)
    .update(feature)
    .then((res) => {
      var feature_type = req.body;

      //remove all feature fields so only the type data remains
      delete feature_type.section_id;
      delete feature_type.number;
      delete feature_type.title;
      delete feature_type.description;
      delete feature_type.interpretation;
      delete feature_type.rel_localization;
      delete feature_type.type_id;

      //update the feature_typesDB
      feature_typesDB
        .doc(feature.type_id)
        .update(feature_type)
        .then((res) => {
          res.status(200).send("Updated feature and feature type ");
        })
        .catch((err) => {
          res.status(404).send("Couldn't update feature_type: " + err);
        });
    })
    .catch((err) => {
      res.status(404).send("Couldn't update feature: " + err);
    });
});

/* DELETE feature by ID*/
router.delete("/:feature_id/:feature_type_id", async function (req, res, next) {
  //delete the feature document
  featuresDB
    .doc(req.params.feature_id)
    .delete({ exists: true })
    .then((res) => {

      //delete the connected feature_type document
      feature_typesDB
        .doc(req.params.feature_type_id)
        .delete({ exists: true })
        .then((res) => {
          res.status(200).send("Deleted feature: " + req.params.feature_id);
        })
        .catch((err) => {
          res.status(404).send("Couldn't delete feature: " + err);
        });
    })
    .catch((err) => {
      res.status(404).send("Couldn't delete feature: " + err);
    });
});

module.exports = router;
