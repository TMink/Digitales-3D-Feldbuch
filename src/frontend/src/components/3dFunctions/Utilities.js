/*
 * Created Date: 08.01.2024 14:43:50
 * Author: Tobias Mink
 * 
 * Last Modified: 26.01.2024 11:56:59
 * Modified By: Tobias Mink
 * 
 * Description: 
 */

import * as THREE from 'three';
import { fromOfflineDB } from '../../ConnectionToOfflineDB.js'
import { toRaw } from 'vue';

export class Utilities {
  
  getGroup( object ) {
    var groupObject = object;
    while ( !( groupObject instanceof THREE.Group ) ) {
      groupObject = groupObject.parent;
    }
    
    return groupObject;
  }

  getModelCenter( object ) {
    var groupObject = object;
    while ( !( groupObject instanceof THREE.Group ) ) {
      groupObject = groupObject.parent;
    }

    const boundingBox = new THREE.Box3();
    boundingBox.setFromObject( groupObject );
    const center = new THREE.Vector3();
    boundingBox.getCenter( center );

    return center;
  }

  getBarycenter( objects ) {
    var groupObjects = objects;
    const groupObjectsCenter = []
    const center = new THREE.Vector3()
    
    groupObjects.forEach( groupObject => {
      while ( !( groupObject instanceof THREE.Group ) ) {
        groupObject = groupObject.parent;
      }
      
      const boundingBox = new THREE.Box3();
      boundingBox.setFromObject( groupObject );
      const center = new THREE.Vector3();
      boundingBox.getCenter( center );
      
      groupObjectsCenter.push( center );
    } )

    // Find barycenter of object centers
    groupObjectsCenter.forEach( object => {
      center.x += object.x;
      center.y += object.y;
      center.z += object.z;
    } )

    center.x = center.x / 3;
    center.y = center.y / 3;
    center.z = center.z / 3;

    return center
  }
}