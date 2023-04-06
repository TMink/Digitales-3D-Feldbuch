var express = require("express");
var router = express.Router();
const nano = require("nano")("http://admin:1234@127.0.0.1:5984");
var request = require("request");
var db_name = "excavations";
var db = nano.use(db_name);

/* GET ALL excavations */
router.get("/", function (req, res, next) {

  db.get("_design/excavations/_view/all", function (err, body, headers) {
    if (err) {
      return response.status(404).send("Could not retrieve all excavations");
    }
    return res.send(body);
  });
});

/* GET excavation by ID */
router.get("/:excavation_id", function (req, res, next) {

  db.get(req.params.excavation_id, function (err, body, headers) {
    if (err) {
      return res
        .status(404)
        .send("Could not find excavation with ID: " + req.params.excavation_id);
    }
    return res.send(body);
  });
});

/* POST new excavation */
router.post("/", function (req, res, next) {

  db.insert(req.body, function(err, body, headers) {
    if (err) {
      return res
        .status(404)
        .send("Could not save excavation: " + req.params.name);
    }
    return res.status(200).send("added " + body.id);
  });
});

/* UPDATE excavation by ID*/
router.put("/:excavation_id", function (req, res, next) {

  db.insert(req.body, req.params.excavation_id, function(err, body, headers) {
    if (err) {
      return res
        .status(404)
        .send("Could not find excavation with ID: " + req.params.excavation_id);
    }
    return res.status(200).send("updated " + body.id);
  });
});

/* DELETE excavation by ID*/
router.delete("/:excavation_id", async function (req, res, next) {

  db.get(req.params.excavation_id, function (err, body, headers) {
    if (err) {
      return res
        .status(404)
        .send(
          "Could not find the excavation with ID: " + req.params.excavation_id
        );
    }
    db.destroy(req.params.excavation_id, body._rev, function(err, body, header) {
      if (err) {
       return res.status(404).send("Could not delete the excavation with ID: " + req.params.excavation_id);
      }
      return res.status(200).send("deleted " + body.id);
    });
  });
});

module.exports = router;
