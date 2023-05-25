const express = require("express");
const router = express.Router();

const Artifact = require("../model/Artifact");
const UTMPoint = require("../model/UTMPoint");

/**
 * Takes the retrieved data from DB and builds a JSON-object
 * with all fields for a utmPoint. Also creates empty fields,
 * when there is no data for them.
 *
 * @param {*} doc The raw excavation data from database
 * @returns utmPoint Json-Object with all required fields
 */
function getUTMPointJson(doc) {
  return {
    id: doc.id,
    title: doc.title,
    description: doc.description,
    eastvalue: doc.eastvalue,
    northvalue: doc.northvalue,
    heightvalue: doc.heightvalue,
  };
}

/* GET utmPoints by id-array in params seperated by ,*/
router.get("/:utmPoint_ids", async function (req, res, next) {
  var utmPoint_ids = req.params.utmPoint_ids.split(",");

  try {
    var utmPointsArray = await UTMPoint.find({ _id: utmPoint_ids }).exec();
  } catch (error) {
    res.status(404).send("No utmPoints found");
  }

  res.status(200).send(utmPointsArray);
});


/* GET utmPoints by ID */
router.get("/:utmPoint_id", async function (req, res, next) {
  try {
    var utmPoint = await UTMPoint.findById(req.params.utmPoint_id).exec();
  } catch (error) {
    res.status(404).send("No UTMPoint with ID: " + req.params.utmPoint_id + " found");
  }
  res.status(200).send(utmPoint);
});


/* POST new utmPoint */
router.post("/:artifact_id", async function (req, res, next) {
  var newUTMPoint = getUTMPointJson(req.body);
  // create new utmPoint in MongoDB
  try {
    var result = await UTMPoint.create(newUTMPoint);
  } catch (error) {
    res.status(500).send("Couldn't create Artifact: " + error.message);
  }

  // get currently used artifact by id
  try {
    var artifact = await Artifact.findById(req.params.artifact_id).exec();
  } catch (error) {
    res.status(404).send("No artifact with ID: " + req.params.artifact_id + " found");
  }

  // add newly created utmPoint id to this artifact
  artifact.utmPoints.push(result.id);

  // update the edited artifact in MongoDB
  try {
    var artifact = await Artifact.findByIdAndUpdate(req.params.artifact_id, artifact);
  } catch (error) {
    res.status(404).send("No artifact with ID: " + req.params.artifact_id + " found");
  }

  res.status(200).send("Successfully added utmPoint");
});

/* UPDATE utmPoint by ID*/
router.put("/:utmPoint_id", async function (req, res, next) {
  var updatedUTMPoint = getUTMPointJson(req.body);

  try {
    const result = await UTMPoint.findByIdAndUpdate(req.params.utmPoint_id, updatedUTMPoint);

    res.status(200).send("Edited UTMPoint: " + result);
  } catch (error) {
    res.status(500).send("Couldn't edit UTMPoint: " + error.message);
  }
});

/* DELETE utmPoint by ID*/
router.delete("/:artifact_id/:utmPoint_id", async function (req, res, next) {
  // delete utmPoint from MongoDB by id
  try {
    const result = await UTMPoint.findByIdAndDelete(req.params.utmPoint_id);
  } catch (error) {
    res.status(500).send("Couldn't delete UTMPoint: " + error.message);
  }

  // get artifact from MongoDB by id
  try {
    var artifact = await Artifact.findById(req.params.artifact_id).exec();
  } catch (error) {
    res.status(404).send("No artifact with ID: " + req.params.artifact_id + " found");
  }

  // remove the deleted utmPoint id from this artifact
  const index = artifact.utmPoints.indexOf(req.params.utmPoint_id);

  if (index > -1) {
    artifact.utmPoints.splice(index, 1);
  } else {
    res.status(400).send("The deleted utmPoint is not part of the current artifact");
  }

  // update the edited artifact in MongoDB
  try {
    var artifact = await Artifact.findByIdAndUpdate(req.params.artifact_id, artifact);
  } catch (error) {
    res.status(404).send("No artifact with ID: " + req.params.artifact_id + " found");
  }

  res.status(200).send("Successfully deleted utmPoint");
});

module.exports = router;
