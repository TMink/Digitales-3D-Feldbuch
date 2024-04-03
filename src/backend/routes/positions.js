/*
 * Created Date: 12.06.2023 11:17:28
 * Author: Julian Hardtung
 * 
 * Last Modified: 03.04.2024 12:56:06
 * Modified By: Julian Hardtung
 * 
 * Description: Backend CRUD API routes for positions
 */

const express = require("express");
const router = express.Router();
const Position = require("../model/Position");
const Place = require("../model/Place");

/**
 * Takes the retrieved data from DB and builds a JSON-object
 * with all fields for a position. Also creates empty fields,
 * when there is no data for them.
 *
 * @param {*} doc The raw position data from database
 * @returns position Json-Object with all required fields
 */
function getPositionJson(doc) {
  const curTime = Date.now();
  return {
    _id: doc._id,
    placeID: doc.placeID,
    positionNumber: doc.positionNumber,
    subNumber: doc.subNumber,
    right: doc.right,
    up: doc.up,
    height: doc.height,
    count: doc.count,
    weight: doc.weight,
    material: doc.material,
    title: doc.title,
    description: doc.description,
    dating: doc.dating,
    editor: doc.editor,
    date: doc.date,
    hasSubNumber: doc.hasSubNumber,
    isSeparate: doc.isSeparate,
    modulePreset: doc.modulePreset,

    images: doc.images,
    models: doc.models,
    places: doc.places,

    lastChanged: curTime,
    lastSync: curTime,
  };
}

/**
 * GET all positions from MongoDB
 */
router.get("/", async function (req, res, next) {
  try {
    var positionsArray = await Position.find({}).exec();
  } catch (error) {
    res.status(404).send("No positions found");
  }

  res.status(200).send(positionsArray);
});

/**
 * GET all positions of a place from MongoDB
 */
router.get("/place/:place_id", async function (req, res, next) {
  try {
    var place = await Place.findById(req.params.place_id);
  } catch (error) {
    return res.status(404).send("No place found: " + error);
  }

  try {
    var positionsArray = await Position.find({
      '_id': { $in: place.positions}
    });
    return res.status(200).send(positionsArray);
  } catch (error) {
    return res.status(404).send("No positions found");
  }  
}); 

/**
 * GET one position from MongoDB by position_id
 */
router.get("/:position_id", async function (req, res, next) {
  try {
    var position = await Position.findById(req.params.position_id).exec();
  } catch (error) {
    res.status(404).send("No position with ID: " + req.params.position_id + " found");
  }
  res.status(200).send(position);
});

/**
 * POST new position to MongoDB
 */
router.post("/:position_id", async function (req, res, next) {
  var newPosition = getPositionJson(req.body);

  try {
    const result = await Position.create(newPosition);

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send("Couldn't create Position: " + error.message);
  }
});

/**
 * PUT existing position in MongoDB by id
 */
router.put("/:position_id", async function (req, res, next) {
  var updatedPosition = getPositionJson(req.body);

  try {
    const result = await Position.findByIdAndUpdate(req.params.position_id, updatedPosition);

    res.status(200).send(updatedPosition);
  } catch (error) {
    res.status(500).send("Couldn't edit Position: " + error.message);
  }
});

/**
 * DELETE existing position from MongoDB
 */
router.delete("/:position_id", async function (req, res, next) {
  try {
    const result = await Position.findByIdAndDelete(req.params.position_id);

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send("Couldn't edit Position: " + error.message);
  }
});

module.exports = router;
