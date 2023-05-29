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
 *  getPositionsWithPlaceID - Gets the data of all positions, which belong to a
 *                            specific place
 *  addObject               - Adds object to a specific object store
 *  deleteObject            - Deletes an object from a specific object store
 *  deleteAllObjects        - Deletes all objects from a specific object store
 *  deleteCascadePositions  - Deletes all positions, which belong to a specific 
 *                            place
 */
export { fromOfflineDB }

export default class ConnectionToOfflineDB {

  constructor(offlineDB) {
    this.offlineDB = offlineDB;
    this.localDB = [];
  }

  async syncLocalDBs() {
    var countDooku = this.offlineDB.length - 1;

      while( countDooku >= 0 ) {

        this.localDB[ countDooku ] = 
          await this.getDB( this.offlineDB[ countDooku ].name, 
                            this.offlineDB[ countDooku ].version, 
                            this.offlineDB[ countDooku ].storeNames );

        countDooku -= 1;

      };
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
  async getDB( dbName, dbVersion, storeNames ) {

    return new Promise( (resolve, reject) => {

      const request = window.indexedDB.open( dbName, dbVersion )

      request.onerror = e => {
        console.log( 'Error opening db', e );
        reject( 'Error' );
      }

      request.onsuccess = e => {
        resolve( e.target.result );
      }

      request.onupgradeneeded = e => {                                          
        console.log( 'onupgradeneeded' );
        const db = e.target.result;
        storeNames.forEach( storeName => {
          db.createObjectStore( storeName, {autoIncrement: true, 
                                keyPath:'id'} );
        });
      }

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
  async getObject( id, localDBName, storeName ) {

    const localDB = this.getLocalDBFromName( localDBName );
      
    return new Promise( ( resolve, reject ) => {

      const trans = localDB.transaction( [storeName], 'readonly' );
      trans.oncomplete = e => {
        resolve( data );
      }

      const store = trans.objectStore( storeName );
      let data = store.get( id );

    })
    
  }

  /**
     * @param {String} localDBName
     *    Database name
     * @param {String} storeName
     *    Object store name
     * @returns 
     *    an array of objects, as Promise.
     */
  async getAllObjects( localDBName, storeName ) {

    const localDB = this.getLocalDBFromName( localDBName );
      
    return new Promise( ( resolve, reject ) => {

      const trans = localDB.transaction( [storeName], 'readonly' );
      trans.oncomplete = e => {
        resolve( data );
      }

      const store = trans.objectStore( storeName );
      let data = [];

      store.openCursor().onsuccess = e => {
        let cursor = e.target.result;
        if (cursor) {
          data.push(cursor.value)
          cursor.continue();
        }
      };

    })

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
  async getProperties( property, localDBName, storeName ) {

    const localDB = this.getLocalDBFromName( localDBName );
      
    return new Promise( ( resolve, reject ) => {

      const trans = localDB.transaction( [storeName], 'readonly' );
      trans.oncomplete = e => {
        resolve( data );
      }

      const store = trans.objectStore( storeName );
      let data = [];

      store.openCursor().onsuccess = e => {
        let cursor = e.target.result;
        if (cursor) {
          switch(property) {
            case 'id':
              data.push(cursor.value.id)
              break;
            case 'placeNumber':
              data.push(cursor.value.placeNumber)
            default:
              console.log(
                "Entries do not contain the propertie: '" + property + "'" );
          }
          cursor.continue();
        }
      };

    })

  }
  /**
     * @param {String} placeID
     *    ID of the currently selected place
     * @param {String} localDBName
     *    Database name
     * @returns
     *    an array containing Positions-Data with same placeID, as Promise.
     */
  async getPositionsWithPlaceID( placeID, localDBName, storeName ) {

    const localDB = this.getLocalDBFromName( localDBName );
      
    return new Promise( ( resolve, reject ) => {

      const trans = localDB.transaction( [storeName], 'readonly' );
      trans.oncomplete = e => {
        resolve( data );
      }

      const store = trans.objectStore( storeName );
      let data = [];

      store.openCursor().onsuccess = e => {
        let cursor = e.target.result;
        if (cursor) {
          if( cursor.value.placeID === placeID) {
            data.push(cursor.value)
          }
          cursor.continue();
        }
      };

    })

  }

  /**
   * @param {Object} data
   *    Data to be added to Object Store
   * @param {String} localDBName
   *    Database name
   * @param {String} storeName
   *    Store name
   */
  async addObject( data, localDBName, storeName ) {
    
    const localDB = this.getLocalDBFromName( localDBName );
    
    await new Promise( (resolve, reject) => {
      
      const trans = localDB.transaction( [storeName], 'readwrite' );
      trans.oncomplete = e => {
        resolve();
      }
      trans.onerror = e => {
        reject( 'Error' );
      }
      
      const store = trans.objectStore( storeName );
      store.add( data );
      
    })
    
  }

  /**
   * @param {Int} id
   *    Key for identifying the object, which will be deleted
   * @param {String} localDBName
   *    Database name
   * @param {String} storeName
   *    Object store name
   */
  async deleteObject( id, localDBName, storeName ) {

    var localDB = this.getLocalDBFromName( localDBName );
  
    await new Promise( (resolve, reject) => {

      const trans = localDB.transaction( [storeName], 'readwrite' );
      trans.oncomplete = e => {
        resolve();
      }

      const store = trans.objectStore( storeName );
      store.delete( id );

    });

  }

  /**
   * @param {String} localDBName
   *    Database name
   * @param {*} storeName
   *    Object store name
   */
  async deleteAllObjects( localDBName, storeName ) {

    var localDB = this.getLocalDBFromName( localDBName );

    const trans = localDB.transaction( [storeName], 'readwrite' );

    const store = trans.objectStore( storeName );

    const storeRequest = store.clear();
      storeRequest.onsuccess = e => {
    }

  }

  /**
   * @param {String} placeID
   *    ID of the currently selected place
   * @param {String} localDBName
   *    Database name
   * @param {String} storeName
   *    Store name
   */
  async deleteCascadePositions( placeID, localDBName, storeName ) {

    const localDB = this.getLocalDBFromName( localDBName );
      
    await new Promise( ( resolve, reject ) => {

      const trans = localDB.transaction( [storeName], 'readwrite' );
      trans.oncomplete = e => {
        resolve();
      }

      const store = trans.objectStore( storeName );

      store.openCursor().onsuccess = e => {
        let cursor = e.target.result;
        if (cursor) {
          if( cursor.value.placeID === placeID) {
            store.delete( cursor.value.id )
          }
          cursor.continue();
        }
      };

    })

  }

  /**
   * @param {String} localDBName
   *    Database name
   * @returns
   *    the localDB for transaction
   */
  getLocalDBFromName( localDBName ) {

    for( var i = 0; i < this.localDB.length; i++ ) {

      if( this.localDB[i].name == localDBName ) {
        return this.localDB[ i ]
      }

    }

  }

};

/**
* Create/Change new databases in IndexedDB (offline database)
*/
const offlineDBGeometries = {
  name: 'Geometry',
  version: 1,
  storeNames : [ 'excavation' ]
};

const offlineDBImages = {
  name: 'Image',
  version: 1,
  storeNames: [ 'excavation' ]
};

const offlineDBActivities = {
  name: 'Activities',
  version: 1,
  storeNames: [ 'activities' ]
};

const offlineDBPlaces = {
  name: 'Places',
  version: 1,
  storeNames: [ 'places' ]
};

const offlineDBPositions = {
  name: 'Positions',
  version: 1,
  storeNames: [ 'positions' ]
};

const fromOfflineDB = new ConnectionToOfflineDB(
  [offlineDBGeometries, offlineDBImages, offlineDBActivities,
   offlineDBPlaces, offlineDBPositions]
);