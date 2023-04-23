const express = require("express");
const router = express.Router();
const db = require("../fb");
const contacts = db.collection("contacts");

/* GET ALL contacts */
router.get("/", function (req, res, next) {
  var contactsArray = [];
  contacts
    .get()
    .then((data) => {
      data.forEach((doc) => {
        var contact = {
          id: doc.id,
          firstname: doc.data().firstname,
          surname: doc.data().surname,
          role: doc.data().role,
          mail: doc.data().mail,
          phone: doc.data().phone,
        };
        contactsArray.push(contact);
      });
      res.send(contactsArray);
    })
    .catch((err) => {
      res.status(404).send("No contacts found");
    });
});

/* GET contact by ID */
router.get("/:contact_id", function (req, res, next) {
  contacts
    .doc(req.params.contact_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        var contact = {
          id: doc.id,
          firstname: doc.data().firstname,
          surname: doc.data().surname,
          role: doc.data().role,
          mail: doc.data().mail,
          phone: doc.data().phone,
        };
        res.send(contact);
      } else {
        res.status(404).send("No such document: ");
      }
    })
    .catch((err) => {
      res.status(404).send("contact not found: " + err);
    });
});

/* POST new contact */
router.post("/", function (req, res, next) {
  contacts
    .doc()
    .set(req.body)
    .then((response) => {
      res.status(200).send("Added contact");
    })
    .catch((err) => {
      res.status(404).send("Couldn't add contact: " + err);
    });
});

/* UPDATE contact by ID*/
router.put("/:contact_id", function (req, res, next) {
  contacts
    .doc(req.params.contact_id)
    .update(req.body)
    .then((response) => {
      res.status(200).send("Updated contact: " + req.params.contact_id);
    })
    .catch((err) => {
      res.status(404).send("Couldn't update contact: " + err);
    });
});

/* DELETE contact by ID*/
router.delete("/:contact_id", async function (req, res, next) {
  contacts
    .doc(req.params.contact_id)
    .delete({ exists: true })
    .then((response) => {
      res.status(200).send("Deleted contact: " + req.params.contact_id);
    })
    .catch((err) => {
      res.status(404).send("Couldn't delete contact: " + err);
    });
});

module.exports = router;
