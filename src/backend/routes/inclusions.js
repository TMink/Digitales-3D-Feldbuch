const express = require("express");
const router = express.Router();
const db = require("../fb");
const inclusions = db.collection("inclusions");

/* GET ALL inclusions */
router.get("/", function (req, res, next) {
  var inclusionsArray = [];
  inclusions
    .get()
    .then((data) => {
      data.forEach((doc) => {
        var inclusion = {
          id: doc.id,
          designation: doc.data().designation,
          percentage: doc.data().percentage,
        };
        inclusionsArray.push(inclusion);
      });
      res.send(inclusionsArray);
    })
    .catch((err) => {
      res.status(404).send("No inclusion found");
    });
});

/* GET inclusion by ID */
router.get("/:inclusion_id", function (req, res, next) {
  inclusions
    .doc(req.params.inclusion_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        var inclusion = {
          id: doc.id,
          designation: doc.data().designation,
          percentage: doc.data().percentage,
        };
        res.send(inclusion);
      } else {
        res.status(404).send("No such document: ");
      }
    })
    .catch((err) => {
      res.status(404).send("inclusion not found: " + err);
    });
});

/* POST new inclusion */
router.post("/", function (req, res, next) {
  inclusions
    .doc()
    .set(req.body)
    .then((response) => {
      res.status(200).send("Added inclusion");
    })
    .catch((err) => {
      res.status(404).send("Couldn't add inclusion: " + err);
    });
});

/* UPDATE inclusion by ID*/
router.put("/:inclusion_id", function (req, res, next) {
  inclusions
    .doc(req.params.inclusion_id)
    .update(req.body)
    .then((response) => {
      res.status(200).send("Updated inclusion: " + req.params.inclusion_id);
    })
    .catch((err) => {
      res.status(404).send("Couldn't update inclusion: " + err);
    });
});

/* DELETE inclusion by ID*/
router.delete("/:inclusion_id", async function (req, res, next) {
  inclusions
    .doc(req.params.inclusion_id)
    .delete({ exists: true })
    .then((response) => {
      res.status(200).send("Deleted inclusion: " + req.params.inclusion_id);
    })
    .catch((err) => {
      res.status(404).send("Couldn't delete inclusion: " + err);
    });
});

module.exports = router;
