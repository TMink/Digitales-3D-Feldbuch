var express = require("express");
var router = express.Router();
const nano = require("nano")("http://admin:1234@127.0.0.1:5984");
var request = require("request");
var db_name = "projects";
var db = nano.use(db_name);

/* GET users listing. */
router.get("/", function (req, res, next) {
  console.log("GET ALL PROJECTS");

  db.get("_design/projects/_view/all", function (error, body, headers) {
    if (error) {
      return response.status(200).send(error.message);
    }
    res.send(body);
  });
});

router.get("/:project_id", function (req, res, next) {
  console.log("GET PROJECT WITH ID + " + req.params.project_id);

  db.get(req.params.project_id, function (error, body, headers) {
    if (error) {
      return response.status(200).send(error.message);
    }
    res.send(body);
  });
});

module.exports = router;
