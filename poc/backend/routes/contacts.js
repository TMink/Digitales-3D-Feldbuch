const express = require("express");
const router = express.Router();
const db = require("../fb");
const projects = db.collection("projects");
const excavations = db.collection("excavations");
const contacts = db.collection("contacts");
var admin = require("firebase-admin");



/**
 * GET contacts by id-array in params seperated by ,
 */
router.get("/list/:contact_ids", function (req, res, next) {
  var contact_ids = req.params.contact_ids.split(",");
  var contactsArray = [];

  // get contacts from id_list
  contacts
    .where(admin.firestore.FieldPath.documentId(), "in", contact_ids)
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

/* POST new contact of a project */
router.post("/projects/:project_id", async function (req, res, next) {

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


/* POST new contact of an excavation*/
router.post("/excavations/:excavation_id", async function (req, res, next) {
  // check if excavation_id exists
  try {
    var excavation = await getExcavationById(req.params.excavation_id);
  } catch (error) {
    res.status(404).send("Couldn't find excavation with id: " + req.params.excavation_id);
  }

  // add new contact to DB
  try {
    var contact_id = await contacts.add(req.body);
  } catch (error) {
    res.status(404).send("Couldn't add contact");
  }

  // add new contact_id to the excavation list of contact ids
  var newExcavation = excavation;
  newExcavation.contacts.push(contact_id.id);

  // update excavation in DB
  try {
    var response = await updateExcavationById(req.params.excavation_id, newExcavation);
  } catch (error) {
    res.status(404).send("Couldn't update excavation");
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
router.delete("/projects/:project_id/:contact_id", async function (req, res, next) {
  // get project data
  var project = await getProjectById(req.params.project_id);

  // remove the excavation_id from project data
  var newProject = project;
  var index = newProject.contacts.indexOf(req.params.contact_id);
  newProject.contacts.splice(index, 1);

  // update project data with the removed excavation_id
  var response = await updateProjectById(req.params.project_id, newProject);

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


/* DELETE contact by ID*/
router.delete("/excavations/:excavation_id/:contact_id", async function (req, res, next) {
  // check if excavation_id exists
  try {
    var excavation = await getExcavationById(req.params.excavation_id);
  } catch (error) {
    res.status(404).send("Couldn't find excavation with id: " + req.params.excavation_id);
  }

  // remove the contact_id from excavation data
  var newExcavation = excavation;
  var index = newExcavation.contacts.indexOf(req.params.contact_id);
  newExcavation.contacts.splice(index, 1);

  // update project data with the removed excavation_id
  try {
    var response = await updateExcavationById(req.params.excavation_id, newExcavation);
  } catch (error) {
    res.status(404).send("Couldn't update the contacts of excavation")
  }
  
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


/**
 * Returns excavation data from DB by searching with the excavation ID
 * @param {String} excavation_id
 * @returns
 */
async function getExcavationById(excavation_id) {
  var excavation = await excavations.doc(excavation_id).get();

  return excavation.data();
}

/**
 * Returns excavation data from DB by searching with the excavation ID
 * @param {String} excavation_id
 * @returns
 */
async function updateExcavationById(excavation_id, newExcavation) {
  var response = await excavations.doc(excavation_id).update(newExcavation);

  return response;
}
module.exports = router;
