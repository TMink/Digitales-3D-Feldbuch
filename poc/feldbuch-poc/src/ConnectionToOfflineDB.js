/**
 * Function overview:
 *  syncLocalDBs      - Update/Create DBs in IndexedDB and get transaction 
                        Data for communtcation.
 *  getDB             - Gets the current state of the database, or creates 
 *                      a new database and objectstore
 *  addObject         - Add object to object store
 *  deleteObject      - Delete object from object store
 *  deleteAllObjects  - Delete object store from database
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
   * @param {String} dbName    - Database Name
   * @param {Int} dbVersion    - Database Version
   * @param {String} storeName - Object store which is going to be compared, 
   *                             created
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

      /* Gets current content of object store, or creates new one */
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
   * @param {String} id           - Key for identifying the value which will be 
   *                                deleted
   * @param {String} localDBname  - Database object, which contains the object
   *                                store
   * @param {String} storeName    - Object store name
   * @returns -> Promise
   */
  async getObject( id, localDBName, storeName ) {

    const localDB = this.getLocalDBFromName( localDBName );
      
    return new Promise( ( resolve, reject ) => {

      const trans = localDB.transaction( [storeName], 'readonly' );
      trans.oncomplete = e => {
        resolve( data );
      }

      const store = trans.objectStore( storeName );
      let data = store.get(id);

    })
    
  }

  /**
     * @param {String} localDBName 
     * @param {String} storeName 
     * @returns -> Promise
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
   * @param {Object} data        - Data to be added to Object Store
   * @param {String} localDBName - Database name
   * @param {String} storeName   - Object store name
   */
  async addObject( data, localDBName, storeName ) {

    /* --- DEBUGGING --- */
    console.log( 'about to add ' + JSON.stringify(data));
    
    const localDB = this.getLocalDBFromName( localDBName );
    
    await new Promise( (resolve, reject) => {
      
      const trans = localDB.transaction( [storeName], 'readwrite' );
      trans.oncomplete = e => {
        resolve();
        console.log( 'added object: ' + data.content )
      }
      trans.onerror = e => {
        console.log( 'Error opening db', e );
        reject( 'Error' );
      }
      
      const store = trans.objectStore( storeName );
      store.add( data );
      
    })
    
  }

  /**
     * @param {String} localDBName 
     * @param {String} storeName 
     * @returns -> Promise
     */
  async getSpecificValues( specificValue, localDBName, storeName ) {

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
          switch(specificValue) {
            case 'id':
              data.push(cursor.value.id)
              break;
            case 'placeNumber':
              data.push(cursor.value.placeNumber)
            default:
              console.log( "Entries do not contain Attribute: '" + specificValue + "'" );
          }
          cursor.continue();
        }
      };

    })

  }

  /**
   * @param {Int} id        - Key for identifying the value which will be 
   *                          deleted
   * @param {*} localDBName - Database name
   * @param {*} storeName   - Object store name
   */
  async deleteObject( id, localDBName, storeName ) {

    /* --- DEBUGGING --- */
    console.log( 'about to delete Object id: ' + id );

    var localDB = this.getLocalDBFromName( localDBName );
  
    await new Promise( (resolve, reject) => {

      const trans = localDB.transaction( [storeName], 'readwrite' );
      trans.oncomplete = e => {
        resolve();
        console.log( 'deleted object: ' + id )
      }

      const store = trans.objectStore( storeName );
      store.delete( id );

    });

  }

  /**
   * @param {*} localDBName - Database name
   * @param {*} storeName   - Object store name
   */
  async deleteAllObjects( localDBName, storeName ) {

    var localDB = this.getLocalDBFromName( localDBName );

    const trans = localDB.transaction( [storeName], 'readwrite' );

    const store = trans.objectStore( storeName );

    const storeRequest = store.clear();
      storeRequest.onsuccess = e => {
      console.log( storeName + ' erased' );
    }

  }

  /**
   * 
   * @param {*} localDBName - Database name
   * @returns -> Data value of database-object
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