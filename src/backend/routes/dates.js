const express = require("express");
const router = express.Router();

const Excavation = require("../model/Excavation");
const Date = require("../model/Date");
const Artifact = require("../model/Artifact");


/**
 * Takes the retrieved data from DB and builds a JSON-object
 * with all fields for an date. Also creates empty fields,
 * when there is no data for them.
 *
 * @param {*} doc The raw date data from database
 * @returns date Json-Object with all required fields
 */
function getDateJson(doc) {
  return {
    title: doc.title,
    date: doc.date,
  };
}

/* GET dates by id-array in params separated by ,*/
router.get("/:date_ids", async function (req, res, next) {
  var date_ids = req.params.date_ids.split(",");

  try {
    var datesArray = await Date.find({ _id: date_ids }).exec();
  } catch (error) {
    res.status(404).send("No dates found");
  }

  res.status(200).send(datesArray);
});

/* POST new date for a parent*/
router.post("/:parent/:parent_id", async function (req, res, next) {
  var parentDB;
  var parent = req.params.parent;
  var newDate = getDateJson(req.body);

  if (parent == 'excavations') {
    parentDB = Excavation;
  } else if (parent == 'artifacts') {
    parentDB = Artifact;
  } else {
    res.status(500).send("Couldn't find the parent type")
  }

  // create new date in MongoDB
  try {
    var result = await Date.create(newDate);
  } catch (error) {
    res.status(500).send("Couldn't create Date: " + error.message);
  }

  // get currently used project by id
  try {
    var parent = await parentDB.findById(req.params.parent_id).exec();
  } catch (error) {
    res.status(404).send("No parent with ID: " + req.params.parent_id + " found");
  }

  // add newly created date id to this parent
  parent.dates.push(result.id);

  // update the edited parent object in MongoDB
  try {
    var parent = await parentDB.findByIdAndUpdate(req.params.parent_id, parent);
  } catch (error) {
    res.status(404).send("No parent with ID: " + req.params.parent_id + " found");
  }

  res.status(200).send(result.id);
});

/* UPDATE date by ID*/
router.put("/:date_id", function (req, res, next) {
  //TODO: editing of Dates --> is this even needed?
});

/* DELETE date by ID*/
router.delete("/:parent/:parent_id/:date_id", async function (req, res, next) {

  var parentDB;
  var parent = req.params.parent;

  if (parent == "excavations") {
    parentDB = Excavation;
  } else if (parent == "artifacts") {
    parentDB = Artifact;
  } else {
    res.status(500).send("Couldn't find the parent type");
  }

  // delete date from MongoDB by id
  try {
    const result = await Date.findByIdAndDelete(req.params.date_id);
  } catch (error) {
    res.status(500).send("Couldn't edit Parent: " + error.message);
  }

  // get parent from MongoDB by id
  try {
    var parent = await parentDB.findById(req.params.parent_id).exec();
  } catch (error) {
    res.status(404).send("No parent with ID: " + req.params.parent_id + " found");
  }

  // remove the deleted dates id from this parent
  const index = parent.dates.indexOf(req.params.date_id);

  if (index > -1) {
    parent.dates.splice(index, 1);
  } else {
    res.status(400).send("The deleted date is not part of the current parent");
  }

  // update the edited parent in MongoDB
  try {
    var parent = await parentDB.findByIdAndUpdate(req.params.parent_id, parent);
  } catch (error) {
    res.status(404).send("No parent with ID: " + req.params.parent_id + " found");
  }

  res.status(200).send("Successfully deleted date");
});

module.exports = router;
