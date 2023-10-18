const express = require("express");
const router = express.Router();
const db = require("../fb");
const utmPoints = db.collection("utmPoints");
var admin = require("firebase-admin");

/**
 * Takes the retrieved data from DB and builds a JSON-object
 * with all fields for a utmPoint. Also creates empty fields,
 * when there is no data for them.
 *
 * @param {*} doc The raw excavation data from database
 * @returns utmPoint Json-Object with all required fields
 */
function getUtmPointJson(doc) {
  return {
    id: doc.id,
    title: doc.data().title,
    description: doc.data().description,
    eastvalue: doc.data().eastvalue,
    northvalue: doc.data().northvalue,
    heightvalue: doc.data().heightvalue,
  };
}

/* GET utmPoints by id-array in params separated by ,*/
router.get("/:utmPoint_ids", function (req, res, next) {
  var utmPoint_ids = req.params.utmPoint_ids.split(",");

  var utmPointsArray = [];
  utmPoints
    .where(admin.firestore.FieldPath.documentId(), "in", utmPoint_ids)
    .get()
    .then((data) => {
      data.forEach((doc) => {
        var utmPoint = getUtmPointJson(doc);
        utmPointsArray.push(utmPoint);
      });
      res.send(utmPointsArray);
    })
    .catch((err) => {
      res.status(404).send("No utmPoints found");
    });
});

/* GET ALL utmPoints */
router.get("/", function (req, res, next) {
  var utmPointsArray = [];
  utmPoints
    .get()
    .then((data) => {
      data.forEach((doc) => {
        var utmPoint = getUtmPointJson(doc);
        utmPointsArray.push(utmPoint);
      });
      res.send(utmPointsArray);
    })

    .catch((err) => {
      res.status(404).send("No utmPoints found");
    });
});

/* GET utmPoints by ID */
router.get("/:utmPoint_id", function (req, res, next) {
  utmPoints
    .doc(req.params.utmPoint_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        var utmPoint = getUtmPointJson(doc);
        res.send(utmPoint);
      } else {
        res.status(404).send("No such document: ");
      }
    })
    .catch((err) => {
      res.status(404).send("utmPoint not found: " + err);
    });
});

/* POST new utmPoint */
router.post("/", function (req, res, next) {
  utmPoints
    .add(req.body)
    .then((response) => {
      res.status(200).send(response._path.segments[1]); //sends the utmPoint id back
    })
    .catch((err) => {
      res.status(404).send("Couldn't add utmPoint: " + err);
    });
});

/* UPDATE utmPoint by ID*/
router.put("/:utmPoint_id", function (req, res, next) {
  utmPoints
    .doc(req.params.utmPoint_id)
    .update(req.body)
    .then((response) => {
      res.status(200).send("Updated utmPoint: " + req.params.utmPoint_id);
    })
    .catch((err) => {
      res.status(404).send("Couldn't update utmPoint: " + err);
    });
});

/* DELETE utmPoint by ID*/
router.delete("/:utmPoint_id", async function (req, res, next) {
  utmPoints
    .doc(req.params.utmPoint_id)
    .delete({ exists: true })
    .then((response) => {
      res.status(200).send("Deleted utmPoint: " + req.params.utmPoint_id);
    })
    .catch((err) => {
      res.status(404).send("Couldn't delete utmPoint: " + err);
    });
});

module.exports = router;
