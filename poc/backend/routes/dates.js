const express = require("express");
const router = express.Router();
const db = require("../fb");
const excavations = db.collection("excavations");
const dates = db.collection("dates");
var admin = require("firebase-admin");

/* GET dates by id-array in params seperated by ,*/
router.get("/:date_ids", function (req, res, next) {
  date_ids = req.params.date_ids.split(",")

  var datesArray = [];
  dates
    .where(admin.firestore.FieldPath.documentId(), "in", date_ids)
    .get()
    .then((data) => {
      data.forEach((doc) => {
        var date = {
          id: doc.id,
          title: doc.data().title,
          date: doc.data().date,
        };
        datesArray.push(date);
      });
      res.send(datesArray);
    })
    .catch((err) => {
      res.status(404).send("No dates found");
    });
});

/* POST new date */
router.post("/", function (req, res, next) {

  splitDate = req.body.date.split("-");
  var newDate = new Date(splitDate[2], splitDate[1] - 1, splitDate[0]);
  dates
    .add({
      title: req.body.title,
      date: newDate
    })
    .then((response) => {
      res.status(200).send(response._path.segments[1]);
    })
    .catch((err) => {
      res.status(404).send("Couldn't add date: " + err);
    });
});

/* UPDATE date by ID*/
router.put("/:date_id", function (req, res, next) {
  //check if excavation_id exists
  excavations
    .doc(req.body.excavation_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        //if it exists, add the date to DB
        dates
          .doc(req.params.date_id)
          .update(req.body)
          .then((response) => {
            res.status(200).send("Updated Date");
          })
          .catch((err) => {
            res.status(404).send("Couldn't update date: " + err);
          });
      } else {
        res.status(404).send("No such excavation");
      }
    })
    .catch((err) => {
      res.status(404).send("Excavation not found: " + err);
    });
});

/* DELETE date by ID*/
router.delete("/:date_id", async function (req, res, next) {
  dates
    .doc(req.params.date_id)
    .delete({ exists: true })
    .then((response) => {
      res.status(200).send("Deleted date: " + req.params.date_id);
    })
    .catch((err) => {
      res.status(404).send("Couldn't delete date: " + err);
    });
});

module.exports = router;
