var express = require("express");
var router = express.Router();
const nano = require("nano")("http://admin:1234@127.0.0.1:5984");
var request = require("request");
var db_name = "features";
var db = nano.use(db_name);

 //a feature is defined as a nonmoveable element of an archaeological site

/* GET ALL features */
router.get("/", function (req, res, next) {
  db.get("_design/features/_view/all", function (err, body, headers) {
    if (err) {
      return res.status(404).send("Could not retrieve all features");
    }
    res.send(body);
  });
});

/* GET feature by ID */
router.get("/:feature_id", function (req, res, next) {
  db.get(req.params.feature_id, function (err, body, headers) {
    if (err) {
      return res
        .status(404)
        .send("Could not find feature with ID: " + req.params.feature_id);
    }
    res.send(body);
  });
});

/* POST new feature */
router.post("/", function (req, res, next) {
  db.insert(req.body, function (err, body, headers) {
    if (err) {
      return res.status(404).send("Could not save feature: " + req.params.name);
    }
    return res.status(200).send("added " + body.id);
  });
});

/* UPDATE feature by ID*/
router.put("/:feature_id", function (req, res, next) {
  db.insert(req.body, req.params.feature_id, function (err, body, headers) {
    if (err) {
      return res
        .status(404)
        .send("Could not find feature with ID: " + req.params.feature_id);
    }
    return res.status(200).send("updated " + body.id);
  });
});

/* DELETE feature by ID*/
router.delete("/:feature_id", async function (req, res, next) {
  db.get(req.params.feature_id, function (err, body, headers) {
    if (err) {
      return res
        .status(404)
        .send("Could not find the feature with ID: " + req.params.feature_id);
    }
    db.destroy(req.params.feature_id, body._rev, function (err, body, header) {
      if (err) {
        return res
          .status(404)
          .send("Could not delete the feature with ID: " + req.params.feature_id);
      }
      return res.status(200).send("deleted " + body.id);
    });
  });
});

module.exports = router;
