# Digitales-3D-Feldbuch-Projekt-3-

Weitere Details zur Arbeitsaufteilung und Projektplanung kann über [Notion](https://bitter-band-760.notion.site/4f0996c0a515416a870a5b91f591a53e?v=d16a0ff8bfbb4c30917c6f10b8cc1482) eingesehen werden


## Codedokumentation

- Ordner poc/ beinhaltet das Backend, das alte Frontend  (altes Dokumentationssystem) und das neue Frontend (Stellenkartensystem)

### Stellenkartensystem Frontend 
(`poc/fieldbook_client/`)



Das Frontend des Stellenkartensystems ist derzeit mit dem Framework [Vue.js](https://vuejs.org/) implementiert.
  - `poc/fieldbook_client/assets`
    - Grafiken
  - `poc/fieldbook_client/views`
    - ganze Seitenansichten  
  - `poc/fieldbook_client/components`
    - einzelne, wiederverwendbare Komponenten zur Nutzung innerhalb von `views` (z.B. einzelne Buttons, Dialoge etc.)
   
  - `poc/fieldbook_client/locales`
    - englische und deutsche Übersetzungen
  - `poc/fieldbook_client/plugins`
    - beinhaltes dark/ light-Themes und das Frontent-Framework Vuetify
  - `poc/fieldbook_client/router`
    - Routing zu den einzelnen Seiten des Feldbuchs
  - `poc/fieldbook_client/tests`
     - Unit-Tests

