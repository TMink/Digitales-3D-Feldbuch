/*
 * Created Date: 03.06.2023 10:25:57
 * Author: Tobias Mink
 * 
 * Last Modified: 05.11.2024 13:49:50
 * Modified By: Julian Hardtung
 * 
 * Description: Helper API for manipulating the IndexedDB
 */


/**
 * Function overview:
 *  syncLocalDBs            - Updates/Creates databases in IndexedDB and gets
 *                            the transaction data for communtcation.
 *  getDB                   - Gets the current state of the database, or creates
 *                            a new database and object store
 *  getObject               - Gets an specific object trough id
 *  getAllObjects           - Gets all objects of a specific store
 *  getProperties           - Gets the values of specific properties of all
 *                            objects in a specific store
 *  getPropertiesWithID     - Gets the values of specific properties of all
 *                            objects in a specific store, which contain the
 *                            same id (activityID or placeID)
 *  getAllObjectsWithID     - Gets the data of all objects, which contain the
 *                            same id (activityID or placeID)
 *  getAllUpdatedObjects    - Gets all objects that have been updated since 
 *                            last time
 *  addObject               - Adds object to a specific object store
 *  deleteObject            - Deletes an object from a specific object store
 *  deleteAllObjects        - Deletes all objects from a specific object store
 *  deleteCascadePositions  - Deletes all positions, which belong to a specific
 *                            place
 */
export { fromOfflineDB };
import isOnline from "is-online";
import { fromBackend } from "./ConnectionToBackend.js";
import { useUserStore } from "./Authentication.js";
import { generalDataStore } from "./ConnectionToLocalStorage.js";

export default class ConnectionToOfflineDB {
  constructor(offlineDB) {
    this.offlineDB = offlineDB;
    this.localDB = [];
  }

  async syncLocalDBs() {
    var countDooku = this.offlineDB.length - 1;

    while (countDooku >= 0) {
      this.localDB[countDooku] = await this.getDB(
        this.offlineDB[countDooku].name,
        this.offlineDB[countDooku].version,
        this.offlineDB[countDooku].storeNames
      ).catch((err) => console.error(err));

      countDooku -= 1;
    }
  }

