<p align="center">
  <a href="https://github.com/TMink/Digitales-3D-Feldbuch/releases/latest" alt="Version">
      <img src="https://img.shields.io/github/package-json/v/TMink/Digitales-3D-Feldbuch?filename=src%2Ffrontend%2Fpackage.json" /></a>
  <a href="https://github.com/TMink/Digitales-3D-Feldbuch/graphs/contributors" alt="Contributors">
      <img src="https://img.shields.io/github/contributors/TMink/Digitales-3D-Feldbuch" /></a>
  <a alt="Downloads">
      <img src="https://img.shields.io/github/downloads/TMink/Digitales-3D-Feldbuch/total" /></a>
  <a alt="Closed Issues">
      <img src="https://img.shields.io/github/issues-closed/TMink/Digitales-3D-Feldbuch" /></a>
  <a alt="Licence">
      <img src="https://img.shields.io/github/license/TMink/Digitales-3D-Feldbuch"/></a>
</p>

        
# Digital 3D Fieldbook

This project is the Digital 3D-Fieldbook, which is intended to enable the digital documentation of archaeological excavations. The system was developed in collaboration with the archaeological institute at the University of Cologne.

![1_E0-qLJQ8-27JInLfbQUILGbGsItqH9cxOKy0EoYHgdbDs42sZbQSsg0yCfxGw](https://github.com/TMink/Digitales-3D-Feldbuch-Projekt-3-/assets/15029310/6c346cf9-7834-44d9-b4d0-6d29d6aa6307)



## Getting Started

### Installing for Offline Usage

The easiest way to get the fieldbook is to use the latest release. Though this release currently only works offline, so there is no online backup functionality.

1. Download the latest [Release](https://github.com/TMink/Digitales-3D-Feldbuch-Projekt-3-/releases).
2. Extract the downloaded files
3. Launch the `fieldbook-client.exe`

___

### Installing for Development Usage

These instructions will get you a copy of the fieldbook up and running on your local machine for development and testing purposes.

1. Clone the repository
2. Within a console of your choice, navigate to `src/frontend`
3. Run `npm install` (if you get an error, try to run `npm install --force`
4. Run `npm run dev`
5. Within a console of your choice, navigate to `src/backend`
6. Run `npm install` (if you get an error, try to run `npm install --force`
7. Run `npm run dev`
8. Download and install MongoDB and configure it as a Windows Service (you can follow [this](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/) tutorial)
9. The Fieldbook should now be accessible through any browser under `http://localhost:5173/`



## Deployment (Building and Packaging)
```
npm run build
```
Builds and minifies the whole fieldbook frontend and saves it to `src/frontend/dist`

```
npm run electron:start
```
Starts the building project in Electrons simulated Chromium browser

```
npm run package
```
Packages the fieldbook project into an executable

```
npm run make
```
Creates an installer (Squirrel and .msi on win) for the fieldbook

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


## Authors

Click [here](https://github.com/TMink/Digitales-3D-Feldbuch-Projekt-3-/graphs/contributors) to see the list of contributors who participated in this project.

## License
This project is licensed under the MIT license - see the LICENSE.md file for details

## Acknowledgments

- Thanks to the [Archäological Institute at the University of Cologne](https://archaeologie.phil-fak.uni-koeln.de/) for the valuable [evaluation and testing](https://archaeologie.phil-fak.uni-koeln.de/forschung/aktuelle-forschungen/detail-fa/eine-erste-kampagne-der-deutsch-niederlaendischen-lehrgrabung-auf-insula-29-der-colonia-ulpia-traiana-cut-1#news3631) during a month long excavation in Xanten, Germany
- Also a big thanks to the [Archeological Park Xanten](https://apx.lvr.de/de/willkommen/willkommen_1.html) for letting us test out the system during this excavation
- And thanks to [Prof. Dr. Horst Stenzel](https://www.th-koeln.de/personen/horst.stenzel/) for the supervision and support during the whole project
