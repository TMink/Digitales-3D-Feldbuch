import { fromOfflineDB } from '../../ConnectionToOfflineDB.js'
import { Utilities } from './Utilities.js';

import * as THREE from 'three';

export class UpdateIndexedDB {

  updateCamera( placeID, cameraIDsInDB, cameraInDB, arcballAnchor, cameraMain ) {

    const anchor = []
    
    const cameraData = [
      cameraMain.position.x,
      cameraMain.position.y,
      cameraMain.position.z,
      cameraMain.rotation.x,
      cameraMain.rotation.y,
      cameraMain.rotation.z
    ];

    /* Create new Anchor for arcball controls or   */
    if ( !cameraIDsInDB.includes( placeID ) ) {
      anchor.push( arcballAnchor[ 0 ] );
      anchor.push( arcballAnchor[ 1 ] );
      anchor.push( arcballAnchor[ 2 ] );
    } else {
      anchor.push( cameraInDB.arcballAnchor[ 0 ] );
      anchor.push( cameraInDB.arcballAnchor[ 1 ] );
      anchor.push( cameraInDB.arcballAnchor[ 2 ] );
    }

    /* Create and save new camera settings  */
    const newCamera = {
      _id: placeID,
      cameraPosition: cameraData,
      arcballAnchor: anchor,
      newObjectsInScene: false
    };

    fromOfflineDB.updateObject( newCamera, 'Cameras', 'cameras' );
  }
}