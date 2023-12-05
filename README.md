# Digital 3D Fieldbook

This project is the digital 3D field book, which is intended to enable the digital documentation of archaeological excavations. The system was developed in collaboration with the archaeological institute at the University of Cologne.

## Building and Packaging

`npm run build`

Builds and minifies the whole fieldbook frontend and saves it to `src/frontend/dist`

`npm run electron:start`

Starts the built project in Electrons simulated Chromium browser

`npm run package`

Packages the fieldbook project into an executable and/or installer

## Authors

Click [here](https://github.com/TMink/Digitales-3D-Feldbuch-Projekt-3-/graphs/contributors) to see the list of contributors who participated in this project.


## Codedocumentation
The `src/` folder contains the front- and backend of the digital 3D field book. The relevant folders and files are explained below to provide an overview of the project structure and code.


### Frontend 
(`src/frontend/..`)

The frontend of the "Stellenkartensystem" is currently implemented with the [Vue.js](https://vuejs.org/) framework. Only folders that contain relevant files for code understanding are described here.

The majority of the actual fieldbook code is located in `../frontend/src/views` and `../frontend/src/components`. There are entire page views (e.g. activityOverview, 3DView, etc.) or individual components that can be reused in several page views (e.g. buttons, dialogs, etc.).

Each Vue.js file (component) within these folders is made up of an HTML, a JavaScript and a CSS part. This means that each Vue.js component stands alone and can easily be imported and used elsewhere.


Other relevant folders are listed here in bullet points and briefly explained.

  - `../src/locales`
    - english and german translations
  - `../src/router`
    - Routing to the individual pages of the field book
  - `../src/plugins`
    - dark/light themes and the initialization of the Frontent framework [Vuetify](https://vuetifyjs.com/en/)
  - `../src/tests`
     - Unit-tests

### Backend 
(`src/backend/..`)

The backend of the digital 3D field book is implemented with the node.js framework [Express](https://expressjs.com/), which is connected to a MongoDB.

# Backend Server

> Backend server of the archeological 3D-Fieldbook with express.js

## Requirements

### CouchDB Setup 
 1. Follow the installation guide of [CouchDB](https://docs.couchdb.org/en/stable/install/windows.html#installation-on-windows)
 2. Open [Fauxton](http://localhost:5984/_utils) to check and edit the CouchDB
 3. Create User "admin" with pw "1234"
___
#### Database 1: projects

 4. Create new Database named "projects"
 5. Create new Doc inside "projects" with additional fields "name" and "description":
<details>
<summary>Example Values:</summary>
<pre>
"name": "Testprojekt",
"description": "Dies ist ein Testobjekt, um die DB mit Daten zu füllen"
</pre>
</details>

 6. Create new View inside "projects" with Design Document name "projects" and Index name "all":
 <details>
<summary>Example Values:</summary>
<pre>
 function (doc) {
  emit(doc._id, {name: doc.name,
        description: doc.description
  });
}
</pre>
</details>
 


___
#### Database 2: excavations

 7. Create new Database named "excavations"
 8.  Create new Doc inside "excavations" with additional fields "name", "description", "organization", "client", "location", "length", "focus":
<details>
<summary>Example Values:</summary>
<pre>
"name": "Xanten",
"description": "Dies ist die Ausgrabung in Xanten",
"organization": "Archeologischen Institut Koeln",
"client": "Technologische Hochschule Koeln",
"location": "Xanten, Deutschland",
"length": "20 Tage",
"focus": "Interessante Funde"
</pre>
</details>

 9. Create new View inside "excavations" with Design Document name "excavations" and Index name "all":
<details>
<summary>Example Values:</summary>
<pre>
function (doc) {
  emit(doc._id, {name: doc.name, 
                  date: doc.date, 
                  description: doc.description, 
                  organization: doc.organization, 
                  client: doc.client, 
                  location: doc.location,
                  length: doc.length,
                  focus: doc.focus
  });
}
</pre>
</details>

___

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:3000
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

