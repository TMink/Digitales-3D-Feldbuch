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
Further instructions for the backend can be found [here](https://github.com/TMink/Digitales-3D-Feldbuch-Projekt-3-/blob/main/src/backend/README.md)
