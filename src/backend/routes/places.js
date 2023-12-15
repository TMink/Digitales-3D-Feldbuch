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

/**
 * Takes the retrieved data from DB and builds a JSON-object
 * with all fields for a place. Also creates empty fields,
 * when there is no data for them.
 *
 * @param {*} doc The raw place data from database
 * @returns place Json-Object with all required fields
 */
function getPlaceJson(doc) {
  return {
    _id: doc._id,
    placeNumber: doc.placeNumber,
    date: doc.date,
    address: doc.adress,
    models: doc.models,
    positions: doc.positions
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

    res.status(200).send("Created Place: " + result);
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

    res.status(200).send("Edited Place: " + result);
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

    res.status(200).send("Edited Place: " + result);
  } catch (error) {
    res.status(500).send("Couldn't edit Place: " + error.message);
  }
});

module.exports = router;
