const express = require("express");
const router = express.Router();
const db = require("../fb");
const contacts = db.collection("colors");

/* GET ALL colors */
router.get("/", function (req, res, next) {
  var colorsArray = [];
  colors
    .get()
    .then((data) => {
      data.forEach((doc) => {
        var color = {
          id: doc.id,
          firstname: doc.data().chroma,
          designation: doc.data().designation,
          hex-value: doc.data().hex-value,
          lightness: doc.data().lightness,
          saturation: doc.data().saturation,
        };
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
        var color = {
          id: doc.id,
          firstname: doc.data().chroma,
          designation: doc.data().designation,
          hex-value: doc.data().hex-value,
          lightness: doc.data().lightness,
          saturation: doc.data().saturation,
        };
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
    .doc()
    .set(req.body)
    .then((response) => {
      res.status(200).send("Added color");
    })
    .catch((err) => {
      res.status(404).send("Couldn't add color: " + err);
    });
});

/* UPDATE contact by ID*/
router.put("/:color_id", function (req, res, next) {
  contacts
    .doc(req.params.contact_id)
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
    .doc(req.params.contact_id)
    .delete({ exists: true })
    .then((response) => {
      res.status(200).send("Deleted color: " + req.params.color_id);
    })
    .catch((err) => {
      res.status(404).send("Couldn't delete color: " + err);
    });
});

module.exports = router;
