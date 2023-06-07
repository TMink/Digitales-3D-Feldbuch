const express = require("express");
const router = express.Router();
const Project = require('../model/Project');

/**
 * Takes the retrieved data from DB and builds a JSON-object
 * with all fields for a project. Also creates empty fields,
 * when there is no data for them.
 *
 * @param {*} doc The raw project data from database
 * @returns project Json-Object with all required fields
 */
function getProjectJson(doc) {
  return {
    title: doc.title,
    description: doc.description,
    excavations: doc.excavations,
    contacts: doc.contacts,
  };
}


/**
 * GET all projects from MongoDB
 */
router.get("/", async function (req, res, next) {

  try {
    var projectsArray = await Project.find({}).exec();
  } catch (error) {
    res.status(404).send("No projects found");
  }
  
  res.status(200).send(projectsArray);
});

/**
 * GET one project from MongoDB by project_id
 */
router.get("/:project_id", async function (req, res, next) {

  try {
    var project = await Project.findById(req.params.project_id).exec();
  } catch (error) {
    res.status(404).send("No project with ID: "+ req.params.project_id + " found");
  }
  res.status(200).send(project);
});

/**
 * POST new project to MongoDB
 */
router.post("/", async function (req, res, next) {
  var newProject = getProjectJson(req.body);
  try {
    const result = await Project.create(newProject);
    
    res.status(200).send("Created Project: " + result);
  } catch (error) {
    res.status(500).send("Couldn't create Project: " + error.message);
  }
});

/**
 * PUT existing project in MongoDB by id
 */
router.put("/:project_id", async function (req, res, next) {
  var updatedProject = getProjectJson(req.body);

  try {
    const result = await Project.findByIdAndUpdate(req.params.project_id, updatedProject);

    res.status(200).send("Edited Project: " + result);
  } catch (error) {
    res.status(500).send("Couldn't edit Project: " + error.message);
  }
});

/**
 * DELETE existing project from MongoDB
 */
router.delete("/:project_id", async function (req, res, next) {

  try {
    const result = await Project.findByIdAndDelete(req.params.project_id);

    res.status(200).send("Edited Project: " + result);
  } catch (error) {
    res.status(500).send("Couldn't edit Project: " + error.message);
  }
});

module.exports = router;
