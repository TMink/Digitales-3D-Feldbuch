const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });
const db = require("../fb");
const images = db.collection("images");
var admin = require("firebase-admin");

const { Storage, ref } = require("@google-cloud/storage");
const storage = new Storage({ keyFilename: "./serviceAccountKey.json" });
// The ID of your GCS bucket
const bucketName = "feldbuch-images";
const imageBucket = storage.bucket("feldbuch-images");


//Generates a signed URL which is accessable for one hour
async function generateSignedUrl(fileName) {
  // These options will allow temporary read access to the file
  const options = {
    version: "v2",
    action: "read",
    expires: Date.now() + 1000 * 60 * 60, // one hour
  };

  // Get a v2 signed URL for the file
  const [url] = await storage.bucket(bucketName).file(fileName).getSignedUrl(options);

  //console.log(`The signed url for ${fileName} is ${url}`);
  return url;
}


/**
 * Takes the retrieved data from DB and builds a JSON-object
 * with all fields for an image. Also creates empty fields,
 * when there is no data for them.
 *
 * @param {JSON} doc The raw image data from database
 * @param {String} imageURL The image URL to gcs
 * @returns image Json-Object with all required fields
 */
function getImageJson(doc, imageURL) {
  return {
    id: doc.id,
    title: doc.data().title,
    description: doc.data().description,
    image: imageURL
  };
}


/**
 * GET images by id-array in params seperated by ,
 */
router.get("/list/:image_ids", async function (req, res, next) {
  var image_ids = req.params.image_ids.split(",");

  //get models from db
  try {
    var imagesArray = await images
      .where(admin.firestore.FieldPath.documentId(), "in", image_ids)
      .get();
  } catch (error) {
    res.status(500).send("Error retrieving images from database");
  }


  // generate signed URLs for every retrieved model
  var imagesWithURLs = await Promise.all(imagesArray.docs.map( async (item) => {
      try {
        var imageURL = await generateSignedUrl(item.id + ".jpg");
      } catch (error) {
        res.status(500).send("Error retrieving image URL: " + error);
      }

      const image = getImageJson(item, imageURL);
      return image;
  }));

  res.status(200).send(imagesWithURLs);
});


/* GET dates by id-array in params seperated by ,*/
router.get("/:image_id", async function (req, res, next) {
    var fileName = req.params.image_id + ".jpg";

  images
    .doc(req.params.image_id)
    .get()
    .then((doc) => {
          generateSignedUrl(fileName)
            .catch(console.error)
            .then((imageURL) => {
              const image = {
                id: doc.id,
                title: doc.data().title,
                description: doc.data().description,
                image: imageURL
              };
            res.status(200).send(image);
        });
    })
    .catch((err) => {
      res.status(404).send("Model not found: " + err);
    });
});


/**
 * Upload a new image
 */
router.post("/upload/:image_id", upload.single('upload'), async function (req, res, next) {
    const { originalname, buffer, mimetype } = req.file;
    const fileending = originalname.split(".").slice(-1);
    const blob = imageBucket.file(req.params.image_id + "." + fileending);
    
    const blobStream = blob.createWriteStream({
      contentType: mimetype,
      resumable: false,
    });

    blobStream
      .on("finish", () => {
        res.status(200).send("Successfully uploaded the image: " + originalname);
      })
      .on("error", () => {
        reject(`Unable to upload image, something went wrong`);
      })
      .end(buffer);
});


/* POST new image data */
router.post("/", function (req, res, next) {
  images
    .add(req.body)
    .then((response) => {
      res.status(200).send(response._path.segments[1]); //sends the image id back
    })
    .catch((err) => {
      res.status(404).send("Couldn't add image: " + err);
    });
});




module.exports = router;
