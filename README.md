# Digitales-3D-Feldbuch-Projekt-3-

Weitere Details zur Arbeitsaufteilung und Projektplanung kann über [Notion](https://bitter-band-760.notion.site/4f0996c0a515416a870a5b91f591a53e?v=d16a0ff8bfbb4c30917c6f10b8cc1482) eingesehen werden


## Codedokumentation

Der Ordner `src/` beinhaltet das Front-, sowie das Backend des Digitalen 3D Feldbuches. Im Folgenden werden die relevanten Order und Dateien erläutert, um eine Übersicht über die Projektstruktur und des Codes zu bilden.


### Frontend 
(`src/frontend/..`)


Das Frontend des Stellenkartensystems ist derzeit mit dem Framework [Vue.js](https://vuejs.org/) implementiert. An dieser Stelle werden nur Ordner beschrieben, die relevante Dateien zum Codeverständnis beinhalten.

Der größte Anteil des eigentlichen Feldbuch-Codes befinden sich in `../frontend/src/views` und `../frontend/src/components`. Dort befinden sich entsprechend ganze Seitenansichten (z.B. Aktivitätenübersicht, 3D-Ansicht, o.ä.) oder Einzelkomponente, welche in mehrere Seitenansichten wiederverwendet werden können (z.B. Buttons, Dialoge, o.ä.).

Jede Vue.js Datei (Komponente) innerhalb dieser Ordner ist aufgebaut aus einem HTML-, einem JavaScript- und einem CSS-Teil. So steht jede Vue.js-Komponente für sich und kann einfach an anderen Stellen importiert und genutzt werden.


Weitere relevante Ordner werden hier Stichpunktartig aufgezählt und kurz erläutert.

  - `../src/locales`
    - englische und deutsche Übersetzungen
  - `../src/router`
    - Routing zu den einzelnen Seiten des Feldbuchs
  - `../src/plugins`
    - dark/light-Themes und die Initialisierung des Frontent-Framework [Vuetify](https://vuetifyjs.com/en/)
  - `../src/tests`
     - Unit-Tests


### Backend 
(`src/backend/..`)

Das Backend des digitalen 3D-Feldbuches ist mit dem node.js Framework [Express}(https://expressjs.com/) implementiert, welches mit einer MongoDB verbunden ist.

__

## Building and Packaging

`npm run build`

Builds and minifies the whole fieldbook frontend and saves it to `src/frontend/dist`

`npm run electron:start`

Starts the built project in Electrons simulated Chromium browser

`npm run package`

Packages the fieldbook project into an executable and/or installer
