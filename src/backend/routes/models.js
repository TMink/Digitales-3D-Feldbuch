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
    cb(null, file.fieldname + "-" + req.body.id);
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
  return {
    _id: doc.id,
    modelNumber: doc.modelNumber,
    placeID: doc.placeID,
    title: doc.title,
    model: modelFilename,
  };
}

/**
 * GET images by id-array in params separated by ,
 */
router.get("/list/:image_ids", async function (req, res, next) {});

/* GET dates by id-array in params separated by ,*/
router.get("/:image_id", async function (req, res, next) {
  try {
    var image = await Image.findById(req.params.image_id).exec();
  } catch (error) {
    res.status(404).send("No Image with ID: " + req.params.image_id + " found");
  }


  res.status(200).send(image);
});

/* POST new model data */
router.post("/:model_id", upload.single("model"), async function (req, res, next) {
  var newModel = getModelJson(req.body, req.file.filename);

  try {
    const result = await Model.create(newModel);

    res.status(200).send("Saved Model: " + result);
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

    res.status(200).send("Deleted Model: " + result);
  } catch (error) {
    res.status(500).send("Couldn't delete Model: " + error.message);
  }
});

module.exports = router;
