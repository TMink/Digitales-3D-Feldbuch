/**
 * @ Author: Julian Hardtung
 * @ Create Time: 11.06.2023 18:13:25
 * @ Modified by: Julian Hardtung
 * @ Modified time: 05.12.2023 11:08:06
 * 
 * Backend CRUD API routes for places
 */

const express = require("express");
const router = express.Router();
const Place = require("../model/Place");
const Activity = require("../model/Activity");

/**
 * Takes the retrieved data from DB and builds a JSON-object
 * with all fields for a place. Also creates empty fields,
 * when there is no data for them.
 *
 * @param {*} doc The raw place data from database
 * @returns place Json-Object with all required fields
 */
function getPlaceJson(doc) {
  const curTime = Date.now();
  return {
    _id: doc._id,
    activityID: doc.activityID,
    placeNumber: doc.placeNumber,
    title: doc.title,
    dating: doc.dating,
    noFinding: doc.noFinding,
    restFinding: doc.restFinding,
    right: doc.right,
    rightTo: doc.rightTo,
    up: doc.up,
    upTo: doc.upTo,
    depthBot: doc.depthBot,
    depthTop: doc.depthTop,
    plane: doc.plane,
    profile: doc.profile,
    visibility: doc.visibility,
    drawing: doc.drawing,
    description: doc.description,
    editor: doc.editor,
    date: doc.date,
    technical: doc.technical,

    positions: doc.positions,
    images: doc.images,
    models: doc.models,
    lines: doc.lines,
    modulePreset: doc.modulePreset,

    lastChanged: curTime,
    lastSync: curTime,
  };
}

/**
 * GET all places from MongoDB
 */
router.get("/", async function (req, res, next) {
  try {
    var placesArray = await Place.find({}).exec();
  } catch (error) {
    res.status(404).send("No places found");
  }

  res.status(200).send(placesArray);
});

/**
 * GET all places of an activity from MongoDB
 */
router.get("/activity/:activity_id", async function (req, res, next) {
  try {
    var activity = await Activity.findById(req.params.activity_id);
  } catch (error) {
    return res.status(404).send("No activity found: " + error);
  }

  try {
    var placesArray = await Place.find({
      '_id': { $in: activity.places}
    });
    return res.status(200).send(placesArray);
  } catch (error) {
    return res.status(404).send("No places found");
  }  
}); 

/**
 * GET one place from MongoDB by place_id
 */
router.get("/:place_id", async function (req, res, next) {
  try {
    var place = await Place.findById(req.params.place_id).exec();
  } catch (error) {
    res.status(404).send("No place with ID: " + req.params.place_id + " found");
  }
  res.status(200).send(place);
});

/**
 * POST new place to MongoDB
 */
router.post("/:place_id", async function (req, res, next) {
  var newPlace = getPlaceJson(req.body);
  try {
    const result = await Place.create(newPlace);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send("Couldn't create Place: " + error.message);
  }
});

/**
 * PUT existing place in MongoDB by id
 */
router.put("/:place_id", async function (req, res, next) {
  var updatedPlace = getPlaceJson(req.body);

  try {
    const result = await Place.findByIdAndUpdate(req.params.place_id, updatedPlace);

    res.status(200).send(updatedPlace);
  } catch (error) {
    res.status(500).send("Couldn't edit Place: " + error.message);
  }
});

/**
 * DELETE existing place from MongoDB
 */
router.delete("/:place_id", async function (req, res, next) {
  try {
    const result = await Place.findByIdAndDelete(req.params.place_id);

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send("Couldn't edit Place: " + error.message);
  }
});

module.exports = router;
