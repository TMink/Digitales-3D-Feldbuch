import VueCookies from 'vue-cookies'

var path = '127.0.0.1:5984'
var PouchDB = require('pouchdb-browser').default
var campaignsdb = new PouchDB('campaigns_database')
var campaignsremoteDB
var excavationsdb = new PouchDB('excavations_database')
var excavationsremoteDB
var sectionsdb = new PouchDB('sections_database')
var sectionsremoteDB
var structuresdb = new PouchDB('structures_database')
var structuresremoteDB
var findsdb = new PouchDB('finds_database')
var findsremoteDB
var samplesdb = new PouchDB('samples_database')
var samplesremoteDB

function initializedatabases() {
  var newpath = VueCookies.get('path')
  //console.log(newpath)
  if (newpath !== null) {
    path = newpath
    campaignsremoteDB = new PouchDB(path + '/campaigns')
    excavationsremoteDB = new PouchDB(path + '/excavations')
    sectionsremoteDB = new PouchDB(path + '/sections')
    structuresremoteDB = new PouchDB(path + '/structures')
    findsremoteDB = new PouchDB(path + '/finds')
    samplesremoteDB = new PouchDB(path + '/samples')
    //syncall()
  }
}

function syncall() {
  sync(campaignsdb, campaignsremoteDB)
  sync(excavationsdb, excavationsremoteDB)
  sync(sectionsdb, sectionsremoteDB)
  sync(structuresdb, structuresremoteDB)
  sync(findsdb, findsremoteDB)
  sync(samplesdb, samplesremoteDB)
}

function setpath(newpath) {
  VueCookies.set('path',newpath)
  path = newpath
  campaignsremoteDB = new PouchDB(path + '/campaigns')
  excavationsremoteDB = new PouchDB(path + '/excavations')
  sectionsremoteDB = new PouchDB(path + '/sections')
  structuresremoteDB = new PouchDB(path + '/structures')
  findsremoteDB = new PouchDB(path + '/finds')
  samplesremoteDB = new PouchDB(path + '/samples')
  //syncall()
}

function sync(db, remotedb) {
  db.sync(remotedb, {
    live: true,
    retry: true
  }).on('change', function (change) {
  }).on('paused', function (info) {
  }).on('active', function (info) {
  }).on('error', function (err) {
    console.log(err)
  })
}


export { excavationsdb, sectionsdb, campaignsdb, findsdb, structuresdb, samplesdb, initializedatabases, setpath}

