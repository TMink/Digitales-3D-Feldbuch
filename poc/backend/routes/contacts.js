const express = require("express");
const router = express.Router();

const Project = require("../model/Project");
const Excavation = require("../model/Excavation");
const Contact = require("../model/Contact");


/**
 * Takes the retrieved data from DB and builds a JSON-object
 * with all fields for an contact. Also creates empty fields,
 * when there is no data for them.
 *
 * @param {*} doc The raw contact data from database
 * @returns contact Json-Object with all required fields
 */
function getContactJson(doc) {
  return {
    firstname: doc.firstname,
    surname: doc.surname,
    role: doc.role,
    mail: doc.mail,
    phone: doc.phone,
  };
}


/**
 * GET contacts by id-array in params separated by ,
 */
router.get("/list/:contact_ids", async function (req, res, next) {
  var contact_ids = req.params.contact_ids.split(",");

  try {
    var contactsArray = await Contact.find({ _id: contact_ids }).exec();
  } catch (error) {
    res.status(404).send("No excavations found");
  }

  res.status(200).send(contactsArray);
});


/* GET contact by ID */
router.get("/:contact_id", async function (req, res, next) {

  try {
    var contact = await Contact.findById(req.params.contact_id).exec();
  } catch (error) {
    res.status(404).send("No Contact with ID: " + req.params.contact_id + " found");
  }
  res.status(200).send(contact);
});


/* POST new contact of a project */
router.post("/projects/:project_id", async function (req, res, next) {
    var newContact = getContactJson(req.body);
    // create new contact in MongoDB
    try {
      var result = await Contact.create(newContact);
    } catch (error) {
      res.status(500).send("Couldn't create Project: " + error.message);
    }

    // get currently used project by id
    try {
      var project = await Project.findById(req.params.project_id).exec();
    } catch (error) {
      res.status(404).send("No project with ID: " + req.params.project_id + " found");
    }

    // add newly created contact id to this project
    project.contacts.push(result.id);

    // update the edited project in MongoDB
    try {
      var project = await Project.findByIdAndUpdate(req.params.project_id, project);
    } catch (error) {
      res.status(404).send("No project with ID: " + req.params.project_id + " found");
    }

    res.status(200).send("Successfully added contact");
});


/* POST new contact of an excavation*/
router.post("/excavations/:excavation_id", async function (req, res, next) {

  var newContact = getContactJson(req.body);
  // create new contact in MongoDB
  try {
    var result = await Contact.create(newContact);
  } catch (error) {
    res.status(500).send("Couldn't create Excavation: " + error.message);
  }

  // get currently used excavation by id
  try {
    var excavation = await Excavation.findById(req.params.excavation_id).exec();
  } catch (error) {
    res.status(404).send("No excavation with ID: " + req.params.excavation_id + " found");
  }

  // add newly created contact id to this excavation
  excavation.contacts.push(result.id);

  // update the edited excavation in MongoDB
  try {
    var excavation = await Excavation.findByIdAndUpdate(req.params.excavation_id, excavation);
  } catch (error) {
    res.status(404).send("No excavation with ID: " + req.params.excavation_id + " found");
  }

  res.status(200).send("Successfully added contact");
});


/* UPDATE contact by ID*/
router.put("/:contact_id", async function (req, res, next) {

  var updatedContact = getContactJson(req.body);

  try {
    const result = await Contact.findByIdAndUpdate(req.params.contact_id, updatedContact);

    res.status(200).send("Edited Contact: " + result);
  } catch (error) {
    res.status(500).send("Couldn't edit Contact: " + error.message);
  }
});


/* DELETE contact by ID*/
router.delete("/projects/:project_id/:contact_id", async function (req, res, next) {
  // delete contact from MongoDB by id
  try {
    const result = await Contact.findByIdAndDelete(req.params.contact_id);
  } catch (error) {
    res.status(500).send("Couldn't delete Contact: " + error.message);
  }

  // get project from MongoDB by id
  try {
    var project = await Project.findById(req.params.project_id).exec();
  } catch (error) {
    res.status(404).send("No project with ID: " + req.params.project_id + " found");
  }

  // remove the deleted contact id from this project
  const index = project.contacts.indexOf(req.params.contact_id);

  if (index > -1) {
    project.contacts.splice(index, 1);
  } else {
    res.status(400).send("The deleted contact is not part of the current project");
  }

  // update the edited project in MongoDB
  try {
    var project = await Project.findByIdAndUpdate(req.params.project_id, project);
  } catch (error) {
    res.status(404).send("No project with ID: " + req.params.project_id + " found");
  }

  res.status(200).send("Successfully deleted contact");
});


/* DELETE contact by ID*/
router.delete("/excavations/:excavation_id/:contact_id", async function (req, res, next) {
  // delete contact from MongoDB by id
  try {
    const result = await Contact.findByIdAndDelete(req.params.contact_id);
  } catch (error) {
    res.status(500).send("Couldn't delete Contact: " + error.message);
  }

  // get excavation from MongoDB by id
  try {
    var excavation = await Excavation.findById(req.params.excavation_id).exec();
  } catch (error) {
    res.status(404).send("No excavation with ID: " + req.params.excavation_id + " found");
  }

  // remove the deleted contact id from this excavation
  const index = excavation.contacts.indexOf(req.params.contact_id);

  if (index > -1) {
    excavation.contacts.splice(index, 1);
  } else {
    res.status(400).send("The deleted contact is not part of the current excavation");
  }

  // update the edited excavation in MongoDB
  try {
    var excavation = await Excavation.findByIdAndUpdate(req.params.excavation_id, excavation);
  } catch (error) {
    res.status(404).send("No excavation with ID: " + req.params.excavation_id + " found");
  }

  res.status(200).send("Successfully deleted contact");
});

module.exports = router;
