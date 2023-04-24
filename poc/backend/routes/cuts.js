const express = require("express");
const router = express.Router();
const db = require("../fb");
const excavations = db.collection("excavations");
const cuts = db.collection("cuts");

/* GET ALL cuts */
router.get("/", function (req, res, next) {
  var cutsArray = [];
  cuts
    .get()
    .then((data) => {
      data.forEach((doc) => {
        var cut = {
          id: doc.id,
          excavation_id: doc.data().excavation_id,
          title: doc.data().title,
          description: doc.data().description,
          startLevel: doc.data().startLevel,
          endLevel: doc.data().endLevel,
        };
        cutsArray.push(cut);
      });
      res.send(cutsArray);
    })
    .catch((err) => {
      res.status(404).send("No cuts found");
    });
});

/* GET cut by ID */
router.get("/:cut_id", function (req, res, next) {
  cuts
    .doc(req.params.cut_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        var cut = {
          id: doc.id,
          excavation_id: doc.data().excavation_id,
          title: doc.data().title,
          description: doc.data().description,
          startLevel: doc.data().startLevel,
          endLevel: doc.data().endLevel,
        };
        res.send(cut);
      } else {
        res.status(404).send("No such document: ");
      }
    })
    .catch((err) => {
      res.status(404).send("cut not found: " + err);
    });
});

/* POST new cut */
router.post("/", function (req, res, next) {
  //check if excavation_id exists
  excavations
    .doc(req.body.excavation_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        //if it exists, add the cut to DB
        cuts
          .doc()
          .set(req.body)
          .then((response) => {
            res.status(200).send("Added Cut");
          })
          .catch((err) => {
            res.status(404).send("Couldn't add cut: " + err);
          });
      } else {
        res.status(404).send("No such excavation");
      }
    })
    .catch((err) => {
      res.status(404).send("Excavation not found: " + err);
    });
});

/* UPDATE cut by ID*/
router.put("/:cut_id", function (req, res, next) {
  //check if excavation_id exists
  excavations
    .doc(req.body.excavation_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        //if it exists, add the cut to DB
        cuts
          .doc(req.params.cut_id)
          .update(req.body)
          .then((response) => {
            res.status(200).send("Updated Cut");
          })
          .catch((err) => {
            res.status(404).send("Couldn't update cut: " + err);
          });
      } else {
        res.status(404).send("No such excavation");
      }
    })
    .catch((err) => {
      res.status(404).send("Excavation not found: " + err);
    });
});

/* DELETE cut by ID*/
router.delete("/:cut_id", async function (req, res, next) {
  //TODO: when deleting a cut, also delete all subcollections
  cuts
    .doc(req.params.cut_id)
    .delete({ exists: true })
    .then((response) => {
      res.status(200).send("Deleted cut: " + req.params.cut_id);
    })
    .catch((err) => {
      res.status(404).send("Couldn't delete cut: " + err);
    });
});

module.exports = router;
