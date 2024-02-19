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

  async updateObjects( placeModelsInScene, positionModelsInScene, sceneMain ) {

    /* Update place models */
    for ( var i = 0; i < placeModelsInScene.length; i++ ) {
      const modelID = placeModelsInScene[ i ]._id;
      this.updateObjectOpacityAndColor(modelID, 'places', sceneMain);
    }

    /* Update position models */
    for ( var u = 0; u < positionModelsInScene.length; u++ ) {
      const modelID = positionModelsInScene[ u ]._id;
      const modelInScene = sceneMain.getObjectByName( modelID );
      const modelInDB = await fromOfflineDB.getObject( modelID, 'Models',
        'positions' );

      const utilities = new Utilities()
      var groupObject = utilities.getGroup( modelInScene );

      /* Get local Rotion */
      const euler = groupObject.rotation
      const rotation = [ euler._x, euler._y, euler._z, euler._order ]
      
      /* Get world scale */
      const worldScale = new THREE.Vector3();
      groupObject.getWorldScale( worldScale );
      const scale = [ worldScale.x, worldScale.y, worldScale.z ];

      /* Get world position */
      const worldPosition = new THREE.Vector3();
      groupObject.getWorldPosition( worldPosition );
      const coordinates = [ worldPosition.x, worldPosition.y,
        worldPosition.z ];

      modelInDB.color = "#" + modelInScene.material.color.getHexString();
      modelInDB.opacity = modelInScene.material.opacity;
      modelInDB.coordinates = coordinates;
      modelInDB.scale = scale;
      modelInDB.rotation = rotation;

      await fromOfflineDB.updateObject( modelInDB, 'Models', 'positions' );
    }

  }
}