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
module.exports = router;
