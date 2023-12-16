/*
 * Created Date: 09.06.2023 12:43:13
 * Author: Julian Hardtung
 * 
 * Last Modified: 16.12.2023 12:59:10
 * Modified By: Julian Hardtung
 * 
 * Description: Backend CRUD API routes for activities
 */

const express = require("express");
const router = express.Router();
const Activity = require("../model/Activity");
const User = require("../model/User");

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
    _id: doc._id,
    activityNumber: doc.activityNumber,
    branchOffice: doc.branchOffice,
    year: doc.year,
    number: doc.number,
    places: doc.places,
    lastChanged: doc.lastChanged,
    lastSync: doc.lastSync,
    editor: doc.editor,
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
 * GET all activities of a user from MongoDB
 */
router.get("/user/:user_id", async function (req, res, next) {
  try {
    var user = await User.findById(req.params.user_id);
  } catch (error) {
    return res.status(404).send("No user found: " + error);
  }

  try {
    var activitiesArray = await Activity.find({
      '_id': { $in: user.activities}
    });
    return res.status(200).send(activitiesArray);
  } catch (error) {
    return res.status(404).send("No activities found");
  }  
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

  var curTime = Date.now()
  newActivity.lastSync = curTime;
  newActivity.lastChanged = curTime;
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

    if (result == null) {
      return res.status(404).send("No activity found to update")
    }
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
