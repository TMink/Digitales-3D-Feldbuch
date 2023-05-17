const express = require("express");
const router = express.Router();

const Section = require("../model/Section");
const Artifact = require("../model/Artifact");

/**
 * Takes the retrieved data from DB and builds a JSON-object
 * with all fields for an artifact. Also creates empty fields,
 * when there is no data for them.
 *
 * @param {*} doc The raw artifact data from database
 * @returns artifact Json-Object with all required fields
 */
function getArtifactJson(doc) {
  return {
    number: doc.number,
    description: doc.description,
    inscriptions: doc.inscriptions,
    state: doc.state,
    literature: doc.literature,
    producer: doc.producer,
    material: doc.material,
    type: doc.type,
    images: doc.images,
    colors: doc.colors,
    datings: doc.datings,
    utmPoints: doc.utmPoints,
    measurements: doc.measurements,
    dates: doc.dates,
    features: doc.features
  };
}


/**
 * GET artifacts by id-array in params seperated by ,
 */
router.get("/list/:artifact_ids", async function (req, res, next) {

  var artifact_ids = req.params.artifact_ids.split(",");

  try {
    var artifactsArray = await Artifact.find({ _id: artifact_ids }).exec();
  } catch (error) {
    res.status(404).send("No artifacts found");
  }

  res.status(200).send(artifactsArray);
});


/**
 * GET artifacts by section_id
 */
router.get("/section_id/:section_id", async function (req, res, next) {
  // get section by id from MongoDB
  try {
    var section = await Section.findById(req.params.section_id).exec();
  } catch (error) {
    res.status(404).send("No section with id: " + req.params.section_id);
  }

  //get all artifacts by id from the section.artifacts array
  try {
    var artifactsArray = await Artifact.find({ _id: section.artifacts }).exec();
  } catch (error) {
    res.status(404).send("No artifacts found");
  }

  res.status(200).send(artifactsArray);
});


/**
 * GET artifact by ID
 */
router.get("/:artifact_id", async function (req, res, next) {

  try {
    var artifact = await Artifact.findById(req.params.artifact_id).exec();
  } catch (error) {
    res.status(404).send("No artifact with ID: " + req.params.artifact_id + " found");
  }
  res.status(200).send(artifact);
});


/**
 * POST new artifact
 */
router.post("/:section_id", async function (req, res, next) {
  //create artifact JSON object for updating the artifactDB

  var newArtifact = getArtifactJson(req.body);

  // create new artifact in MongoDB
  try {
    var result = await Artifact.create(newArtifact);
  } catch (error) {
    res.status(500).send("Couldn't create Artifact: " + error.message);
  }

  // get currently used section by id
  try {
    var section = await Section.findById(req.params.section_id).exec();
  } catch (error) {
    res.status(404).send("No section with ID: " + req.params.section_id + " found");
  }

  // add newly created artifact id to this section
  section.artifacts.push(result.id);

  // update the edited section in MongoDB
  try {
    var section = await Section.findByIdAndUpdate(req.params.section_id, section);
  } catch (error) {
    res.status(404).send("No section with ID: " + req.params.section_id + " found");
  }

  res.status(200).send("Successfully added the artifact");
});

/**
 * PUT existing artifact in MongoDB by ID
 */
router.put("/:artifact_id", async function (req, res, next) {

  var updatedArtifact = getArtifactJson(req.body);

  try {
    const result = await Artifact.findByIdAndUpdate(req.params.artifact_id, updatedArtifact);

    res.status(200).send("Edited Artifact: " + result);
  } catch (error) {
    res.status(500).send("Couldn't edit Artifact: " + error.message);
  }
});


/**
 * DELETE artifact by ID
 */
router.delete("/:section_id/:artifact_id", async function (req, res, next) {
  // delete artifact from MongoDB by id
  try {
    const result = await Artifact.findByIdAndDelete(req.params.artifact_id);
  } catch (error) {
    res.status(500).send("Couldn't edit Section: " + error.message);
  }

  // get section from MongoDB by id
  try {
    var section = await Section.findById(req.params.section_id).exec();
  } catch (error) {
    res.status(404).send("No section with ID: " + req.params.section_id + " found");
  }

  // remove the deleted artifact id from this section
  const index = section.artifacts.indexOf(req.params.artifact_id);

  if (index > -1) {
    section.artifacts.splice(index, 1);
  } else {
    res.status(400).send("The deleted artifact is not part of the current section");
  }

  // update the edited section in MongoDB
  try {
    var section = await Section.findByIdAndUpdate(req.params.section_id, section);
  } catch (error) {
    res.status(404).send("No section with ID: " + req.params.section_id + " found");
  }

  res.status(200).send("Successfully deleted artifact");
});

module.exports = router;
