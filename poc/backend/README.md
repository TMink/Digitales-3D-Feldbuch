
# Backend Server

> Backend server of the archeological 3D-Fieldbook with express.js

## Requirements

### Downloads 
 1. Follow the installation guide of [CouchDB](https://docs.couchdb.org/en/stable/install/windows.html#installation-on-windows)
 2. Open [Fauxton](http://localhost:5984/_utils) to check and edit the CouchDB

___
#### Database 1: projects

 1. Create new Database named "projects"
 2. Create new Doc inside "projects" with additional fields "name" and "description":


<details>
<summary>**Example Values:**</summary>
<pre>
"name": "Testprojekt",
"description": "Dies ist ein Testobjekt, um die DB mit Daten zu füllen"
</pre>
</details>

___
#### Database 2: excavations

 1. Create new Database named "excavations"
 2.  Create new Doc inside "excavations" with additional fields "name", "description", "organization", "client", "location", "length", "focus":
<details>
<summary>**Example Values:**</summary>
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
