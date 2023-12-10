


export class UpdateLocalVariables {

  async updateObjectsInScene( objectType, objectData, loadedMesh ) {

    const newEntry = {}

    switch ( objectType ) {
      case 'Place':
        newEntry["placeID"] = objectData.placeID
        newEntry["modelID"] = objectData.id
        newEntry["modelTitle"] = objectData.title
        break;

      case 'Position':
        newEntry["positionID"] = objectData.positionID
        newEntry["modelID"] = objectData.id
        newEntry["modelTitle"] = objectData.title

        /* Override coordinates (IndexedDB) */
        if ( objectData.coordinates != null ) {
          loadedMesh.position.set( objectData.coordinates[ 0 ], 
            objectData.coordinates[ 1 ], objectData.coordinates[ 2 ] );
        }

        /* Override scale (IndexedDB*/
        if ( objectData.scale != null ) {
          loadedMesh.scale.set( objectData.scale[ 0 ], objectData.scale[ 1 ], 
            objectData.scale[ 2 ] );
        }

        /* Override rotation (IndexedDB) */
        if ( objectData.rotation != null ) {
          const eulerRotation = new THREE.Euler( objectData.rotation[ 0 ],
            objectData.rotation[ 1 ], objectData.rotation[ 2 ],
            objectData.rotation[ 3 ] );
            loadedMesh.setRotationFromEuler( eulerRotation );
        }

        break;

      default:
        console.log( "error" );
    }

    return [ newEntry, loadedMesh ]

  }

}