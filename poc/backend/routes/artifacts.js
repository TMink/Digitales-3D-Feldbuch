const express = require("express");
const router = express.Router();
const db = require("../fb");
const features = db.collection("features");
const artifacts = db.collection("artifacts");

/* GET ALL artifacts */
router.get("/", function (req, res, next) {
  var artifactsArray = [];
  artifacts
    .get()
    .then((data) => {
      data.forEach((doc) => {
        var artifact = {
          id: doc.id,
          section_id: doc.data().section_id,
          feature_id: doc.data().feature_id,
          number: doc.data().number,
          description: doc.data().description,
          inscriptions: doc.data().inscriptions,
          state: doc.data().state,
          literature: doc.data().literature,
          producer: doc.data().producer,
          material: doc.data().material,
          type: doc.data().type,
        };
        artifactsArray.push(artifact);
      });
      res.send(artifactsArray);
    })
    .catch((err) => {
      res.status(404).send("No artifacts found");
    });
});

/* GET artifact by ID */
router.get("/:artifact_id", function (req, res, next) {
  artifacts
    .doc(req.params.artifact_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        var artifact = {
          id: doc.id,
          section_id: doc.data().section_id,
          feature_id: doc.data().feature_id,
          number: doc.data().number,
          description: doc.data().description,
          inscriptions: doc.data().inscriptions,
          state: doc.data().state,
          literature: doc.data().literature,
          producer: doc.data().producer,
          material: doc.data().material,
          type: doc.data().type,
        };
        res.send(artifact);
      } else {
        res.status(404).send("No such document: ");
      }
    })
    .catch((err) => {
      res.status(404).send("artifact not found: " + err);
    });
});

/* POST new artifact */
router.post("/", function (req, res, next) {
  //check if feature_id exists
  features
    .doc(req.body.feature_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        //if it exists, add the artifact to DB
        artifacts
          .doc()
          .set(req.body)
          .then((response) => {
            res.status(200).send("Added artifact");
          })
          .catch((err) => {
            res.status(404).send("Couldn't add artifact: " + err);
          });
      } else {
        res.status(404).send("No such excavation");
      }
    })
    .catch((err) => {
      res.status(404).send("Excavation not found: " + err);
    });
});

/* UPDATE artifact by ID*/
router.put("/:artifact_id", function (req, res, next) {
  //check if feature_id exists
  features
    .doc(req.body.feature_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        //if it exists, add the artifact to DB
        artifacts
          .doc(req.params.artifact_id)
          .update(req.body)
          .then((response) => {
            res.status(200).send("Updated artifact");
          })
          .catch((err) => {
            res.status(404).send("Couldn't update artifact: " + err);
          });
      } else {
        res.status(404).send("No such excavation");
      }
    })
    .catch((err) => {
      res.status(404).send("Excavation not found: " + err);
    });
});

/* DELETE artifact by ID*/
router.delete("/:artifact_id", async function (req, res, next) {
  //TODO: when deleting a artifact, also delete all subcollections
  artifacts
    .doc(req.params.artifact_id)
    .delete({ exists: true })
    .then((response) => {
      res.status(200).send("Deleted artifact: " + req.params.artifact_id);
    })
    .catch((err) => {
      res.status(404).send("Couldn't delete artifact: " + err);
    });
});

module.exports = router;
