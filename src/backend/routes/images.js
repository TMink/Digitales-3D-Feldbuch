/*
 * Created Date: 10.05.2023 12:58:23
 * Author: Julian Hardtung
 * 
 * Last Modified: 02.04.2024 16:10:43
 * Modified By: Julian Hardtung
 * 
 * Description: Backend CRUD API routes for images
 */

const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const Image = require("../model/Image");

const FILE_PATH = "./public/uploads/";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
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
function getImageJson(doc, filename, mimetype) {
  const curTime = Date.now();

  return {
    _id: doc._id,
    imageNumber: doc.imageNumber,
    positionID: doc.positionID,
    title: doc.title,
    image: filename,
    lastChanged: curTime,
    lastSync: curTime,
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

    fs.readFile(FILE_PATH + image.image, (err, base64Img) => {
      if (err) {
        console.error(err);
        return res.status(500).send("error reading image file");
      }

      result.image = base64Img;
      res.status(200).send(result);
    });

  } catch (error) {
    res.status(404).send("No Image with ID: " + req.params.image_id + " found");
  }


  res.status(200).send(image);
});

/* POST new image data */
router.post("/:position_id", upload.single("image"), async function (req, res, next) {
  var newImage = getImageJson(req.body, req.file.filename);



  try {
    const result = await Image.create(newImage);

    fs.readFile(FILE_PATH + req.file.filename, (err, base64Img) => {
      if (err) {
        console.error(err);
        return res.status(500).send("error reading image file");
      }

      result.image = base64Img;
      res.status(200).send(result);
    });

  } catch (error) {
    res.status(500).send("Couldn't save Image: " + error.message);
  }
});

/**
 * DELETE existing model from MongoDB
 */
router.delete("/:image_id", async function (req, res, next) {
  try {
    // delete image from DB
    const result = await Image.findByIdAndDelete(req.params.image_id);
    // delete image
    fs.unlinkSync(FILE_PATH + result.image);

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send("Couldn't delete Image: " + error.message);
  }
});

module.exports = router;
