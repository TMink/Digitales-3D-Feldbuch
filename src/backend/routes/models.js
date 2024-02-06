/*
 * Created Date: 13.06.2023 13:54:24
 * Author: Julian Hardtung
 * 
 * Last Modified: 06.02.2024 16:25:59
 * Modified By: Julian Hardtung
 * 
 * Description: Backend CRUD API routes for models
 */

const express = require("express");
const router = express.Router();
const fs = require('fs');
const multer = require("multer");
const Model = require("../model/Model");

const FILE_PATH = "./public/uploads/";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, FILE_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + req.body._id);
  },
});

const upload = multer({ storage: storage });

/**
 * Takes the retrieved data from DB and builds a JSON-object
 * with all fields for an image. Also creates empty fields,
 * when there is no data for them.
 *
 * @param {JSON} doc The raw image data from database
 * @param {String} imageURL The image URL to gcs
 * @returns image Json-Object with all required fields
 */
function getModelJson(doc, modelFilename) {
  const curTime = Date.now();
  return {
    _id: doc._id,
    modelNumber: doc.modelNumber,
    placeID: doc.placeID,
    title: doc.title,
    model: modelFilename,
    lastChanged: curTime,
    lastSync: curTime,
  };
}

/**
 * GET images by id-array in params separated by ,
 */
router.get("/list/:model_ids", async function (req, res, next) {});

/* GET dates by id-array in params separated by ,*/
router.get("/:model_id", async function (req, res, next) {
  try {
    var model = await Model.findById(req.params.model_id).exec();
  } catch (error) {
    res.status(404).send("No Model with ID: " + req.params.model_id + " found");
  }


  res.status(200).send(image);
});

/* POST new model data */
router.post("/:model_id", upload.single("model"), async function (req, res, next) {
  var newModel = getModelJson(req.body, req.file.filename);

  try {
    const result = await Model.create(newModel);

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send("Couldn't save Model: " + error.message);
  }
});

/**
 * DELETE existing model from MongoDB
 */
router.delete("/:model_id", async function (req, res, next) {
  try {
    // delete model from DB
    const result = await Model.findByIdAndDelete(req.params.model_id);
    // delete model file
    fs.unlinkSync(FILE_PATH + result.model);

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send("Couldn't delete Model: " + error.message);
  }
});

module.exports = router;
