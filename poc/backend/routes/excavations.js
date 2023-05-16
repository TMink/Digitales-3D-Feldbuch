const express = require("express");
const router = express.Router();

const Project = require("../model/Project");
const Excavation = require("../model/Excavation");

/**
 * Takes the retrieved data from DB and builds a JSON-object
 * with all fields for an excavation. Also creates empty fields,
 * when there is no data for them.
 *
 * @param {*} doc The raw excavation data from database
 * @returns excavation Json-Object with all required fields
 */
function getExcavationJson(doc) {
  return {
    title: doc.title,
    description: doc.description,
    client: doc.client,
    focus: doc.focus,
    length: doc.length,
    location: doc.location,
    organization: doc.organization,
    dates: doc.dates,
    sections: doc.sections,
    contacts: doc.contacts,
  };
}


/**
 * GET ALL excavations
 * @deprecated
 */
router.get("/", async function (req, res, next) {
  try {
    var excavationsArray = await Excavation.find({}).exec();
  } catch (error) {
    res.status(404).send("No excavations found");
  }
  res.status(200).send(excavationsArray);
});


/**
 * GET excavations by id-array in params seperated by ,
 */
router.get("/list/:excavation_ids", async function (req, res, next) {
  var excavation_ids = req.params.excavation_ids.split(",");

  try {
    var excavationsArray = await Excavation.find({ _id: excavation_ids }).exec();
  } catch (error) {
    res.status(404).send("No excavations found");
  }

  res.status(200).send(excavationsArray);
});


/**
 * GET excavations by project_id
 */
router.get("/project_id/:project_id", async function (req, res, next) {
  // get project by id from MongoDB
  try {
    var project = await Project.findById(req.params.project_id).exec();
  } catch (error) {
    res.status(404).send("No project with id: " + req.params.project_id);
  }

  //get all excavations by id from the project.excavations array
  try {
    var excavationsArray = await Excavation.find({ _id: project.excavations }).exec();
  } catch (error) {
    res.status(404).send("No excavations found");
  }

  res.status(200).send(excavationsArray);
});


/**
 * GET excavation by ID
 */
router.get("/:excavation_id", async function (req, res, next) {
  try {
    var excavation = await Excavation.findById(req.params.excavation_id).exec();
  } catch (error) {
    res.status(404).send("No Excavation with ID: " + req.params.excavation_id + " found");
  }
  res.status(200).send(excavation);
});


/**
 * POST new excavation
 */
router.post("/:project_id", async function (req, res, next) {
  var newExcavation = getExcavationJson(req.body);
  // create new excavation in MongoDB
  try {
    var result = await Excavation.create(newExcavation);
  } catch (error) {
    res.status(500).send("Couldn't create Project: " + error.message);
  }

  // get currently used project by id
  try {
    var project = await Project.findById(req.params.project_id).exec();
  } catch (error) {
    res.status(404).send("No project with ID: " + req.params.project_id + " found");
  }

  // add newly created excavation id to this project
  project.excavations.push(result.id);

  // update the edited project in MongoDB
  try {
    var project = await Project.findByIdAndUpdate(req.params.project_id, project);
  } catch (error) {
    res.status(404).send("No project with ID: " + req.params.project_id + " found");
  }

  res.status(200).send("Successfully added excavation");
});


/**
 * PUT existing excavation in MongoDB by id
 */
router.put("/:excavation_id", async function (req, res, next) {
  var updatedExcavation = getExcavationJson(req.body);

  try {
    const result = await Excavation.findByIdAndUpdate(req.params.excavation_id, updatedExcavation);

    res.status(200).send("Edited Excavation: " + result);
  } catch (error) {
    res.status(500).send("Couldn't edit Excavation: " + error.message);
  }
});


/**
 * DELETE excavation by ID
 */
router.delete("/:project_id/:excavation_id", async function (req, res, next) {
  // delete excavation from MongoDB by id
  try {
    const result = await Excavation.findByIdAndDelete(req.params.excavation_id);
  } catch (error) {
    res.status(500).send("Couldn't edit Project: " + error.message);
  }

  // get project from MongoDB by id
  try {
    var project = await Project.findById(req.params.project_id).exec();
  } catch (error) {
    res.status(404).send("No project with ID: " + req.params.project_id + " found");
  }

  // remove the deleted excavation id from this project
  const index = project.excavations.indexOf(req.params.excavation_id);

  if (index > -1) {
    project.excavations.splice(index, 1);
  } else {
    res.status(400).send("The deleted excavation is not part of the current project");
  }

  // update the edited project in MongoDB
  try {
    var project = await Project.findByIdAndUpdate(req.params.project_id, project);
  } catch (error) {
    res.status(404).send("No project with ID: " + req.params.project_id + " found");
  }

  res.status(200).send("Successfully deleted excavation");
});

module.exports = router;