  /**
   * @param {String} dbName
   *    Database Name
   * @param {Int} dbVersion
   *    Database Version
   * @param {String} storeName
   *    Object store name
   * @returns
   *    the current state of the database, as Promise, or creates a new database
   *    + object store.
   */
  async getDB(dbName, dbVersion, storeNames) {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(dbName, dbVersion);

      request.onerror = (e) => {
        console.error("Error opening db", e);
        reject("Error");
      };

      request.onsuccess = (e) => {
        resolve(e.target.result);
      };

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        storeNames.forEach((storeName) => {
          const store = db.createObjectStore(storeName, { keyPath: "_id" });
          store.createIndex("lastChangedIDX", "lastChanged", { unique: false });
        });
      };
    });
  }

  /**
   * Counts all entries in a IndexedDB store and returns the value
   * @param {String} localDBName
   * @param {String} storeName
   * @returns the counted value of all entries
   */
  async getStoreCount(localDBName, storeName) {
    const localDB = this.getLocalDBFromName(localDBName);

    return new Promise((resolve, _reject) => {
      const trans = localDB.transaction([storeName], "readonly");
      const store = trans.objectStore(storeName);
      const countRequest = store.count();

      countRequest.onsuccess = () => {
        resolve(countRequest.result);
      };
    });
  }

  /**
   * @param {String} _id
   *    Key for identifying the value which will be deleted
   * @param {String} localDBname
   *    Database object, which contains the object store
   * @param {String} storeName
   *    Object store name
   * @returns
   *    an object, as Promise.
   */
  async getObject(_id, localDBName, storeName) {
    const localDB = this.getLocalDBFromName(localDBName);

    return new Promise((resolve, _reject) => {
      const trans = localDB.transaction([storeName], "readonly");
      trans.oncomplete = (_e) => {
        resolve(data.result);
      };

      const store = trans.objectStore(storeName);
      let data = store.get(_id);
    });
  }

  /**
   * @param {String} index
   *    Index of the object in the IndexedDB
   * @param {String} localDBname
   *    Database object, which contains the object store
   * @param {String} storeName
   *    Object store name
   * @returns
   *    an object, as Promise.
   */
  async getObjectByIndex(index, localDBName, storeName) {
    const localDB = this.getLocalDBFromName(localDBName);

    return new Promise((resolve, _reject) => {
      const trans = localDB.transaction([storeName], "readonly");
      const store = trans.objectStore(storeName);

      var cursorIndex = 0;
      store.openCursor().onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor) {
          if (cursorIndex < index) {
            cursorIndex++;
            cursor.continue();
          } else {
            resolve(cursor.value);
          }
        }
      };
    });
  }

  /**
   * Gets the first entry of the specified localDBName and storeName
   *
   * @param {String} localDBName
   * @param {String} storeName
   * @returns the first entry of the specified localDB + store
   */
  async getFirstEntry(localDBName, storeName) {
    const localDB = this.getLocalDBFromName(localDBName);

    return new Promise((resolve, _reject) => {
      const trans = localDB.transaction([storeName], "readonly");
      const store = trans.objectStore(storeName);

      store.openCursor().onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor) {
          resolve(cursor.value);
        }
      };
    });
  }

  /**
   * @param {String} localDBName
   *    Database name
   * @param {String} storeName
   *    Object store name
   * @returns
   *    an array of objects, as Promise.
   */
  async getAllObjects(localDBName, storeName) {
    const localDB = this.getLocalDBFromName(localDBName);

    return new Promise((resolve, _reject) => {
      const trans = localDB.transaction([storeName], "readonly");
      trans.oncomplete = (_e) => {
        resolve(data);
      };

      const store = trans.objectStore(storeName);
      let data = [];

      store.openCursor().onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor) {
          data.push(cursor.value);
          cursor.continue();
        }
      };
    });
  }

  /**
   * @param {String} localDBName
   *    Database name
   * @param {String} storeName
   *    Object Store name
   * @returns
   *    the value of an specific property, of all objects in store,
   *    as Promise.
   */
  async getProperties(property, localDBName, storeName) {
    const localDB = this.getLocalDBFromName(localDBName);

    return new Promise((resolve, _reject) => {
      const trans = localDB.transaction([storeName], "readonly");
      trans.oncomplete = (_e) => {
        resolve(data);
      };

      const store = trans.objectStore(storeName);
      let data = [];

      store.openCursor().onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor) {
          switch (property) {
            case "_id":
              data.push(cursor.value._id);
              break;
            case "placeNumber":
              data.push(cursor.value.placeNumber);
              break;
            default:
              console.error("Entries do not contain the propertie: '" + property + "'");
          }
          cursor.continue();
        }
      };
    });
  }

  /**
   * @param {String} localDBName
   *    Database name
   * @param {String} storeName
   *    Object Store name
   * @returns
   *    the value of an specific property, dependent on a given id, of all
   *    objects in store, as Promise.
   */
  async getPropertiesWithID(_id, selection, property, localDBName, storeName) {
    const localDB = this.getLocalDBFromName(localDBName);

    return new Promise((resolve, _reject) => {
      const trans = localDB.transaction([storeName], "readonly");
      trans.oncomplete = (_e) => {
        resolve(data);
      };

      const store = trans.objectStore(storeName);
      let data = [];

      store.openCursor().onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor) {
          let conv = false;

          switch (selection) {
            case "ofID":
              if (cursor.value._id === _id) {
                conv = true;
              }
              break;
            case "place":
              if (cursor.value.activityID === _id) {
                conv = true;
              }
              break;
            case "position":
              if (cursor.value.placeID === _id) {
                conv = true;
              }
              break;
            default:
              console.error("Error");
          }

          if (conv === true) {
            switch (property) {
              case "_id":
                data.push(cursor.value._id);
                break;
              case "places":
                data.push(...cursor.value.places);
                break;
              case "positions":
                data.push(cursor.value.positions);
                break;
              case "models":
                data.push(...cursor.value.models);
                break;
              case "placeNumber":
                data.push(cursor.value.placeNumber);
                break;
              default:
                console.error("Entries do not contain the propertie: '" + property + "'");
            }
          }

          cursor.continue();
        }
      };
    });
  }

  /**
   * @param {String} _id
   *    ID of the currently selected object
   * @param {String} selection
   *    Selection of which object the _id is from
   * @param {String} localDBName
   *    Database name
   * @param {String} storeName
   *    IndexedDB store name
   * @returns
   *    an array containing objects with same _id
   *    (activityID, placeID, positionsID) as Promise.
   */
  async getAllObjectsWithID(_id, selection, localDBName, storeName) {
    const localDB = this.getLocalDBFromName(localDBName);

    return new Promise((resolve, _reject) => {
      const trans = localDB.transaction([storeName], "readonly");
      trans.oncomplete = (_e) => {
        resolve(data);
      };

      const store = trans.objectStore(storeName);
      let data = [];

      store.openCursor().onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor) {
          switch (selection) {
            case "Activity":
              if (cursor.value.activityID === _id) {
                data.push(cursor.value);
              }
              break;
            case "Place":
              if (cursor.value.placeID === _id) {
                data.push(cursor.value);
              }
              break;
            case "Position":
              if (cursor.value.positionID === _id) {
                data.push(cursor.value);
              }
              break;
            case "Camera":
              if (cursor.value.activityID === _id) {
                data.push(cursor.value);
              }
              break;
          }

          cursor.continue();
        }
      };
    });
  }

  /**
   * Return an array of objects from IndexedDB from an array of ObjectIDs
   * @param {*} idArray
   * @param {*} localDBName
   * @param {*} storeName
   * @returns {[*]} Objects from IndexedDB
   */
  async getAllObjectsFromArray(idArray, localDBName, storeName) {
    const localDB = this.getLocalDBFromName(localDBName);

    return new Promise((resolve, _reject) => {
      const trans = localDB.transaction([storeName], "readonly");
      trans.oncomplete = (_e) => {
        resolve(data);
      };

      const store = trans.objectStore(storeName);
      let data = [];

      idArray.forEach(function (key) {
        store.get(key).onsuccess = function (e) {
          data.push(e.target.result);
          if (data.length === idArray.length) {
            //console.log(data);
          }
        };
      });
    });
  }

  /**
   * Returns all Objects within the `localDBName` and `storeName`
   * that had changes made after last Sync with OnlineDB
   * @param {String} localDBName
   * @param {String} storeName
   */
  async getAllUpdatedObjects(localDBName, storeName) {
    const localDB = this.getLocalDBFromName(localDBName);

    return new Promise((resolve, _reject) => {
      const trans = localDB.transaction(storeName, "readonly");
      trans.oncomplete = (_e) => {
        resolve(data);
      };

      const store = trans.objectStore(storeName);
      let data = [];

      store.openCursor().onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor) {
          if (
            cursor.value.lastSync < cursor.value.lastChanged ||
            cursor.value.lastSync == undefined
          ) {
            data.push(cursor.value);
          }

          cursor.continue();
        }
      };
    });
  }

  /**
   *
   * @param {String} localDBName
   * @param {String} storeName
   * @returns the object that was added last to the IndexedDB
   */
  async getLastAddedPosition() {
    const generalStore = generalDataStore();
    var curPlaceID = generalStore.getCurrentObject("place");
    var curPlace = await this.getObject(curPlaceID, "Places", "places")
      .catch((err) => console.error(err));
    var lastPosID = curPlace.positions[curPlace.positions.length - 1];
    var lastAddedPos = await this.getObject(lastPosID, "Positions", "positions")
      .catch((err) => console.error(err));

    return lastAddedPos.positionNumber;
  }

  /**
   *
   * @param {String} localDBName
   * @param {String} storeName
   * @returns the object that was added directly before the inputID
   */
  async getObjectBefore(inputID, localDBName, storeName) {
    const localDB = this.getLocalDBFromName(localDBName);

    return new Promise((resolve, _reject) => {
      const trans = localDB.transaction(storeName, "readonly");
      const store = trans.objectStore(storeName);

      trans.oncomplete = (_e) => {
        resolve(lastAddedObj);
      };

      var lastAddedObj;
      store.openCursor().onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor.value._id != inputID) {
          lastAddedObj = cursor.value;
          cursor.continue();
        }
      };
    });
  }

  /**
   * Adds an Object to IndexedDB and post to backend
   * @param {Object} data
   *    Data to be added to Object Store
   * @param {String} localDBName
   *    Database name
   * @param {String} storeName
   *    Store name
   */
  async addObject(data, localDBName, storeName) {
    const userStore = useUserStore();

    //if logged in, online, and not synced yet, sync new object to backend
    if (userStore.authenticated && (await isOnline()) && data.lastSync < data.lastChanged) {
      if (localDBName == "Images" || localDBName == "Models") {
        data = await fromBackend
          .uploadFormData(data, "post", storeName)
          .catch((err) => console.error(err));
      } else {
        data = await fromBackend.postData(storeName, data)
          .catch((err) => console.error(err));
      }
    }

    var res = await this.updateIndexedDBObject(data, localDBName, storeName)
      .catch((err) => console.error(err));
      
    return res;
  }

  /**
   * Updates an object from IndexedDB
   * and uploads changes to backend (if logged in and online)
   * @param {Int} data
   *    Data object, which will be updated
   * @param {String} localDBName
   *    Database name
   * @param {String} storeName
   *    Object store name
   */
  async updateObject(data, localDBName, storeName) {
    const userStore = useUserStore();

    //if logged in and online, sync new object to backend
    if (userStore.authenticated && (await isOnline()) && data.lastChanged > data.lastSync) {
      data = await fromBackend.uploadObject(storeName, data)
      .catch((err) => console.error(err));
    }
    await this.updateIndexedDBObject(data, localDBName, storeName)
    .catch((err) => console.error(err));
  }

  /**
   * Temporary function for only updating an object without uploading it to backend
   * @param {Object} data
   * @param {String} localDBName
   * @returns
   */
  async updateIndexedDBObject(data, localDBName, storeName) {
    var localDB = this.getLocalDBFromName(localDBName);

    return new Promise((resolve, _reject) => {
      const trans = localDB.transaction([storeName], "readwrite");
      trans.oncomplete = (_e) => {
        resolve(data._id);
      };

      trans.onerror = (_e) => {
        console.error(_e);
      };
      const store = trans.objectStore(storeName);
      store.put(data);
    });
  }

  /**
   * Post all subsequent data ob an object to the backend
   * @param {String} subdomain
   * @param {Object} data
   */
  async postObjectCascade(subdomain, data) {
    // upload data
    var uploadedData = await fromBackend
      .uploadObject(subdomain, data)
      .catch((err) => console.error(err));

    var localDBName = subdomain.charAt(0).toUpperCase() + subdomain.slice(1);
    // update indexedDB
    await this.updateIndexedDBObject(uploadedData, localDBName, subdomain)
      .catch((err) => console.error(err));

    // check which cascading data has to be uploaded next
    switch (subdomain) {
      //upload data that is within a position (places)
      case "activities":
        if (data.places) {
          for (const place_id of data.places) {
            var curPlace = await fromOfflineDB
              .getObject(place_id, "Places", "places")
              .catch((err) => console.error(err));

            await this.postObjectCascade("places", curPlace)
              .catch((err) => console.error(err));
          }
        }
        break;

      //upload data that is within a place (positions)
      case "places":
        if (data.positions) {
          for (const position_id of data.positions) {
            var curPosition = await fromOfflineDB
              .getObject(position_id, "Positions", "positions")
              .catch((err) => console.error(err));

            await this.postObjectCascade("positions", curPosition)
              .catch((err) => console.error(err));
          }
        }
        break;

      //upload data that is within a position (images, models)
      case "positions":
        if (data.images) {
          for (const image_id of data.images) {
            var curImage = await fromOfflineDB
              .getObject(image_id, "Images", "images")
              .catch((err) => console.error(err));

            if (curImage.lastSync == 0) {
              var uploadedImage = await fromBackend
                .uploadFormData(curImage, "post", "images")
                .catch((err) => console.error(err));

              await this.updateIndexedDBObject(uploadedImage, "Images", "images")
                .catch((err) => console.error(err));
            }
          }
        }
        if (data.models) {
          for (const model_id of data.models) {
            var curModel = await fromOfflineDB
              .getObject(model_id, "Models", "positions")
              .catch((err) => console.error(err));

            var uploadedModel = await fromBackend
              .uploadFormData(curModel, "post", "models")
              .catch((err) => console.error(err));

            uploadedModel.model = curModel.model;
            uploadedModel.texture = curModel.texture;

            await this.updateIndexedDBObject(uploadedModel, "Models", "positions")
              .catch((err) => console.error(err));
          }
        }
        break;
      default:
        console.error(subdomain + " is not a vaid subdomain");
    }
  }

  /**
   * Deletes an object from IndexedDB
   * @param {String} object
   *    The object, which will be deleted
   * @param {String} localDBName
   *    Database name
   * @param {String} storeName
   *    Object store name
   */
  async deleteObject(object, localDBName, storeName) {
    var localDB = this.getLocalDBFromName(localDBName);
    const userStore = useUserStore();

    //if logged in and online, sync new object to backend
    if (userStore.authenticated && (await isOnline()) && storeName != "created") {
      await fromBackend.deleteData(storeName, object._id)
        .catch((err) => console.error(err));

      if (storeName == "activities") {
        var index = userStore.user.activities.indexOf(object._id);
        if (index != -1) {
          userStore.user.activities.splice(index, 1);
          userStore.updateUser();
        }
      }
    }

    return new Promise((resolve, _reject) => {
      const trans = localDB.transaction([storeName], "readwrite");
      trans.oncomplete = (_e) => {
        resolve();
      };

      const store = trans.objectStore(storeName);
      store.delete(object._id);
    });
  }

  /**
   * Delete all objects within IndexedDB `localDBName` -> `storeName`
   * @param {String} localDBName
   *    Database name
   * @param {*} storeName
   *    Object store name
   */
  async deleteAllObjects(localDBName, storeName) {
    var localDB = this.getLocalDBFromName(localDBName);

    const trans = localDB.transaction([storeName], "readwrite");

    const store = trans.objectStore(storeName);

    const storeRequest = store.clear();
    storeRequest.onsuccess = (_e) => {};
  }

  /**
   *
   * @param {String} _id
   *    ID of the currently selected place
   * @param {String} selection
   *    name of the object (activity, place, position)
   * @param {String} localDBName
   *    Database name
   * @param {String} storeName
   *    Store name
   */
  async deleteCascade(_id, selection, localDBName, storeName) {
    const localDB = this.getLocalDBFromName(localDBName);
    const context = this;
    var object = await this.getObject(_id.toString(), localDBName, storeName)
      .catch((err) => console.error(err));

    await new Promise(async function (resolve, _reject) {
      const trans = localDB.transaction(storeName, "readwrite");
      trans.oncomplete = (_e) => {
        resolve();
      };

      switch (selection) {
        case "activity":
          if (object.places.length > 0) {
            for (var i = 0; i < object.places.length; i++) {
              await context
                .deleteCascade(object.places[i], "place", "Places", "places")
                .catch((err) => console.error(err));
            }
          }
          break;

        case "place":
          /* Delete all attached positions and their params */
          if (object.positions.length > 0) {
            for (var j = 0; j < object.positions.length; j++) {
              await context
                .deleteCascade(object.positions[j], "position", "Positions", "positions")
                .catch((err) => console.error(err));
            }
          }
          /* Delete all attached coordinates */
          if (object.coordinates != "") {
            var placeCoords = await context
              .getObject(object.coordinates, "Coordinates", "coordinates")
              .catch((err) => console.error(err));

            await fromOfflineDB
              .deleteObject(placeCoords, "Coordinates", "coordinates")
              .catch((err) => console.error(err));
          }
          /* Delete all attached models */
          if (object.models.length != 0) {
            for (var k = 0; k < object.models.length; k++) {
              var model = await context
                .getObject(object.models[k], "Models", "places")
                .catch((err) => console.error(err));

              await fromOfflineDB
                .deleteObject(model, "Models", "places")
                .catch((err) => console.error(err));
            }
          }
          /* Delete all attached lines */
          if (object.lines.length != 0) {
            for (var l = 0; l < object.lines.length; l++) {
              var line = await context
                .getObject(object.lines[l], "Lines", "lines")
                .catch((err) => console.error(err));

              await fromOfflineDB
                .deleteObject(line, "Lines", "lines")
                .catch((err) => console.error(err));
            }
          }

          /* Delete all attached annotations */
          if (object.annotations.length != 0) {
            for (var m = 0; m < object.annotations.length; m++) {
              var annotation = await context
                .getObject(object.annotations[m], "Annotations", "annotations")
                .catch((err) => console.error(err));

              await fromOfflineDB
                .deleteObject(annotation, "Annotations", "annotations")
                .catch((err) => console.error(err));
            }
          }
          break;

        case "position":
          /* Delete all attached coordinates */
          if (object.coordinates != null && object.coordinates != "" ) {
            var posCoords = await context
              .getObject(object.coordinates, "Coordinates", "coordinates")
              .catch((err) => console.error(err));

            await fromOfflineDB
              .deleteObject(posCoords, "Coordinates", "coordinates")
              .catch((err) => console.error(err));
          }
          /* Delete all attached images */
          /* if (object.image.length != 0) {
              var image = await context
                .getObject(object.image.toString(), "Images", "images")
                .catch((err) => console.error(err));

              await fromOfflineDB
                .deleteObject(image, "Images", "images")
                .catch((err) => console.error(err));
            }
          } */
          /* Delete all attached models */
          /* if (object.models.length != 0) {
            for (var o = 0; o < object.models.length; o++) {
              var modelPos = await context
                .getObject(object.models[o].toString(), "Models", "positions")
                .catch((err) => console.error(err));

              await fromOfflineDB
                .deleteObject(modelPos, "Models", "positions")
                .catch((err) => console.error(err));
            }
          } */
          break;

        default:
          console.error("Error");
      }

      await fromOfflineDB
        .deleteObject(object, localDBName, storeName)
        .catch((err) => console.error(err));
    });
  }

  /**
   * @param {String} localDBName
   *    Database name
   * @returns
   *    the localDB for transaction
   */
  getLocalDBFromName(localDBName) {
    for (var i = 0; i < this.localDB.length; i++) {
      if (this.localDB[i].name == localDBName) {
        return this.localDB[i];
      }
    }
  }
}


