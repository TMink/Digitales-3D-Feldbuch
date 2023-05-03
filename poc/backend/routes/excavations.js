const express = require("express");
const router = express.Router();
const db = require("../fb");
const projects = db.collection("projects");
const excavations = db.collection("excavations");
var admin = require("firebase-admin");



/* GET excavations by id-array in params seperated by ,*/
router.get("/list/:excavation_ids", function (req, res, next) {
  var excavation_ids = req.params.excavation_ids.split(",");

  var excavationsArray = [];
  excavations
    .where(admin.firestore.FieldPath.documentId(), "in", excavation_ids)
    .get()
    .then((data) => {
      data.forEach((doc) => {
        var excavation = {
          id: doc.id,
          project_id: doc.data().project_id,
          title: doc.data().title,
          description: doc.data().description,
          client: doc.data().client,
          focus: doc.data().focus,
          length: doc.data().length,
          location: doc.data().location,
          organization: doc.data().organization,
          dates: doc.data().dates,
        };
        excavationsArray.push(excavation);
      });
      res.send(excavationsArray);
    })
    .catch((err) => {
      res.status(404).send("No excavations found");
    });
});


/* GET ALL excavations */
router.get("/", function (req, res, next) {
  var excavationsArray = [];
  excavations.get().then((data) => {
    data.forEach((doc) => {
      var excavation = {
        id: doc.id,
        project_id: doc.data().project_id,
        title: doc.data().title,
        description: doc.data().description,
        client: doc.data().client,
        focus: doc.data().focus,
        length: doc.data().length,
        location: doc.data().location,
        organization: doc.data().organization,
        dates: doc.data().dates
      };
      excavationsArray.push(excavation);
    });
    res.send(excavationsArray);
  }).catch(err => {
    res.status(404).send("No excavations found");
  });
});

/* GET excavations by project_id ,*/
router.get("/project_id/:project_id", async function (req, res, next) {

  var project = await projects.doc(req.params.project_id).get();

  var excavationsArray = [];
  //TODO: edge case when there are no excavations in a project
  if(project.data().excavations.length === 0) {
    res.status(404).send("No excavations in this project")
  } else {

      excavations
        .where(admin.firestore.FieldPath.documentId(), "in", project.data().excavations)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            var excavation = {
              id: doc.id,
              title: doc.data().title,
              description: doc.data().description,
              client: doc.data().client,
              focus: doc.data().focus,
              length: doc.data().length,
              location: doc.data().location,
              organization: doc.data().organization,
              dates: doc.data().dates,
            };
            excavationsArray.push(excavation);
          });
          res.send(excavationsArray);
        })
        .catch((err) => {
          res.status(404).send("No excavations found");
        });
  }
});


/* GET excavation by ID */
router.get("/:excavation_id", function (req, res, next) {
  excavations
    .doc(req.params.excavation_id)
    .get()
    .then((doc) => {
      var excavation = {
        id: doc.id,
        project_id: doc.data().project_id,
        title: doc.data().title,
        description: doc.data().description,
        client: doc.data().client,
        focus: doc.data().focus,
        length: doc.data().length,
        location: doc.data().location,
        organization: doc.data().organization,
        dates: doc.data().dates
      };
      res.send(excavation);
    })
    .catch((err) => {
      res.status(404).send("Excavation not found: " + err);
    });
});

/* POST new excavation */
router.post("/:project_id", async function (req, res, next) {
  //check if project_id exists
  projects
    .doc(req.params.project_id)
    .get()
    .then(async (doc) => {
      if(doc.exists) {
        //if it exists, add the excavation to DB
        var newProject = doc.data();

        try {
          var excavation_id = await excavations.add(req.body);
        } catch (error) {
          res.status(404).send("Couldn't add excavation");
        }

        //add newly created excavation_id to the project list of excavation ids
        newProject.excavations.push(excavation_id.id);
        projects
          .doc(req.params.project_id)
          .update(newProject)
          .then((response) => {
            res.status(200).send("Updated excavation: " + response);
          })
          .catch((err) => {
            res.status(404).send("Couldn't update excavation: " + err);
          });
      } else {
        res.status(404).send("No such project");
      }
    }).catch((err) => {
      res.status(404).send("Project not found: " + err);
    });
});

/* UPDATE excavation by ID*/
router.put("/:excavation_id", function (req, res, next) {
  excavations
    .doc(req.params.excavation_id)
    .update(req.body)
    .then((response) => {
      res.status(200).send("Updated excavation: " + req.params.excavation_id);
    })
    .catch((err) => {
      res.status(404).send("Couldn't update excavation: " + err);
    });
});

/**
 * DELETE excavation by ID
 * 
 * procedure:
 * - GET project by id
 * - UPDATE project by deleting excavation_id from array
 * - DELETE excavation by ID
 */
router.delete("/:project_id/:excavation_id", async function (req, res, next) {
  //TODO: when deleting a excavation, also delete all subcollections
  projects
    .doc(req.params.project_id)
    .get()
    .then((doc) => {
      var newProject = doc.data();
      var index = newProject.excavations.indexOf(req.params.excavation_id);
      newProject.excavations.splice(index, 1);
      projects
        .doc(req.params.project_id)
        .update(newProject)
        .then((response) => {
          excavations
            .doc(req.params.excavation_id)
            .delete({ exists: true })
            .then((response) => {
              res.status(200).send("Deleted excavation: " + req.params.excavation_id);
            })
            .catch((err) => {
              res.status(404).send("Couldn't delete excavation: " + err);
            });
        })
        .catch((err) => {
          res.status(404).send("Couldn't delete excavation: " + err);
        });
    })
    .catch((err) => {
      res.status(404).send("Couldn't delete excavation: " + err);
    });
});

module.exports = router;
