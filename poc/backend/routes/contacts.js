const express = require("express");
const router = express.Router();
const db = require("../fb");
const projects = db.collection("projects");
const contacts = db.collection("contacts");
var admin = require("firebase-admin");


/* GET ALL contacts */
router.get("/", function (req, res, next) {
  var contactsArray = [];
  contacts
    .get()
    .then((data) => {
      data.forEach((doc) => {
        var contact = getContactJson(doc);
        contactsArray.push(contact);
      });
      res.send(contactsArray);
    })
    .catch((err) => {
      res.status(404).send("No contacts found");
    });
});


/**
 * GET contacts by project_id
 */
router.get("/project_id/:project_id", async function (req, res, next) {
  //check if project_id exists
  try {
    var project = await getProjectById(req.params.project_id);
  } catch (error) {
    res.status(404).send("Couldn't find project with id: " + req.params.project_id);
  }

  // check if there are excavations in this project
  var contactsArray = [];
/*   if (project.excavations.length === 0) {
    res.status(404).send("No excavations in this project");
  } */

  // get excavations from DB
  contacts
    .where(admin.firestore.FieldPath.documentId(), "in", project.contacts)
    .get()
    .then((data) => {
      data.forEach((doc) => {
        var contact = getContactJson(doc);
        contactsArray.push(contact);
      });
      res.status(200).send(contactsArray);
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
        var contact = getContactJson(doc);
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
router.post("/:project_id", async function (req, res, next) {
  // check if project_id exists
  try {
    var project = await getProjectById(req.params.project_id);
  } catch (error) {
    res.status(404).send("Couldn't find project with id: " + req.params.project_id);
  }

  // add new contact to DB
  try {
    var contact_id = await contacts.add(req.body);
  } catch (error) {
    res.status(404).send("Couldn't add contact");
  }

  // add new contact_id to the project list of contact ids
  var newProject = project;
  newProject.contacts.push(contact_id.id);

  // update project in DB
  try {
    var response = await updateProjectById(req.params.project_id, newProject);
  } catch (error) {
    res.status(404).send("Couldn't update project");
  }

  res.status(200).send("Successfully added contact");
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


/**
 * Takes the retrieved data from DB and builds a JSON-object
 * with all fields for an excavation. Also creates empty fields,
 * when there is no data for them.
 *
 * @param {*} doc The raw excavation data from database
 * @returns excavation Json-Object with all required fields
 */
function getContactJson(doc) {
  return {
    id: doc.id,
    firstname: doc.data().firstname,
    surname: doc.data().surname,
    role: doc.data().role,
    mail: doc.data().mail,
    phone: doc.data().phone,
  };
}


/**
 * Returns project data from DB by searching with the project ID
 * @param {String} project_id
 * @returns
 */
async function getProjectById(project_id) {
  var project = await projects.doc(project_id).get();

  return project.data();
}


/**
 * Returns project data from DB by searching with the project ID
 * @param {String} project_id
 * @returns
 */
async function updateProjectById(project_id, newProject) {
  var response = await projects.doc(project_id).update(newProject);

  return response;
}
module.exports = router;
