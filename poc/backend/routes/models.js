var express = require("express");
var router = express.Router();
const nano = require("nano")("http://admin:1234@127.0.0.1:5984");
var request = require("request");
var db_name = "models";
var db = nano.use(db_name);

var db = require("../fb");
let models = db.collection("models");

const { Storage, ref } = require("@google-cloud/storage");
const storage = new Storage({ keyFilename: "./serviceAccountKey.json" });

// The ID of your GCS bucket
const bucketName = "feldbuch-1cd8a.appspot.com";

// The ID of your GCS file
//const fileName = "model.jpg";

// The path to which the file should be downloaded
const dest = "./public/models/";

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
    .doc()
    .set(req.body)
    .then((response) => {
      res.status(200).send("Added model");
    })
    .catch((err) => {
      res.status(404).send("Couldn't add model: " + err);
    });  
});

/* UPDATE model by ID*/
router.put("/:model_id", function (req, res, next) {
  console.log(req.body)
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
