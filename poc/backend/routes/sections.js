const express = require("express");
const router = express.Router();
const db = require("../fb");
const excavations = db.collection("excavations");
const sections = db.collection("sections");

/* GET ALL sections */
router.get("/", function (req, res, next) {
  var sectionsArray = [];
  sections
    .get()
    .then((data) => {
      data.forEach((doc) => {
        var section = {
          id: doc.id,
          excavation_id: doc.data().excavation_id,
          title: doc.data().title,
          description: doc.data().description,
          startLevel: doc.data().startLevel,
          endLevel: doc.data().endLevel,
        };
        sectionsArray.push(section);
      });
      res.send(sectionsArray);
    })
    .catch((err) => {
      res.status(404).send("No sections found");
    });
});

/* GET section by ID */
router.get("/:section_id", function (req, res, next) {
  sections
    .doc(req.params.section_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        var section = {
          id: doc.id,
          excavation_id: doc.data().excavation_id,
          title: doc.data().title,
          description: doc.data().description,
          startLevel: doc.data().startLevel,
          endLevel: doc.data().endLevel,
        };
        res.send(section);
      } else {
        res.status(404).send("No such document: ");
      }
    })
    .catch((err) => {
      res.status(404).send("section not found: " + err);
    });
});

/* POST new section */
router.post("/", function (req, res, next) {
  //check if excavation_id exists
  excavations
    .doc(req.body.excavation_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        //if it exists, add the section to DB
        sections
          .doc()
          .set(req.body)
          .then((response) => {
            res.status(200).send("Added section");
          })
          .catch((err) => {
            res.status(404).send("Couldn't add section: " + err);
          });
      } else {
        res.status(404).send("No such excavation");
      }
    })
    .catch((err) => {
      res.status(404).send("Excavation not found: " + err);
    });
});

/* UPDATE section by ID*/
router.put("/:section_id", function (req, res, next) {
  //check if excavation_id exists
  excavations
    .doc(req.body.excavation_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        //if it exists, add the section to DB
        sections
          .doc(req.params.section_id)
          .update(req.body)
          .then((response) => {
            res.status(200).send("Updated section");
          })
          .catch((err) => {
            res.status(404).send("Couldn't update section: " + err);
          });
      } else {
        res.status(404).send("No such excavation");
      }
    })
    .catch((err) => {
      res.status(404).send("Excavation not found: " + err);
    });
});

/* DELETE section by ID*/
router.delete("/:section_id", async function (req, res, next) {
  //TODO: when deleting a section, also delete all subcollections
  sections
    .doc(req.params.section_id)
    .delete({ exists: true })
    .then((response) => {
      res.status(200).send("Deleted section: " + req.params.section_id);
    })
    .catch((err) => {
      res.status(404).send("Couldn't delete section: " + err);
    });
});

module.exports = router;
