/*
 * Created Date: 10.12.2023 15:49:23
 * Author: Tobias Mink
 * 
 * Last Modified: 15.12.2023 14:01:16
 * Modified By: Julian Hardtung
 * 
 * Description: 
 */

import * as THREE from 'three';
export class UpdateLocalVariables {

  /**
   * Creates a new entry with object params and adjust the object within
   * 3D-space. These Informations are given by the IndexedDB entry.
   * @param {*} objectType 
   * @param {*} objectData 
   * @param {*} loadedMesh 
   * @returns new entry with object params and adjusted object
   */
  updateObjectsInScene( objectType, objectData, loadedObject ) {

    const entry = {}

    switch ( objectType ) {
      case 'places':
        entry["placeID"] = objectData.placeID
        entry["modelID"] = objectData._id
        entry["modelTitle"] = objectData.title

        this.updateObjectMaterial( loadedObject, objectData )

        break;

      case 'positions':
        entry["positionID"] = objectData.positionID
        entry["modelID"] = objectData._id
        entry["modelTitle"] = objectData.title

        this.updateObjectMaterial( loadedObject, objectData )

        /* Override coordinates (IndexedDB) */
        if ( objectData.coordinates != null ) {
          loadedObject.position.set( objectData.coordinates[ 0 ], 
            objectData.coordinates[ 1 ], objectData.coordinates[ 2 ] );
        }

        /* Override scale (IndexedDB) */
        if ( objectData.scale != null ) {
          loadedObject.scale.set( objectData.scale[ 0 ], objectData.scale[ 1 ], 
            objectData.scale[ 2 ] );
        }

        /* Override rotation (IndexedDB) */
        if ( objectData.rotation != null ) {
          const eulerRotation = new THREE.Euler( objectData.rotation[ 0 ],
            objectData.rotation[ 1 ], objectData.rotation[ 2 ],
            objectData.rotation[ 3 ] );
            loadedObject.setRotationFromEuler( eulerRotation );
        }

        break;

      default:
        console.log( "error" );
    }

    return { 'entry': entry, 'object': loadedObject }

  }

  updateObjectMaterial( loadedObject, objectData ) {
    loadedObject.traverse( ( child ) => {
      if ( child instanceof THREE.Mesh ) {
        child.material.transparent = true;
        child.material.opacity = objectData.opacity;
        child.material.color = new THREE.Color( objectData.color );
        child.name = objectData._id;
      }
    } )
  }

}