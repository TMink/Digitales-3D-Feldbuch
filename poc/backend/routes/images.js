const express = require("express");
const router = express.Router();
const multer = require("multer");

const Position = require("../model/Position");
const Image = require("../model/Image");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
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
function getImageJson(doc, filename, mimetype) {
  return {
    _id: doc.id,
    imageNumber: doc.imageNumber,
    positionID: doc.positionID,
    title: doc.title,
    image: filename,
  };
}

/**
 * GET images by id-array in params seperated by ,
 */
router.get("/list/:image_ids", async function (req, res, next) {});

/* GET dates by id-array in params seperated by ,*/
router.get("/:image_id", async function (req, res, next) {
  try {
    var image = await Image.findById(req.params.image_id).exec();
  } catch (error) {
    res.status(404).send("No Image with ID: " + req.params.image_id + " found");
  }

  /* console.log('fileController.download: started')
  const path = req.body.path;
  const file = fs.createReadStream(path)
  const filename = (new Date()).toISOString();
  res.setHeader('Content-Disposition', 'attachment: filename="' + filename + '"')
  file.pipe(res) */

  console.log(image);
  res.status(200).send(image);
});

/* POST new image data */
router.post("/:position_id", upload.single("image"), async function (req, res, next) {
  var newImage = getImageJson(req.body, req.file.filename);

  console.log(newImage)
  try {
    const result = await Image.create(newImage);

    res.status(200).send("Saved Image: " + result);
  } catch (error) {
    res.status(500).send("Couldn't save Image: " + error.message);
  }
});

module.exports = router;
