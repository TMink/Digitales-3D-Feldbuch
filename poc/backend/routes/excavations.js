var express = require("express");
var router = express.Router();
const nano = require("nano")("http://admin:1234@127.0.0.1:5984");
var request = require("request");
var db_name = "testdata";
var db = nano.use(db_name);

/* GET users listing. */
router.get("/", function (req, res, next) {
  console.log("GET ALL EXCAVATIONS");

  db.get("_design/view3/_view/excavation", function (error, body, headers) {
    if (error) {
      return response.status(200).send(error.message);
    }
    res.send(body);
  });
});

router.get("/:excavation_id", function (req, res, next) {
  console.log("GET EXCAVATION WITH ID + " + req.params.excavation_id);

  db.get(req.params.excavation_id, function (error, body, headers) {
    if (error) {
      return response.status(200).send(error.message);
    }
    res.send(body);
  });
});

module.exports = router;
