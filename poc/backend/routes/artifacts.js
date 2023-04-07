var express = require("express");
var router = express.Router();
const nano = require("nano")("http://admin:1234@127.0.0.1:5984");
var request = require("request");
var db_name = "artifacts";
var db = nano.use(db_name);

/* GET ALL artifacts */
router.get("/", function (req, res, next) {
  db.get("_design/artifacts/_view/all", function (err, body, headers) {
    if (err) {
      return res.status(404).send("Could not retrieve all artifacts");
    }
    res.send(body);
  });
});

/* GET artifact by ID */
router.get("/:artifact_id", function (req, res, next) {
  db.get(req.params.artifact_id, function (err, body, headers) {
    if (err) {
      return res
        .status(404)
        .send("Could not find artifact with ID: " + req.params.artifact_id);
    }
    res.send(body);
  });
});

/* POST new artifact */
router.post("/", function (req, res, next) {
  db.insert(req.body, function (err, body, headers) {
    if (err) {
      return res.status(404).send("Could not save artifact: " + req.params.name);
    }
    return res.status(200).send("added " + body.id);
  });
});

/* UPDATE artifact by ID*/
router.put("/:artifact_id", function (req, res, next) {
  db.insert(req.body, req.params.artifact_id, function (err, body, headers) {
    if (err) {
      return res
        .status(404)
        .send("Could not find artifact with ID: " + req.params.artifact_id);
    }
    return res.status(200).send("updated " + body.id);
  });
});

/* DELETE artifact by ID*/
router.delete("/:artifact_id", async function (req, res, next) {
  db.get(req.params.artifact_id, function (err, body, headers) {
    if (err) {
      return res
        .status(404)
        .send("Could not find the artifact with ID: " + req.params.artifact_id);
    }
    db.destroy(req.params.artifact_id, body._rev, function (err, body, header) {
      if (err) {
        return res
          .status(404)
          .send("Could not delete the artifact with ID: " + req.params.artifact_id);
      }
      return res.status(200).send("deleted " + body.id);
    });
  });
});

module.exports = router;
