const express = require("express");
const router = express.Router();
const db = require("../fb");
const excavations = db.collection("excavations");
const sections = db.collection("sections");
var admin = require("firebase-admin");


/**
 * Takes the retrieved data from DB and builds a JSON-object
 * with all fields for a section. Also creates empty fields,
 * when there is no data for them.
 *
 * @param {*} doc The raw section data from database
 * @returns excavation Json-Object with all required fields
 */
function getSectionJson(doc) {
  return {
    id: doc.id,
    title: doc.data().title,
    description: doc.data().description,
    startLevel: doc.data().startLevel,
    endLevel: doc.data().endLevel,
    contacts: doc.data().contacts,
    features: doc.data().features,
    artifacts: doc.data().artifacts
  };
}


/**
 * GET sections by id-array in params seperated by ,
 */
router.get("/list/:section_ids", function (req, res, next) {
  var section_ids = req.params.section_ids.split(",");
  var sectionsArray = [];

  // get sections from id_list
  sections
    .where(admin.firestore.FieldPath.documentId(), "in", section_ids)
    .get()
    .then((data) => {
      data.forEach((doc) => {
        var section = getSectionJson(doc);
        sectionsArray.push(section);
      });
      res.status(200).send(sectionsArray);
    })
    .catch((err) => {
      res.status(404).send("No sections found");
    });
});


/**
 * GET ALL sections
 */
router.get("/", function (req, res, next) {
  var sectionsArray = [];

  // get sections from DB
  sections
    .get()
    .then((data) => {
      data.forEach((doc) => {
        var section = getSectionJson(doc);
        sectionsArray.push(section);
      });
      res.status(200).send(sectionsArray);
    })
    .catch((err) => {
      res.status(404).send("No sections found");
    });
});


/**
 * GET sections by excavation_id
 */
router.get("/excavation_id/:excavation_id", async function (req, res, next) {
  //check if excavation_id exists
  try {
    var excavation = await getExcavationById(req.params.excavation_id);
  } catch (error) {
    res.status(404).send("Couldn't find excavation with id: " + req.params.excavation_id);
  }

  // check if there are sections in this excavation
  var sectionsArray = [];
  if (excavation.sections === undefined) {
    res.status(404).send("No sections for this excavation");
  } else {
    // get sections from DB
    sections
      .where(admin.firestore.FieldPath.documentId(), "in", excavation.sections)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          var section = getSectionJson(doc);
          sectionsArray.push(section);
        });
        res.status(200).send(sectionsArray);
      })
      .catch((err) => {
        res.status(404).send("No sections found");
      });
  }
});


/**
 * GET section by ID 
 */
router.get("/:section_id", function (req, res, next) {
  sections
    .doc(req.params.section_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        var section = getSectionJson(doc);
        res.status(200).send(section);
      } else {
        res.status(404).send("No such document: ");
      }
    })
    .catch((err) => {
      res.status(404).send("section not found: " + err);
    });
});


/**
 * POST new section 
 */
router.post("/:excavation_id", async function (req, res, next) {
  // check if excavation_id exists
  try {
    var excavation = await getExcavationById(req.params.excavation_id);
  } catch (error) {
    res.status(404).send("Couldn't find excavation with id: " + req.params.excavation_id);
  }

  // add new section to DB
  try {
    var section_id = await sections.add(req.body);
  } catch (error) {
    res.status(404).send("Couldn't add section");
  }

  // add new section_id to the excavation list of section ids
  var newExcavation = excavation;
  newExcavation.sections.push(section_id.id);

  // update excavation in DB
  try {
    var response = await updateExcavationById(req.params.excavation_id, newExcavation);
  } catch (error) {
    res.status(404).send("Couldn't update excavation");
  }

  res.status(200).send("Successfully added section");
});


/**
 * UPDATE section by ID
 */
router.put("/:section_id", function (req, res, next) {
  sections
    .doc(req.params.section_id)
    .update(req.body)
    .then((response) => {
      res.status(200).send("Updated section");
    })
    .catch((err) => {
      res.status(404).send("Couldn't update section: " + err);
    });
});


/* DELETE section by ID*/
router.delete("/:excavation_id/:section_id", async function (req, res, next) {
  //TODO: when deleting a section, also delete all subcollections

  // get excavation data
  var excavation = await getExcavationById(req.params.excavation_id);

  // remove the section_id from excavation data
  var newExcavation = excavation;
  var index = newExcavation.sections.indexOf(req.params.section_id);
  newExcavation.sections.splice(index, 1);

  // update excavation data with the removed section_id
  var response = await updateExcavationById(req.params.excavation_id, newExcavation);

  // delete section from DB
  sections
    .doc(req.params.section_id)
    .delete({ exists: true })
    .then((response) => {
      res.status(200).send("Deleted section: " + req.params.section_id);
    })
    .catch((err) => {
      res.status(404).send("Couldn't delete section: " + err);
    });
});


/**
 * Returns excavation data from DB by searching with the project ID
 * @param {String} excavation_id
 * @returns
 */
async function getExcavationById(excavation_id) {
  var excavation = await excavations.doc(excavation_id).get();

  return excavation.data();
}


/**
 * Returns excavation data from DB by searching with the excavation ID
 * @param {String} excavation_id
 * @returns
 */
async function updateExcavationById(excavation_id, newExcavation) {
  var response = await excavations.doc(excavation_id).update(newExcavation);

  return response;
}

module.exports = router;
