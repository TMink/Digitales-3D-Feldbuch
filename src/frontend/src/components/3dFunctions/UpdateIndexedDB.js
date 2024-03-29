/*
 * Created Date: 24.02.2024 18:07:56
 * Author: Tobias Mink
 * 
 * Last Modified: 30.03.2024 00:04:09
 * Modified By: Tobias Mink
 * 
 * Description: A Collection of functions to update saved data in IndexedDB.
 */
import * as THREE from 'three';
import { fromOfflineDB } from '../../ConnectionToOfflineDB.js'
import { Utilities } from './Utilities.js';

export class UpdateIndexedDB {

  /**
   * Update all camera specific parameters. These are used to reset the camera
   * options when switching between fieldbook and 3DPart. Because of the garbage
   * collection this data will be lost otherwise.
   * @param { object } placeID 
   * @param { object } cameraIDsInDB 
   * @param { object } cameraInDB 
   * @param { object } arcballAnchor 
   * @param { object } main 
   */
  updateCamera( placeID, cameraIDsInDB, cameraInDB, arcballAnchor, main ) {

    const anchor = []
    
    /* Get position and rotation data */
    const cameraData = [
      main.camera.position.x,
      main.camera.position.y,
      main.camera.position.z,
      main.camera.rotation.x,
      main.camera.rotation.y,
      main.camera.rotation.z
    ];

    /* Create new Anchor for arcball controls */
    if ( !cameraIDsInDB.includes( placeID ) ) {
      anchor.push( arcballAnchor[ 0 ] );
      anchor.push( arcballAnchor[ 1 ] );
      anchor.push( arcballAnchor[ 2 ] );
    } else {
      anchor.push( cameraInDB.arcballAnchor[ 0 ] );
      anchor.push( cameraInDB.arcballAnchor[ 1 ] );
      anchor.push( cameraInDB.arcballAnchor[ 2 ] );
    }

    /* Create and save new camera settings */
    const newCamera = {
      _id: placeID,
      cameraPosition: cameraData,
      arcballAnchor: anchor,
      newObjectsInScene: false
    };
    
    /* Update the entry in IndexDB */
    fromOfflineDB.updateObject( newCamera, 'Cameras', 'cameras' );
  }

  /**
   * Updates the object entrys of place and position objects in IndexedDB.
   * @param { object } placeModelsInScene 
   * @param { object } positionModelsInScene 
   * @param { THREE.Scene } sceneMain 
   */
  async updateObjects( main ) {

    /* Update place models */
    for ( var i = 0; i < main.objects.place.entry.length; i++ ) {
      const modelID = main.objects.place.entry[ i ]._id;
      this.updateObjectOpacityAndColor(modelID, 'places', main);
    }

    /* Update position models */
    for ( var u = 0; u < main.objects.position.entry.length; u++ ) {
      const modelID = main.objects.position.entry[ u ]._id;
      const modelInScene = main.scene.getObjectByName( modelID );
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

  /**
   * Updates opacity and color values of place and position objects in
   * IndexedDB.
   * @param { object } modelID 
   * @param { object } storeName 
   * @param { THREE.Scene } scene 
   */
  async updateObjectOpacityAndColor( modelID, storeName, main ) {

    const modelInScene = main.scene.getObjectByName( modelID );
      const modelInDB = await fromOfflineDB.getObject( modelID, 'Models',
      storeName );

      modelInDB.color = "#" + modelInScene.material.color.getHexString();
      modelInDB.opacity = modelInScene.material.opacity;

      await fromOfflineDB.updateObject( modelInDB, 'Models', storeName );
    
  }

}