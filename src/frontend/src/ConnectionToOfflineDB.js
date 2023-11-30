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
      );

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
        console.log("Error opening db", e);
        reject("Error");
      };

      request.onsuccess = (e) => {
        resolve(e.target.result);
      };

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        storeNames.forEach((storeName) => {
          const store = db.createObjectStore(storeName, { keyPath: "id" });
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
   * @param {String} id
   *    Key for identifying the value which will be deleted
   * @param {String} localDBname
   *    Database object, which contains the object store
   * @param {String} storeName
   *    Object store name
   * @returns
   *    an object, as Promise.
   */
  async getObject(id, localDBName, storeName) {
    const localDB = this.getLocalDBFromName(localDBName);

    return new Promise((resolve, _reject) => {
      const trans = localDB.transaction([storeName], "readonly");
      trans.oncomplete = (_e) => {
        resolve(data.result);
      };

      const store = trans.objectStore(storeName);
      let data = store.get(id);
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
            case "id":
              data.push(cursor.value.id);
              break;
            case "placeNumber":
              data.push(cursor.value.placeNumber);
              break;
            default:
              console.log("Entries do not contain the propertie: '" + property + "'");
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
  async getPropertiesWithID(id, selection, property, localDBName, storeName) {
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
            case "place":
              if (cursor.value.activityID === id) {
                conv = true;
              }
              break;
            case "position":
              if (cursor.value.placeID === id) {
                conv = true;
              }
              break;
            default:
              console.log("Error");
          }

          if (conv === true) {
            switch (property) {
              case "id":
                data.push(cursor.value.id);
                break;
              case "placeNumber":
                data.push(cursor.value.placeNumber);
                break;
              default:
                console.log("Entries do not contain the propertie: '" + property + "'");
            }
          }

          cursor.continue();
        }
      };
    });
  }

  /**
   * @param {String} id
   *    ID of the currently selected object
   * @param {String} selection
   *    Selection of which object the id is from
   * @param {String} localDBName
   *    Database name
   * @param {String} storeName
   *    IndexedDB store name
   * @returns
   *    an array containing objects with same id 
   *    (activityID, placeID, positionsID) as Promise.
   */
  async getAllObjectsWithID(id, selection, localDBName, storeName) {
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
              if (cursor.value.activityID === id) {
                data.push(cursor.value);
              }
              break;
            case "Place":
              if (cursor.value.placeID === id) {
                data.push(cursor.value);
              }
              break;
            case "Position":
              if (cursor.value.positionID === id) {
                data.push(cursor.value);
              }
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
    var curPlaceID = this.$cookies.get("currentPlace");
    var curPlace = await this.getObject(curPlaceID, 'Places', 'places');
    var lastPosID = curPlace.positions[curPlace.positions.length-1];
    var lastAddedPos = await this.getObject(lastPosID, 'Positions', 'positions');

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
        if (cursor.value.id != inputID) {
          lastAddedObj = cursor.value;
          cursor.continue();
        }
      };
    });
  }

  /**
   * Adds an Object to IndexedDB
   * @param {Object} data
   *    Data to be added to Object Store
   * @param {String} localDBName
   *    Database name
   * @param {String} storeName
   *    Store name
   */
  async addObject(data, localDBName, storeName) {
    const localDB = this.getLocalDBFromName(localDBName);

    return new Promise((resolve, reject) => {
      const trans = localDB.transaction([storeName], "readwrite");
      /* trans.oncomplete = (_e) => {
      }; */
      trans.onerror = (_e) => {
        reject("Error");
      };

      const store = trans.objectStore(storeName);
      var res = store.add(data);
      res.onsuccess = function (_e) {
        resolve(_e.target.result);
      };
    });
  }

  /**
   * Updates an object from IndexedDB
   * @param {Int} data
   *    Data object, which will be updated
   * @param {String} localDBName
   *    Database name
   * @param {String} storeName
   *    Object store name
   */
  async updateObject(data, localDBName, storeName) {
    var localDB = this.getLocalDBFromName(localDBName);

    return new Promise((resolve, _reject) => {
      const trans = localDB.transaction([storeName], "readwrite");
      trans.oncomplete = (_e) => {
        resolve();
      };
      const store = trans.objectStore(storeName);
      store.put(data);
    });
  }

  /**
   * Deletes an object from IndexedDB
   * @param {Int} object
   *    The object, which will be deleted
   * @param {String} localDBName
   *    Database name
   * @param {String} storeName
   *    Object store name
   */
  async deleteObject(object, localDBName, storeName) {
    var localDB = this.getLocalDBFromName(localDBName);

    return new Promise((resolve, _reject) => {
      const trans = localDB.transaction([storeName], "readwrite");
      trans.oncomplete = (_e) => {
        resolve();
      };

      const store = trans.objectStore(storeName);
      store.delete(object.id);

      // Make sure that no 'changes' get marked for synchronization
      // and don't mark objects, that never got uploaded before deletion
      if (localDBName != "Changes" 
        && localDBName != 'Lines' 
        && localDBName != 'ModulePresets') {
        if (object.lastSync.length > 0) {
          this.addObject({ id: object.id, object: localDBName }, "Changes", "deleted");
        }
        this.deleteObject(object, "Changes", "created");
      }
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
   * @param {String} objectID
   *    ID of the currently selected place
   * @param {String} localDBName
   *    Database name
   * @param {String} storeName
   *    Store name
   */
  async deleteCascade(id, selection, localDBName, storeName) {
    const localDB = this.getLocalDBFromName(localDBName);

    const context = this;
    var object = await this.getObject(id, localDBName, storeName);

   await new Promise(async function(resolve, _reject) {
      const trans = localDB.transaction(storeName, "readwrite");
      trans.oncomplete = (_e) => {
        resolve();
      };      

      switch (selection) {
        case "activity":
          if (object.places.length > 0) {
            for (var i=0; i<object.places.length; i++) {
              context.deleteCascade(object.places[i], "place", "Places", "places");
            }
          }
          break;
        case "place":
          if (object.positions.length > 0) {
            for (var j=0; j<object.positions.length; j++) {
              context.deleteCascade(object.positions[j], "position", "Positions", "positions");
            }
          }
          if (object.images.length > 0) {
            for (var k=0; k<object.images.length; k++) {
              var image = await context.getObject(object.images[k], 'Images', 'images');
              await fromOfflineDB.deleteObject(image, 'Images', 'images');
            }
          }
          if (object.models.length != 0) {
            for (var l=0; l<object.models.length; l++) {
              var model = await context.getObject(object.models[l], 'Models', 'places');
              await fromOfflineDB.deleteObject(model, 'Models', 'places');
            }
          }
          break;
        case "position":
          if (object.images.length != 0) {
            for (var m=0; m<object.images.length; m++) {
              var image = await context.getObject(object.images[m], 'Images', 'images');
              await fromOfflineDB.deleteObject(image, 'Images', 'images');
            }
          }
          if (object.models.length != 0) {
            for (var n=0; n<object.models.length; n++) {
              var model = await context.getObject(object.models[n], 'Models', 'positions');
              await fromOfflineDB.deleteObject(model, 'Models', 'positions');            }
          }
          break;
        default:
          console.log("Error");
      }

      await fromOfflineDB.deleteObject(object, localDBName, storeName);
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

const offlineDBModulePresets = {
  name: "ModulePresets",
  version: 1,
  storeNames: ["places", "positions"],
}

const offlineDBAutoFillLists = {
  name: "AutoFillLists",
  version: 1,
  storeNames: ["editors", "addressOf", "materials", "titles", "datings"],
}

const fromOfflineDB = new ConnectionToOfflineDB([
  offlineDBModels,
  offlineDBActivities,
  offlineDBPlaces,
  offlineDBPositions,
  offlineDBChanges,
  offlineDBImages,
  offlineDBCameras,
  offlineDBLines,
  offlineDBModulePresets,
  offlineDBAutoFillLists,
]);