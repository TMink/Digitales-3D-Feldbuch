const express = require("express");
const router = express.Router();
const db = require("../fb");
const projects = db.collection("projects");
const excavations = db.collection("excavations");
var admin = require("firebase-admin");

/**
 * GET excavations by id-array in params seperated by ,
 */
router.get("/list/:excavation_ids", function (req, res, next) {
  var excavation_ids = req.params.excavation_ids.split(",");
  var excavationsArray = [];

  // get excavations from id_list
  excavations
    .where(admin.firestore.FieldPath.documentId(), "in", excavation_ids)
    .get()
    .then((data) => {
      data.forEach((doc) => {
        var excavation = getExcavationJson(doc);
        excavationsArray.push(excavation);
      });
      res.status(200).send(excavationsArray);
    })
    .catch((err) => {
      res.status(404).send("No excavations found");
    });
});

/**
 * GET ALL excavations
 */
router.get("/", function (req, res, next) {
  var excavationsArray = [];

  // get excavations from DB
  excavations
    .get()
    .then((data) => {
      data.forEach((doc) => {
        var excavation = getExcavationJson(doc);
        excavationsArray.push(excavation);
      });
      res.status(200).send(excavationsArray);
    })
    .catch((err) => {
      res.status(404).send("No excavations found");
    });
});

/**
 * GET excavations by project_id
 */
router.get("/project_id/:project_id", async function (req, res, next) {
  //check if project_id exists
  try {
    var project = await getProjectById(req.params.project_id);
  } catch (error) {
    res.status(404).send("Couldn't find project with id: " + req.params.project_id);
  }

  // check if there are excavations in this project
  var excavationsArray = [];
  if (project.excavations.length === 0) {
    res.status(404).send("No excavations in this project");
  }

  // get excavations from DB
  excavations
    .where(admin.firestore.FieldPath.documentId(), "in", project.excavations)
    .get()
    .then((data) => {
      data.forEach((doc) => {
        var excavation = getExcavationJson(doc);
        excavationsArray.push(excavation);
      });
      res.status(200).send(excavationsArray);
    })
    .catch((err) => {
      res.status(404).send("No excavations found");
    });
});

/**
 * GET excavation by ID
 */
router.get("/:excavation_id", function (req, res, next) {
  excavations
    .doc(req.params.excavation_id)
    .get()
    .then((doc) => {
      var excavation = getExcavationJson(doc);
      res.status(200).send(excavation);
    })
    .catch((err) => {
      res.status(404).send("Excavation not found: " + err);
    });
});

/**
 * POST new excavation
 */
router.post("/:project_id", async function (req, res, next) {
  // check if project_id exists
  try {
    var project = await getProjectById(req.params.project_id);
  } catch (error) {
    res.status(404).send("Couldn't find project with id: " + req.params.project_id);
  }

  // add new excavation to DB
  try {
    var excavation_id = await excavations.add(req.body);
  } catch (error) {
    res.status(404).send("Couldn't add excavation");
  }

  // add new excavation_id to the project list of excavation ids
  var newProject = project;
  newProject.excavations.push(excavation_id.id);

  // update project in DB
  try {
    var response = await updateProjectById(req.params.project_id, newProject);
  } catch (error) {
    res.status(404).send("Couldn't update project");
  }

  res.status(200).send("Successfully added excavation");
});

/**
 * UPDATE excavation by ID
 */
router.put("/:excavation_id", function (req, res, next) {
  excavations
    .doc(req.params.excavation_id)
    .update(req.body)
    .then((response) => {
      res.status(200).send("Updated excavation: " + req.params.excavation_id);
    })
    .catch((err) => {
      res.status(404).send("Couldn't update excavation: " + err);
    });
});

/**
 * DELETE excavation by ID
 */
router.delete("/:project_id/:excavation_id", async function (req, res, next) {
  //TODO: when deleting a excavation, also delete all subcollections

  // get project data
  var project = await getProjectById(req.params.project_id);

  // remove the excavation_id from project data
  var newProject = project;
  var index = newProject.excavations.indexOf(req.params.excavation_id);
  newProject.excavations.splice(index, 1);

  // update project data with the removed excavation_id
  var response = await updateProjectById(req.params.project_id, newProject);

  // delete excavation from db
  excavations
    .doc(req.params.excavation_id)
    .delete({ exists: true })
    .then((response) => {
      res.status(200).send("Deleted excavation: " + req.params.excavation_id);
    })
    .catch((err) => {
      res.status(404).send("Couldn't delete excavation: " + err);
    });
});

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
    id: doc.id,
    title: doc.data().title,
    description: doc.data().description,
    client: doc.data().client,
    focus: doc.data().focus,
    length: doc.data().length,
    location: doc.data().location,
    organization: doc.data().organization,
    dates: doc.data().dates,
  };
}

/**
 * Returns project data from DB by searching with the project ID
 * @param {String} project_id
 * @returns
 */
async function getProjectById(project_id) {
  var project = await projects.doc(project_id).get();

  return project.data();
}

/**
 * Returns project data from DB by searching with the project ID
 * @param {String} project_id
 * @returns
 */
async function updateProjectById(project_id, newProject) {
  var response = await projects.doc(project_id).update(newProject);

  return response;
}

module.exports = router;
