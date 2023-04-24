const express = require("express");
const router = express.Router();
const db = require("../fb");
const excavations = db.collection("excavations");
const features = db.collection("features");

/* GET ALL features */
router.get("/", function (req, res, next) {
  var featuresArray = [];
  features
    .get()
    .then((data) => {
      data.forEach((doc) => {
        var feature = {
          id: doc.id,
          section_id: doc.data().section_id,
          number: doc.data().number,
          title: doc.data().title,
          description: doc.data().description,
          rel_localization: doc.data().rel_localization,
          type_id: doc.data().type_id
        };
        featuresArray.push(feature);
      });
      res.send(featuresArray);
    })
    .catch((err) => {
      res.status(404).send("No features found");
    });
});

/* GET feature by ID */
router.get("/:feature_id", function (req, res, next) {
  features
    .doc(req.params.feature_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        var feature = {
          id: doc.id,
          section_id: doc.data().section_id,
          number: doc.data().number,
          title: doc.data().title,
          description: doc.data().description,
          rel_localization: doc.data().rel_localization,
          type_id: doc.data().type_id,
        };
        res.send(feature);
      } else {
        res.status(404).send("No such document: ");
      }
    })
    .catch((err) => {
      res.status(404).send("feature not found: " + err);
    });
});

/* POST new feature */
router.post("/", function (req, res, next) {
  //check if excavation_id exists
  excavations
    .doc(req.body.excavation_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        //if it exists, add the feature to DB
        features
          .doc()
          .set(req.body)
          .then((response) => {
            res.status(200).send("Added Feature");
          })
          .catch((err) => {
            res.status(404).send("Couldn't add feature: " + err);
          });
      } else {
        res.status(404).send("No such excavation");
      }
    })
    .catch((err) => {
      res.status(404).send("Excavation not found: " + err);
    });
});

/* UPDATE feature by ID*/
router.put("/:feature_id", function (req, res, next) {
  //check if excavation_id exists
  excavations
    .doc(req.body.excavation_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        //if it exists, add the feature to DB
        features
          .doc(req.params.feature_id)
          .update(req.body)
          .then((response) => {
            res.status(200).send("Updated Feature");
          })
          .catch((err) => {
            res.status(404).send("Couldn't update feature: " + err);
          });
      } else {
        res.status(404).send("No such excavation");
      }
    })
    .catch((err) => {
      res.status(404).send("Excavation not found: " + err);
    });
});

/* DELETE feature by ID*/
router.delete("/:feature_id", async function (req, res, next) {
  //TODO: when deleting a feature, also delete all subcollections
  features
    .doc(req.params.feature_id)
    .delete({ exists: true })
    .then((response) => {
      res.status(200).send("Deleted feature: " + req.params.feature_id);
    })
    .catch((err) => {
      res.status(404).send("Couldn't delete feature: " + err);
    });
});

module.exports = router;
