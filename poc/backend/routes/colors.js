const express = require("express");
const router = express.Router();
const db = require("../fb");
const colors = db.collection("colors");
var admin = require("firebase-admin");


/**
 * Takes the retrieved data from DB and builds a JSON-object
 * with all fields for a color. Also creates empty fields,
 * when there is no data for them.
 *
 * @param {*} doc The raw excavation data from database
 * @returns color Json-Object with all required fields
 */
function getColorJson(doc) {
  return {
    id: doc.id,
    title: doc.data().title,
    hexa: doc.data().hexa,
    rgba_r: doc.data().rgba_r,
    rgba_g: doc.data().rgba_g,
    rgba_b: doc.data().rgba_b,
    rgba_a: doc.data().rgba_a,
  };
}


/* GET colors by id-array in params seperated by ,*/
router.get("/:color_ids", function (req, res, next) {
  var color_ids = req.params.color_ids.split(",")

  var colorsArray = [];
  colors
    .where(admin.firestore.FieldPath.documentId(), "in", color_ids)
    .get()
    .then((data) => {
      data.forEach((doc) => {
        var color = getColorJson(doc);
        colorsArray.push(color);
      });
      res.send(colorsArray);
    })
    .catch((err) => {
      res.status(404).send("No colors found");
    });
});



/* GET ALL colors */
router.get("/", function (req, res, next) {
  var colorsArray = [];
  colors
    .get()
    .then((data) => {
      data.forEach((doc) => {
        var color = getColorJson(doc);
        colorsArray.push(color);
      });
      res.send(colorsArray);
    })

    .catch((err) => {
      res.status(404).send("No colors found");
    });
});

/* GET colors by ID */
router.get("/:color_id", function (req, res, next) {
  colors
    .doc(req.params.color_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        var color = getColorJson(doc);
        res.send(color);
      } else {
        res.status(404).send("No such document: ");
      }
    })
    .catch((err) => {
      res.status(404).send("color not found: " + err);
    });
});

/* POST new color */
router.post("/", function (req, res, next) {
  colors
    .add(req.body)
    .then((response) => {
      res.status(200).send(response._path.segments[1]); //sends the color id back
    })
    .catch((err) => {
      res.status(404).send("Couldn't add color: " + err);
    });
    
});

/* UPDATE color by ID*/
router.put("/:color_id", function (req, res, next) {
  colors
    .doc(req.params.color_id)
    .update(req.body)
    .then((response) => {
      res.status(200).send("Updated color: " + req.params.color_id);
    })
    .catch((err) => {
      res.status(404).send("Couldn't update color: " + err);
    });
});

/* DELETE color by ID*/
router.delete("/:color_id", async function (req, res, next) {
  colors
    .doc(req.params.color_id)
    .delete({ exists: true })
    .then((response) => {
      res.status(200).send("Deleted color: " + req.params.color_id);
    })
    .catch((err) => {
      res.status(404).send("Couldn't delete color: " + err);
    });
});

module.exports = router;
