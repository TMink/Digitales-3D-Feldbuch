const express = require("express");
const router = express.Router();
const Activity = require("../model/Activity");

/**
 * Takes the retrieved data from DB and builds a JSON-object
 * with all fields for a activity. Also creates empty fields,
 * when there is no data for them.
 *
 * @param {*} doc The raw activity data from database
 * @returns activity Json-Object with all required fields
 */
function getActivityJson(doc) {
  return {
    _id: doc.id,
    activityNumber: doc.activityNumber,
    branchOffice: doc.branchOffice,
    year: doc.year,
    places: doc.places,
  };
}

/**
 * GET all activities from MongoDB
 */
router.get("/", async function (req, res, next) {
  try {
    var activitiesArray = await Activity.find({}).exec();
  } catch (error) {
    res.status(404).send("No activities found");
  }

  res.status(200).send(activitiesArray);
});

/**
 * GET one activity from MongoDB by activity_id
 */
router.get("/:activity_id", async function (req, res, next) {
  try {
    var activity = await Activity.findById(req.params.activity_id).exec();
  } catch (error) {
    res.status(404).send("No activity with ID: " + req.params.activity_id + " found");
  }
  res.status(200).send(activity);
});

/**
 * POST new activity to MongoDB
 */
router.post("/:activity_id", async function (req, res, next) {
  var newActivity = getActivityJson(req.body);
  try {
    const result = await Activity.create(newActivity);

    res.status(200).send("Created Activity: " + result);
  } catch (error) {
    res.status(500).send("Couldn't create Activity: " + error.message);
  }
});

/**
 * PUT existing activity in MongoDB by id
 */
router.put("/:activity_id", async function (req, res, next) {
  var updatedActivity = getActivityJson(req.body);

  try {
    const result = await Activity.findByIdAndUpdate(req.params.activity_id, updatedActivity);

    res.status(200).send("Edited Activity: " + result);
  } catch (error) {
    res.status(500).send("Couldn't edit Activity: " + error.message);
  }
});

/**
 * DELETE existing activity from MongoDB
 */
router.delete("/:activity_id", async function (req, res, next) {
  try {
    const result = await Activity.findByIdAndDelete(req.params.activity_id);

    res.status(200).send("Edited Activity: " + result);
  } catch (error) {
    res.status(500).send("Couldn't edit Activity: " + error.message);
  }
});

module.exports = router;
