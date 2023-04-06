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

module.exports = router;
