
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