/**
 * Create/Change new databases in IndexedDB (offline database)
 */

const offlineDBModels = {
  name: "Models",
  version: 1,
  storeNames: ["places", "positions"],
};

const offlineDBActivities = {
  name: "Activities",
  version: 1,
  storeNames: ["activities"],
};

const offlineDBPlaces = {
  name: "Places",
  version: 1,
  storeNames: ["places"],
};

const offlineDBPositions = {
  name: "Positions",
  version: 1,
  storeNames: ["positions"],
};

const offlineDBCoordinates = {
  name: "Coordinates",
  version: 1,
  storeNames: ["coordinates"],
};

const offlineDBImages = {
  name: "Images",
  version: 1,
  storeNames: ["images"],
};

const offlineDBChanges = {
  name: "Changes",
  version: 1,
  storeNames: ["created", "deleted"],
};

const offlineDBCameras = {
  name: "Cameras",
  version: 1,
  storeNames: ["cameras"],
};

const offlineDBLines = {
  name: "Lines",
  version: 1,
  storeNames: ["lines"],
}

const offlineDBAnnotations = {
  name: "Annotations",
  version: 1,
  storeNames: ["annotations"],
}

const offlineDBModulePresets = {
  name: "ModulePresets",
  version: 1,
  storeNames: ["places", "positions"],
}

const offlineDBAutoFillLists = {
  name: "AutoFillLists",
  version: 1,
  storeNames: ["editors", "editor", "materials", "titles", "datings"],
}

const offlineDBStratiTool = {
  name: "StratiToolDB",
  version: 1,
  storeNames: ["stratiTool"]
}

const fromOfflineDB = new ConnectionToOfflineDB([
  offlineDBModels,
  offlineDBActivities,
  offlineDBPlaces,
  offlineDBPositions,
  offlineDBCoordinates,
  offlineDBChanges,
  offlineDBImages,
  offlineDBCameras,
  offlineDBLines,
  offlineDBAnnotations,
  offlineDBModulePresets,
  offlineDBAutoFillLists,
  offlineDBStratiTool,
]);
