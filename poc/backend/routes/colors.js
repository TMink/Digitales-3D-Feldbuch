const express = require("express");
const router = express.Router();

const Artifact = require("../model/Artifact");
const Color = require("../model/Color");

/**
 * Takes the retrieved data from DB and builds a JSON-object
 * with all fields for a color. Also creates empty fields,
 * when there is no data for them.
 *
 * @param {*} doc The raw excavation data from database
 * @returns color Json-Object with all required fields
 */
function getColorJson(doc) {
  return {
    id: doc.id,
    title: doc.title,
    hexa: doc.hexa,
    red: doc.red,
    green: doc.green,
    blue: doc.blue,
    alpha: doc.alpha,
  };
}


/* GET colors by id-array in params seperated by ,*/
router.get("/:color_ids", async function (req, res, next) {
  var color_ids = req.params.color_ids.split(",");

  try {
    var colorsArray = await Color.find({ _id: color_ids }).exec();
  } catch (error) {
    res.status(404).send("No colors found");
  }

  res.status(200).send(colorsArray);
});


/* GET colors by ID */
router.get("/:color_id", async function (req, res, next) {
  try {
    var color = await Color.findById(req.params.color_id).exec();
  } catch (error) {
    res.status(404).send("No Color with ID: " + req.params.color_id + " found");
  }
  res.status(200).send(color);
});

/* POST new color */
router.post("/:artifact_id", async function (req, res, next) {
  var newColor = getColorJson(req.body);
  // create new color in MongoDB
  try {
    var result = await Color.create(newColor);
  } catch (error) {
    res.status(500).send("Couldn't create Artifact: " + error.message);
  }

  // get currently used artifact by id
  try {
    var artifact = await Artifact.findById(req.params.artifact_id).exec();
  } catch (error) {
    res.status(404).send("No artifact with ID: " + req.params.artifact_id + " found");
  }

  // add newly created color id to this artifact
  artifact.colors.push(result.id);

  // update the edited artifact in MongoDB
  try {
    var artifact = await Artifact.findByIdAndUpdate(req.params.artifact_id, artifact);
  } catch (error) {
    res.status(404).send("No artifact with ID: " + req.params.artifact_id + " found");
  }

  res.status(200).send("Successfully added color");
});

/* UPDATE color by ID*/
router.put("/:color_id", async function (req, res, next) {
  var updatedColor = getColorJson(req.body);

  try {
    const result = await Color.findByIdAndUpdate(req.params.color_id, updatedColor);

    res.status(200).send("Edited Color: " + result);
  } catch (error) {
    res.status(500).send("Couldn't edit Color: " + error.message);
  }});


/* DELETE color by ID*/
router.delete("/:artifact_id/:color_id", async function (req, res, next) {
  // delete color from MongoDB by id
  try {
    const result = await Color.findByIdAndDelete(req.params.color_id);
  } catch (error) {
    res.status(500).send("Couldn't delete Color: " + error.message);
  }

  // get artifact from MongoDB by id
  try {
    var artifact = await Artifact.findById(req.params.artifact_id).exec();
  } catch (error) {
    res.status(404).send("No artifact with ID: " + req.params.artifact_id + " found");
  }

  // remove the deleted color id from this artifact
  const index = artifact.colors.indexOf(req.params.color_id);

  if (index > -1) {
    artifact.colors.splice(index, 1);
  } else {
    res.status(400).send("The deleted color is not part of the current artifact");
  }

  // update the edited artifact in MongoDB
  try {
    var artifact = await Artifact.findByIdAndUpdate(req.params.artifact_id, artifact);
  } catch (error) {
    res.status(404).send("No artifact with ID: " + req.params.artifact_id + " found");
  }

  res.status(200).send("Successfully deleted color");
});

module.exports = router;
