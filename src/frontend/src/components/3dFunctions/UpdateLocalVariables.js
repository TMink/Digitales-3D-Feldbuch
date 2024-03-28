/*
 * Created Date: 10.12.2023 15:49:23
 * Author: Tobias Mink
 * 
 * Last Modified: 28.03.2024 18:20:27
 * Modified By: Tobias Mink
 * 
 * Description: Functions to update the local parameter list to reduce the
 *              amount of IndexedDb accesses.
 */

import * as THREE from 'three';
export class UpdateLocalVariables {

  /**
   * Creates a new entry with object params and adjust the object within
   * 3D-space. These Informations are given by the IndexedDB entry.
   * @param { object } objectType 
   * @param { object } objectData 
   * @param { THREE.Object3D } loadedMesh 
   * @returns new entry with object params and adjusted object
   */
  updateLoadedObject( objectType, objectData, loadedObject ) {

    const entry = {}

    switch ( objectType ) {
      case 'places':
        entry["_id"] = objectData._id
        entry["title"] = objectData.title
        entry["placeID"] = objectData.placeID

        this.updateObjectMaterial( loadedObject, objectData )

        break;

      case 'positions':
        const bbox = new THREE.Box3().setFromObject( loadedObject );
        const vec3 = new THREE.Vector3();
        bbox.getCenter( vec3 )
        
        entry["_id"] = objectData._id
        entry["title"] = objectData.title
        entry["positionID"] = objectData.positionID
        entry["position"] = vec3
        entry["bbox"] = bbox

        /* Updated material */
        this.updateObjectMaterial( loadedObject, objectData )

        /**
         * If the object was already loaded in the past, the coordinates where
         * saved in IndexedDB. Following three if-cases will be triggered, if
         * the respective parameters are already given. If thats the case, the
         * loaded object will be updated and respositioned.
         */
        
        /* Coordinates */
        if ( objectData.coordinates != null ) {
          loadedObject.position.set( objectData.coordinates[ 0 ], 
            objectData.coordinates[ 1 ], objectData.coordinates[ 2 ] );
        }

        /* Scale */
        if ( objectData.scale != null ) {
          loadedObject.scale.set( objectData.scale[ 0 ], objectData.scale[ 1 ], 
            objectData.scale[ 2 ] );
        }

        /* Rotation */
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

  /**
   * Updates material parameters with data from IndexedDB.
   * @param { THREE.Group } loadedObject 
   * @param { object } objectData 
   */
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