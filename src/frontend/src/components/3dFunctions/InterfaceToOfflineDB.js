/*
 * Created Date: 24.02.2024 18:07:56
 * Author: Tobias Mink
 * 
 * Last Modified: 18.04.2024 17:10:34
 * Modified By: Tobias Mink
 * 
 * Description: A Collection of functions to update saved data in IndexedDB.
 */

import { Vector3 } from 'three';
import { fromOfflineDB } from '../../ConnectionToOfflineDB.js'
import { Utilities } from './Utilities.js';

export class InterfaceToOfflineDB {

  /**
   * 
   * @param {*} activityID 
   * @param {*} arcballAnchor 
   * @param {*} camera 
   */
  async createCamera( activityID, arcballAnchor, camera ) {

    const anchor = []
    const activity = await this.get( 'object', activityID, 'Activities', 'activities' )

    /* Get position and rotation data */
    const cameraData = [
      camera.position.x,
      camera.position.y,
      camera.position.z,
      camera.rotation.x,
      camera.rotation.y,
      camera.rotation.z
    ];

    /* Create new Anchor for arcball controls */
    anchor.push( arcballAnchor[ 0 ] );
    anchor.push( arcballAnchor[ 1 ] );
    anchor.push( arcballAnchor[ 2 ] );

    /* Create and save new camera settings */
    const newCameraID = String(Date.now());
    const newCamera = {
      _id: newCameraID,
      activityID: activityID,
      cameraPosition: cameraData,
      arcballAnchor: anchor,
      objectsInSceneChanged: false
    };

    activity.camera = newCameraID

    await this.add( 'object', newCamera, 'Cameras', 'cameras' );
    await this.update( 'object', activity, 'Activities', 'activities' )
    
  }

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
  async updateCamera( activityID, cameraOfActivity, camera ) {

    const anchor = []
    
    /* Get position and rotation data */
    const cameraData = [
      camera.position.x,
      camera.position.y,
      camera.position.z,
      camera.rotation.x,
      camera.rotation.y,
      camera.rotation.z
    ];
    
    /* Create new Anchor for arcball controls */
    anchor.push( cameraOfActivity.arcballAnchor[ 0 ] );
    anchor.push( cameraOfActivity.arcballAnchor[ 1 ] );
    anchor.push( cameraOfActivity.arcballAnchor[ 2 ] );

    /* Update existing camera */
    cameraOfActivity.cameraPosition = cameraData;
    cameraOfActivity.arcballAnchor = anchor;
    
    /* Update the entry in IndexDB */
    await this.update( 'object', cameraOfActivity, 'Cameras', 'cameras' );
  }

  /**
   * Updates the object entrys of place and position objects in IndexedDB.
   * @param { object } placeModelsInScene 
   * @param { object } positionModelsInScene 
   * @param { Scene } sceneMain 
   */
  async updateObjects( objects, scene ) {

    /* Update place models */
    for ( var i = 0; i < objects.place.entry.length; i++ ) {
      const modelID = objects.place.entry[ i ]._id;
      this.updateObjectOpacityAndColor( modelID, 'places', scene );
    }

    /* Update position models */
    for ( var u = 0; u < objects.position.entry.length; u++ ) {
      const modelID = objects.position.entry[ u ]._id;
      const modelInScene = scene.getObjectByName( modelID );
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
  async updateObjectOpacityAndColor( modelID, storeName, scene ) {
    const modelInScene = scene.getObjectByName( modelID );
    const modelInDB = await this.get( 'object', modelID, 'Models',
      storeName );

    modelInDB.color = "#" + modelInScene.material.color.getHexString();
    modelInDB.opacity = modelInScene.material.opacity;

    await this.update( 'object', modelInDB, 'Models', storeName );
  }

  async get( type, _ids, localDBName, storeName, selection, property ) {
    switch( type ) {
      case 'object':
        return await fromOfflineDB.getObject( _ids, localDBName, storeName );
      case 'allObjects':
        return await fromOfflineDB.getAllObjects( localDBName, storeName );
      case 'allObjectsWithID':
        return await fromOfflineDB.getAllObjectsWithID( _ids, selection, localDBName, storeName );
      case 'properties':
        return await fromOfflineDB.getProperties( "_id", localDBName, storeName );
      case 'propertiesWithID':
        return await fromOfflineDB.getPropertiesWithID( _ids, selection, property, localDBName, storeName );
      case 'allPositionIDsOfAllPlaceIDs':
        const positionIDs = {};
        for ( let placeID of _ids ) {
          const placeIDPositionIDs = await fromOfflineDB.getPropertiesWithID( placeID, 'ofID', 'positions', 'Places', 'places' );
          positionIDs[ placeID.toString() ] = placeIDPositionIDs[ 0 ];
        }
        return positionIDs;
      case 'allPositionObejctsOfAllPositionIDs':
        const positionObjects = {}
        for( let placeID in _ids ) {
          /* Check if the place contains position */
          if( _ids[placeID].length > 0 ) {
            for( let positionID of _ids[placeID] ) {
              const models = await fromOfflineDB.getPropertiesWithID( positionID, 'ofID', 'models', 'Positions', 'positions' );
              /* Check if the position contains models */
              if( models.length > 0 ) {
                /* Create new entry, if all requierements are met */
                positionObjects[ positionID.toString() ] = {
                  placeID: placeID,
                  models: models
                }
              }
            }
          }
        }
        return positionObjects;
      case 'allPlaceObejctsOfActivityID':
        const placeObjects = {}
        for( const placeID of _ids ) {
          const models = await fromOfflineDB.getPropertiesWithID( placeID, 'ofID', 'models', 'Places', 'places' );
          if( models.length > 0 ) {
            placeObjects[ placeID.toString() ] = models
          }
        }
      return placeObjects;
      default:
        console.log( "IndexedDB_Getting error" )
        console.log( _ids )
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