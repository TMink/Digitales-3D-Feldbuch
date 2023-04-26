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
  var features_with_type = await Promise.all(featuresArray.docs.map(async (item) => {
      // get the type specific data for each feature
      var feature_type = await feature_typesDB.doc(item.data().type_id).get()

      // combine general feature data with the type specific data
      // depending if the type is remains, statigrafic or structural
      var feature_type_data = {};

      if (feature_type.data().type == "Stratigrafische Einheit") {
        feature_type_data = getStatigraphicUnit(item, feature_type.data());

      } else if (feature_type.data().type === "Überreste") {
        feature_type_data = getRemains(item, feature_type.data());

      } else if (feature_type.data().type === "Baulicher Bestand") {
        feature_type_data = getStructuralInventory(item, feature_type.data());

      } else {
        res.status(404).send("Couldn't find feature type")
      }
      return feature_type_data;
    })
  );
  res.status(200).send(features_with_type);
});

/* GET feature by ID */
router.get("/:feature_id", function (req, res, next) {
  featuresDB
    .doc(req.params.feature_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        var feature = {
          id: doc.id,
          section_id: doc.data().section_id,
          number: doc.data().number,
          title: doc.data().title,
          description: doc.data().description,
          rel_localization: doc.data().rel_localization,
          type_id: doc.data().type_id,
        };
        res.send(feature);
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
  //check if excavation_id exists
  excavations
    .doc(req.body.excavation_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        //if it exists, add the feature to DB
        featuresDB
          .doc()
          .set(req.body)
          .then((response) => {
            res.status(200).send("Added Feature");
          })
          .catch((err) => {
            res.status(404).send("Couldn't add feature: " + err);
          });
      } else {
        res.status(404).send("No such excavation");
      }
    })
    .catch((err) => {
      res.status(404).send("Excavation not found: " + err);
    });
});

/* UPDATE feature by ID*/
router.put("/:feature_id", function (req, res, next) {
  //check if excavation_id exists
  excavations
    .doc(req.body.excavation_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        //if it exists, add the feature to DB
        featuresDB
          .doc(req.params.feature_id)
          .update(req.body)
          .then((response) => {
            res.status(200).send("Updated Feature");
          })
          .catch((err) => {
            res.status(404).send("Couldn't update feature: " + err);
          });
      } else {
        res.status(404).send("No such excavation");
      }
    })
    .catch((err) => {
      res.status(404).send("Excavation not found: " + err);
    });
});

/* DELETE feature by ID*/
router.delete("/:feature_id", async function (req, res, next) {
  //TODO: when deleting a feature, also delete all subcollections
  featuresDB
    .doc(req.params.feature_id)
    .delete({ exists: true })
    .then((response) => {
      res.status(200).send("Deleted feature: " + req.params.feature_id);
    })
    .catch((err) => {
      res.status(404).send("Couldn't delete feature: " + err);
    });
});

module.exports = router;
