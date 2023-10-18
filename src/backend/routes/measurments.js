const express = require("express");
const router = express.Router();
const db = require("../fb");
const measurements = db.collection("measurements");

/* GET ALL measurements */
router.get("/", function (req, res, next) {
  var measurementsArray = [];
  measurements
    .get()
    .then((data) => {
      data.forEach((doc) => {
        var measurement = {
          id: doc.id,
          accuracy: doc.data().accuracy,
          designation: doc.data().designation,
          from: doc.data().from,
          to: doc.data().to,
          unit: doc.data().unit,
        };
        measurementsArray.push(measurement);
      });
      res.send(measurementsArray);
    })
    .catch((err) => {
      res.status(404).send("No measurements found");
    });
});

/* GET measurement by ID */
router.get("/:measurement_id", function (req, res, next) {
  measurements
    .doc(req.params.measurement_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        var measurement = {
          id: doc.id,
          accuracy: doc.data().accuracy,
          designation: doc.data().designation,
          from: doc.data().from,
          to: doc.data().to,
          unit: doc.data().unit,
        };
        res.send(measurement);
      } else {
        res.status(404).send("No such document: ");
      }
    })
    .catch((err) => {
      res.status(404).send("measurement not found: " + err);
    });
});

/* POST new measurement */
router.post("/", function (req, res, next) {
  measurements
    .doc()
    .set(req.body)
    .then((response) => {
      res.status(200).send("Added measurement");
    })
    .catch((err) => {
      res.status(404).send("Couldn't add measurement: " + err);
    });
});

/* UPDATE measurement by ID*/
router.put("/:measurement_id", function (req, res, next) {
  measurements
    .doc(req.params.measurement_id)
    .update(req.body)
    .then((response) => {
      res.status(200).send("Updated measurement: " + req.params.,measurement_id);
    })
    .catch((err) => {
      res.status(404).send("Couldn't update measurement: " + err);
    });
});

/* DELETE measurement by ID*/
router.delete("/:measurement_id", async function (req, res, next) {
  measurements
    .doc(req.params.measurement_id)
    .delete({ exists: true })
    .then((response) => {
      res.status(200).send("Deleted measurement: " + req.params.measurement_id);
    })
    .catch((err) => {
      res.status(404).send("Couldn't delete measurement: " + err);
    });
});

module.exports = router;
