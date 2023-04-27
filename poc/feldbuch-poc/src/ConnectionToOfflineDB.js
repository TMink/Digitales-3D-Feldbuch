/**
 * Function overview:
 *  syncLocalDBs      - Update/Create DBs in IndexedDB and get transaction 
                        Data for communtcation.
 *  syncLocalObjects  - Update local Objects with IndexedDB
 *  getDB             - Gets the current state of the database, or creates 
 *                      a new database and objectstore
 *  getObjects        - Gets all objects from object store
 *  addObject         - Add object to object store
 *  deleteObject      - Delete object from object store
 *  deleteAllObjects  - Delete object store from database
 */

                        export default class ConnectionToOfflineDB {

                            constructor( offlineDBData, localDBData, localObjectsData ) {
                          
                              this.offlineDBData = offlineDBData;
                              this.localDBData = localDBData;
                              this.localObjectsData = localObjectsData;
                          
                            }
                        
                            async syncLocalDBs() {
                          
                              var countDooku = this.localDBData.length - 1
                          
                                while( countDooku >= 0 ) {
                          
                                  this.localDBData[ countDooku ].data = 
                                    await this.getDB( this.offlineDBData[ countDooku ].name, 
                                                      this.offlineDBData[ countDooku ].version, 
                                                      this.offlineDBData[ countDooku ].storeNames );
                          
                                  countDooku -= 1;
                          
                                };
                          
                            }
                        
                            async syncLocalObjects() {
                          
                              var countDooku = this.offlineDBData.length - 1;
                          
                              while( countDooku >= 0 ) {
                          
                                for( var i=0; i < this.offlineDBData[ countDooku ].storeNames.length; 
                                     i++ ) {
                          
                                  const data = await this.getObjects( 
                                    this.localDBData[ countDooku ].data,
                                    this.offlineDBData[ countDooku ].storeNames[ i ] );
                          
                                  await this.localObjectsData[ countDooku ].data.push( data );
                          
                                };
                          
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
                             * @param {Object} localDB   - Database object, which contains the object
                             *                             store
                             * @param {String} storeName - Object store name
                             * @returns -> Promise
                             */
                            async getObjects( localDB, storeName ) {
                                
                              return new Promise( ( resolve, reject ) => {
                          
                                const trans = localDB.transaction( [storeName], 'readonly' );
                                trans.oncomplete = e => {
                                  resolve( data );
                                }
                          
                                const store = trans.objectStore( storeName );
                                let data = [];
                          
                                store.openCursor().onsuccess = e => {
                                  const cursor = e.target.result;
                                  if ( cursor ) {
                                    data.push( cursor.value );
                                    cursor.continue();
                                  }
                                }
                          
                              });
                              
                            }
                          
                            /**
                             * @param {Object} data        - Data to be added to Object Store
                             * @param {String} localDBName - Database name
                             * @param {String} storeName   - Object store name
                             */
                            async addObject( data, localDBName, storeName ) {
                          
                              /* --- DEBUGGING --- */
                              console.log( 'about to add ' + JSON.stringify(data) );
                              
                              var localDB = this.getLocalDBFromName( localDBName );
                              
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
                              
                              await this.syncLocalObjects();
                              
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
                          
                              await this.syncLocalObjects();
                          
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
                          
                              await this.syncLocalObjects();
                          
                            }
                          
                            /**
                             * 
                             * @param {*} localDBName - Database name
                             * @returns -> Data value of database-object
                             */
                            getLocalDBFromName( localDBName ) {
                          
                              for( var i = 0; i < this.localDBData.length; i++ ) {
                                if( this.localDBData[ i ].data.name == localDBName ) {
                                  return this.localDBData[ i ].data
                                }
                              }
                          
                            }
                          
                          }