var express = require("express");
var router = express.Router();
const multer = require("multer");
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });
const nano = require("nano")("http://admin:1234@127.0.0.1:5984");
var request = require("request");
var db_name = "models";
var db = nano.use(db_name);
var admin = require("firebase-admin");

var db = require("../fb");
let modelsDB = db.collection("models");

const { Storage, ref } = require("@google-cloud/storage");
const storage = new Storage({ keyFilename: "./serviceAccountKey.json" });

// The ID of your GCS bucket
const bucketName = "feldbuch-1cd8a.appspot.com";

const modelBucket = storage.bucket(bucketName);
// The ID of your GCS file
//const fileName = "model.jpg";

// The path to which the file should be downloaded
const dest = "./public/models/";


/**
 * Takes the retrieved data from DB and builds a JSON-object
 * with all fields for a model. Also creates empty fields,
 * when there is no data for them.
 *
 * @param {JSON} doc The raw model data from database
 * @param {String} modelURL The model URL to gcs
 * @param {String} textureURL The texture URL to gcs
 * @returns model Json-Object with all required fields
 */
function getModelJson(doc, modelURL, textureURL) {
  return {
    id: doc.id,
    title: doc.data().title,
    description: doc.data().description,
    model: modelURL,
    texture: textureURL
  };
}


async function downloadFile(fileName) {
  const options = {
    destination: dest+fileName,
  };

  // Downloads the file
  await storage.bucket(bucketName).file(fileName).download(options);

  console.log(`gs://${bucketName}/${fileName} downloaded to ${dest + fileName}.`);
}


//Generates a signed URL which is accessable for one hour
async function generateSignedUrl(fileName) {
  // These options will allow temporary read access to the file
  const options = {
    version: "v2",
    action: "read",
    expires: Date.now() + 1000 * 60 * 60, // one hour
  };

  // Get a v2 signed URL for the file
  const [url] = await storage
    .bucket(bucketName)
    .file(fileName)
    .getSignedUrl(options);

  //console.log(`The signed url for ${fileName} is ${url}`);
  return url;
}

/**
 * GET models by id-array in params seperated by ,
 */
router.get("/list/:model_ids", async function (req, res, next) {
  var model_ids = req.params.model_ids.split(",");

  //get models from db
  try {
    var modelsArray = await modelsDB
      .where(admin.firestore.FieldPath.documentId(), "in", model_ids)
      .get();
  } catch (error) {
    res.status(500).send("Error retrieving models from database");
  }

  console.log(model_ids)
  // generate signed URLs for every retrieved model
  var modelsWithURLs = await Promise.all(
    modelsArray.docs.map(async (item) => {

      //generate model URL
      try {
        var modelURL = await generateSignedUrl(item.id + ".obj");
      } catch (error) {
        res.status(500).send("Error retrieving model URL: " + error);
      }

      //generate texture URL
      try {
        var textureURL = await generateSignedUrl(item.id + ".jpg");
      } catch (error) {
        res.status(500).send("Error retrieving texture URL: " + error);
      }

      const model = getModelJson(item, modelURL, textureURL);
      return model;
    })
  );

  res.status(200).send(modelsWithURLs);
});


/* GET ALL models */
router.get("/", async function (req, res, next) {
  //get models from db
  try {
    var modelsArray = await models.get();
  } catch (error) {
    res.status(500).send("Error retrieving models from database");
  }
  
  // generate signed URLs for every retrieved model
  var modelsWithURLs = await Promise.all(modelsArray.docs.map( async (item) => {
      try {
        var modelURL = await generateSignedUrl(item.id + ".obj");
      } catch (error) {
        res.status(500).send("Error retrieving model URL: " + error);
      }

      try {
        var textureURL = await generateSignedUrl(item.id + ".jpg");
      } catch (error) {
        res.status(500).send("Error retrieving texture URL: " + error);
      }

      const model = {
        id: item.id,
        project_id: item.data().project_id,
        title: item.data().title,
        model: modelURL,
        texture: textureURL,
      };
      return model;
  }));
  res.status(200).send(modelsWithURLs);
});

/* GET model by ID */
router.get("/:model_id", function (req, res, next) {
  models
    .doc(req.params.model_id).get()
    .then((doc) => {

      generateSignedUrl(req.params.model_id + ".obj").catch(console.error).then(modelURL => {
        generateSignedUrl(req.params.model_id + ".jpg").catch(console.error).then(textureURL => {
          const model = {
            id: doc.id,
            project_id: doc.data().project_id,
            title: doc.data().title,
            model: modelURL,
            texture: textureURL,
          };
          res.status(200).send(model);
        });
      });
    })
    .catch((err) => {
      res.status(404).send("Model not found: " + err);
    });
});

/* POST new model */
router.post("/", async function (req, res, next) {
  models
    .add(req.body)
    .then((response) => {
      console.log
      res.status(200).send(response._path.segments[1]);
    })
    .catch((err) => {
      res.status(404).send("Couldn't add model: " + err);
    });  
});


/**
 * Upload a new model with texture
 */
router.post("/upload/:model_id",
  upload.fields([
    { name: "model", maxCount: 1 },
    { name: "texture", maxCount: 1 },
  ]),
  async function (req, res, next) {
    const model = req.files['model'][0];
    const texture = req.files["texture"][0];

    const modelFileending = model.originalname.split(".").slice(-1);
    const modelBlob = modelBucket.file(req.params.model_id + "." + modelFileending);

    const textureFileending = texture.originalname.split(".").slice(-1);
    const textureBlob = modelBucket.file(req.params.model_id + "." + textureFileending);

    const modelBlobStream = modelBlob.createWriteStream({
      contentType: "text/plain",
      resumable: false,
    });

    const textureBlobStream = textureBlob.createWriteStream({
      contentType: texture.mimetype,
      resumable: false,
    });

    modelBlobStream
      .on("finish", () => {
        textureBlobStream
          .on("finish", () => {
            res
              .status(200)
              .send("Successfully uploaded the model + texture: " + req.params.model_id);
          })
          .on("error", () => {
            reject(`Unable to upload texture, something went wrong`);
          })
          .end(texture.buffer);
      })
      .on("error", () => {
        reject(`Unable to upload model, something went wrong`);
      })
      .end(model.buffer);
  }
);


/* UPDATE model by ID*/
router.put("/:model_id", function (req, res, next) {
  models
    .doc(req.params.model_id)
    .update(req.body)
    .then((response) => {
      res.status(200).send("Updated project: " + req.params.model_id);
    })
    .catch((err) => {
      res.status(404).send("Couldn't update project: " + err);
    });
});


/* DELETE model by ID*/
router.delete("/:model_id", async function (req, res, next) {
  models
    .doc(req.params.model_id)
    .delete({ exists: true })
    .then((response) => {
      //TODO: delete model and texture from firestore file-server
      res.status(200).send("Deleted project: " + req.params.model_id);
    })
    .catch((err) => {
      res.status(404).send("Couldn't delete project: " + err);
    });
});

module.exports = router;
