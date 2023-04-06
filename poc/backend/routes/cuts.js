var express = require("express");
var router = express.Router();
const nano = require("nano")("http://admin:1234@127.0.0.1:5984");
var request = require("request");
var db_name = "cuts";
var db = nano.use(db_name);

/* GET ALL cuts */
router.get("/", function (req, res, next) {
  db.get("_design/cuts/_view/all", function (err, body, headers) {
    if (err) {
      return res.status(404).send("Could not retrieve all cuts");
    }
    res.send(body);
  });
});

/* GET cut by ID */
router.get("/:cut_id", function (req, res, next) {
  db.get(req.params.cut_id, function (err, body, headers) {
    if (err) {
      return res
        .status(404)
        .send("Could not find cut with ID: " + req.params.cut_id);
    }
    res.send(body);
  });
});

/* POST new cut */
router.post("/", function (req, res, next) {
  db.insert(req.body, function (err, body, headers) {
    if (err) {
      return res.status(404).send("Could not save cut: " + req.params.name);
    }
    return res.status(200).send("added " + body.id);
  });
});

/* UPDATE cut by ID*/
router.put("/:cut_id", function (req, res, next) {
  db.insert(req.body, req.params.cut_id, function (err, body, headers) {
    if (err) {
      return res
        .status(404)
        .send("Could not find cut with ID: " + req.params.cut_id);
    }
    return res.status(200).send("updated " + body.id);
  });
});

/* DELETE cut by ID*/
router.delete("/:cut_id", async function (req, res, next) {
  //TODO: when deleting a cut, check if there are associated findings
  // and either delete them or delete the associated cut_id from them
  db.get(req.params.cut_id, function (err, body, headers) {
    if (err) {
      return res
        .status(404)
        .send("Could not find the cut with ID: " + req.params.cut_id);
    }
    db.destroy(req.params.cut_id, body._rev, function (err, body, header) {
      if (err) {
        return res
          .status(404)
          .send(
            "Could not delete the cut with ID: " + req.params.cut_id
          );
      }
      return res.status(200).send("deleted " + body.id);
    });
  });
});

module.exports = router;
