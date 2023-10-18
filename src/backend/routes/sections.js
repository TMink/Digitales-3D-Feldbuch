const express = require("express");
const router = express.Router();

const Excavation = require("../model/Excavation");
const Section = require("../model/Section");



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
    title: doc.title,
    description: doc.description,
    startLevel: doc.startLevel,
    endLevel: doc.endLevel,
    contacts: doc.contacts,
    features: doc.features,
    artifacts: doc.artifacts,
    models: doc.models
  };
}


/**
 * GET sections by id-array in params separated by ,
 */
router.get("/list/:section_ids", async function (req, res, next) {
  var section_ids = req.params.section_ids.split(",");

  try {
    var sectionsArray = await Section.find({ _id: section_ids }).exec();
  } catch (error) {
    res.status(404).send("No sections found");
  }

  res.status(200).send(sectionsArray);
});


/**
 * GET ALL sections
 * @deprecated
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
  // get excavation by id from MongoDB
  try {
    var excavation = await Excavation.findById(req.params.excavation_id).exec();
  } catch (error) {
    res.status(404).send("No excavation with id: " + req.params.excavation_id);
  }

  //get all excavations by id from the excavation.sections array
  try {
    var sectionsArray = await Section.find({ _id: excavation.sections }).exec();
  } catch (error) {
    res.status(404).send("No sections found");
  }

  res.status(200).send(sectionsArray);
});


/**
 * GET section by ID 
 */
router.get("/:section_id", async function (req, res, next) {
  try {
    var section = await Section.findById(req.params.section_id).exec();
  } catch (error) {
    res.status(404).send("No section with ID: " + req.params.section_id + " found");
  }
  res.status(200).send(section);
});


/**
 * POST new section 
 */
router.post("/:excavation_id", async function (req, res, next) {

    var newSection = getSectionJson(req.body);
    // create new excavation in MongoDB
    try {
      var result = await Section.create(newSection);
    } catch (error) {
      res.status(500).send("Couldn't create Section: " + error.message);
    }

    // get currently used excavation by id
    try {
      var excavation = await Excavation.findById(req.params.excavation_id).exec();
    } catch (error) {
      res.status(404).send("No excavation with ID: " + req.params.excavation_id + " found");
    }

    // add newly created excavation id to this project
    excavation.sections.push(result.id);

    // update the edited project in MongoDB
    try {
      var excavation = await Excavation.findByIdAndUpdate(req.params.excavation_id, excavation);
    } catch (error) {
      res.status(404).send("No excavation with ID: " + req.params.excavation_id + " found");
    }

    res.status(200).send("Successfully added excavation");
});


/**
 * UPDATE section by ID
 */
router.put("/:section_id", async function (req, res, next) {
  var updatedSection = getSectionJson(req.body);

  try {
    const result = await Section.findByIdAndUpdate(req.params.section_id, updatedSection);

    res.status(200).send("Edited Section: " + result);
  } catch (error) {
    res.status(500).send("Couldn't edit Section: " + error.message);
  }

});


/* DELETE section by ID*/
router.delete("/:excavation_id/:section_id", async function (req, res, next) {
  // delete section from MongoDB by id
  try {
    const result = await Section.findByIdAndDelete(req.params.section_id);
  } catch (error) {
    res.status(500).send("Couldn't delete Section: " + error.message);
  }

  // get excavation from MongoDB by id
  try {
    var excavation = await Excavation.findById(req.params.excavation_id).exec();
  } catch (error) {
    res.status(404).send("No excavation with ID: " + req.params.excavation_id + " found");
  }

  // remove the deleted section id from this project
  const index = excavation.sections.indexOf(req.params.section_id);

  if (index > -1) {
    excavation.sections.splice(index, 1);
  } else {
    res.status(400).send("The deleted section is not part of the current excavation");
  }

  // update the edited excavation in MongoDB
  try {
    var excavation = await Excavation.findByIdAndUpdate(req.params.excavation_id, excavation);
  } catch (error) {
    res.status(404).send("No excavation with ID: " + req.params.excavation_id + " found");
  }

  res.status(200).send("Successfully deleted section");
});

module.exports = router;
