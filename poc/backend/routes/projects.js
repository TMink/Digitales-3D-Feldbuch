var express = require("express");
var router = express.Router();
const nano = require("nano")("http://admin:1234@127.0.0.1:5984");
var request = require("request");
var db_name = "projects";
var db = nano.use(db_name);

/* GET ALL projects */
router.get("/", function (req, res, next) {

  db.get("_design/projects/_view/all", function (err, body, headers) {
    if (err) {
      return res.status(404).send("Could not retrieve all projects");
    }
    res.send(body);
  });
});

/* GET project by ID */
router.get("/:project_id", function (req, res, next) {

  db.get(req.params.project_id, function (err, body, headers) {
    if (err) {
      return res.status(404).send("Could not find project with ID: " + req.params.project_id);
    }
    res.send(body);
  });
});

/* POST new project */
router.post("/", function (req, res, next) {

  db.insert(req.body, function(err, body, headers) {
    if (err) {
      return res
        .status(404)
        .send("Could not save project: " + req.params.name);
    }
    return res.status(200).send("added " + body.id);
  });
});

/* UPDATE project by ID*/
router.put("/:project_id", function (req, res, next) {

  db.insert(req.body, req.params.project_id, function (err, body, headers) {
    if (err) {
      return res
        .status(404)
        .send("Could not find project with ID: " + req.params.project_id);
    }
    return res.status(200).send("updated " + body.id);
  });
});

/* DELETE project by ID*/
router.delete("/:project_id", async function (req, res, next) {

  //TODO: when deleting a project, check if there are associated excavations/cuts/findings etc.
  // and either delete them or delete the associated project_id from them
  db.get(req.params.project_id, function (err, body, headers) {
    if (err) {
      return res
        .status(404)
        .send(
          "Could not find the project with ID: " + req.params.project_id
        );
    }
    db.destroy(req.params.project_id, body._rev, function (err, body, header) {
      if (err) {
        return res
          .status(404)
          .send(
            "Could not delete the project with ID: " + req.params.project_id
          );
      }
      return res.status(200).send("deleted " + body.id);
    });
  });
});

module.exports = router;
