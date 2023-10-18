const express = require("express");
const router = express.Router();
const db = require("../fb");
const samples = db.collection("samples");

/* GET ALL samples */
router.get("/", function (req, res, next) {
  var samplesArray = [];
  samples
    .get()
    .then((data) => {
      data.forEach((doc) => {
        var sample = {
          id: doc.id,
          type: doc.data().type,
          description: doc.data().description,
        };
        samplesArray.push(sample);
      });
      res.send(samplesArray);
    })
    .catch((err) => {
      res.status(404).send("No samples found");
    });
});

/* GET sample by ID */
router.get("/:sample_id", function (req, res, next) {
  samples
    .doc(req.params.sample_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        var sample = {
          id: doc.id,
          type: doc.data().type,
          description: doc.data().description,
        };
        res.send(sample);
      } else {
        res.status(404).send("No such document: ");
      }
    })
    .catch((err) => {
      res.status(404).send("Project not found: " + err);
    });
});

/* POST new sample */
router.post("/", function (req, res, next) {
  samples
    .doc()
    .set(req.body)
    .then((response) => {
      res.status(200).send("Added sample");
    })
    .catch((err) => {
      res.status(404).send("Couldn't add sample: " + err);
    });
});

/* UPDATE sample by ID*/
router.put("/:sample_id", function (req, res, next) {
  samples
    .doc(req.params.sample_id)
    .update(req.body)
    .then((response) => {
      res.status(200).send("Updated sample: " + req.params.sample_id);
    })
    .catch((err) => {
      res.status(404).send("Couldn't update sample: " + err);
    });
});

/* DELETE sample by ID*/
router.delete("/:sample_id", async function (req, res, next) {
  samples
    .doc(req.params.sample_id)
    .delete({ exists: true })
    .then((response) => {
      res.status(200).send("Deleted sample: " + req.params.sample_id);
    })
    .catch((err) => {
      res.status(404).send("Couldn't delete sample: " + err);
    });
});

module.exports = router;
