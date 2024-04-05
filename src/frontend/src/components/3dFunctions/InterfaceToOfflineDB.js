/*
 * Created Date: 24.02.2024 18:07:56
 * Author: Tobias Mink
 * 
 * Last Modified: 03.04.2024 18:49:17
 * Modified By: Tobias Mink
 * 
 * Description: A Collection of functions to update saved data in IndexedDB.
 */

import { Vector3 } from 'three';
import { fromOfflineDB } from '../../ConnectionToOfflineDB.js'
import { Utilities } from './Utilities.js';

export class InterfaceToOfflineDB {

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
  async updateCamera( placeID, cameraIDsInDB, cameraInDB, arcballAnchor, main ) {

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
    await this.update( 'object', newCamera, 'Cameras', 'cameras' );
  }

  /**
   * Updates the object entrys of place and position objects in IndexedDB.
   * @param { object } placeModelsInScene 
   * @param { object } positionModelsInScene 
   * @param { Scene } sceneMain 
   */
  async updateObjects( main ) {

    /* Update place models */
    for ( var i = 0; i < main.objects.place.entry.length; i++ ) {
      const modelID = main.objects.place.entry[ i ]._id;
      this.updateObjectOpacityAndColor( modelID, 'places', main );
    }

    /* Update position models */
    for ( var u = 0; u < main.objects.position.entry.length; u++ ) {
      const modelID = main.objects.position.entry[ u ]._id;
      const modelInScene = main.scene.getObjectByName( modelID );
      const modelInDB = await this.get( 'object', modelID, 'Models',
        'positions' );

      const utilities = new Utilities()
      var groupObject = utilities.getGroup( modelInScene );

      /* Get local Rotion */
      const euler = groupObject.rotation
      const rotation = [ euler._x, euler._y, euler._z, euler._order ]
      
      /* Get world scale */
      const worldScale = new Vector3();
      groupObject.getWorldScale( worldScale );
      const scale = [ worldScale.x, worldScale.y, worldScale.z ];

      /* Get world position */
      const worldPosition = new Vector3();
      groupObject.getWorldPosition( worldPosition );
      const coordinates = [ worldPosition.x, worldPosition.y,
        worldPosition.z ];

      modelInDB.color = "#" + modelInScene.material.color.getHexString();
      modelInDB.opacity = modelInScene.material.opacity;
      modelInDB.coordinates = coordinates;
      modelInDB.scale = scale;
      modelInDB.rotation = rotation;

      await this.update( 'object', modelInDB, 'Models', 'positions' );
    }

  }

  /**
   * Updates opacity and color values of place and position objects in
   * IndexedDB.
   * @param { object } modelID 
   * @param { object } storeName 
   * @param { Scene } scene 
   */
  async updateObjectOpacityAndColor( modelID, storeName, main ) {
    const modelInScene = main.scene.getObjectByName( modelID );
    const modelInDB = await this.get( 'object', modelID, 'Models',
      storeName );

    modelInDB.color = "#" + modelInScene.material.color.getHexString();
    modelInDB.opacity = modelInScene.material.opacity;

    await this.update( 'object', modelInDB, 'Models', storeName );
  }

  async get( type, _id, localDBName, storeName, selection ) {
    switch( type ) {
      case 'object':
        return fromOfflineDB.getObject( _id, localDBName, storeName );
      case 'allObjects':
        return fromOfflineDB.getAllObjects( localDBName, storeName );
      case 'allObjectsWithID':
        return fromOfflineDB.getAllObjectsWithID( _id, selection, localDBName, storeName );
      case 'properties':
        return fromOfflineDB.getProperties( "_id", localDBName, storeName );
      default:
        console.log( "IndexedDB_Getting error" )
        console.log( _id )
    }
  }

  async add( type, data, localDBName, storeName ) {
    switch( type ) {
      case 'object':
        fromOfflineDB.addObject( data, localDBName, storeName );
        break;
      default:
        console.log( "IndexedDB_Adding error" )
        console.log( data )
    }
  }

  async update( type, data, localDBName, storeName ) {
    switch( type ) {
      case 'object':
        fromOfflineDB.updateObject( data, localDBName, storeName );
        break;
      default:
        console.log( "IndexedDB_Update error" )
        console.log( data )
    }
  }

  async delete( type, data, localDBName, storeName ) {
    switch( type ) {
      case 'object':
        fromOfflineDB.deleteObject( data, localDBName, storeName );
        break;
      default:
        console.log( "IndexedDB_Delete error" )
        console.log( data )
    }
  }

  async synchronise( type ) {
    switch( type ) {
      case 'localDBs':
        fromOfflineDB.syncLocalDBs();
        break;
      default:
        console.log( "IndexedDB_Synchronisation error" )
        console.log( type )
    }
  }

}