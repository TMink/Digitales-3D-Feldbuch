/*
 * Created Date: 10.12.2023 15:32:15
 * Author: Tobias Mink
 * 
 * Last Modified: 29.03.2024 18:31:35
 * Modified By: Tobias Mink
 * 
 * Description: A Collection of loader functions which are used to determines,
 *              distributes and modify the 3D objects which will be loaded in
 *              main or sub scene.
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { UpdateLocalVariables } from './UpdateLocalVariables.js'
import { fromOfflineDB } from '../../ConnectionToOfflineDB.js'
import { exParams } from './Parameter.js';

export class ObjectLoaders {

  /**
   * Reads the postfix of a given 3D-Object data type (.gltf/.glb, .obj, etc.)
   * and choses the right loader. Returns an THREE.Object3D.
   * @param { object } objectData 
   * @returns THREE.Group<THREE.Object3DEventMap>
   */
  async load( objectData ) {
    let loader, object = null
    const id = objectData._id
    /* Implementation of draco loader to speed up loading time of the 
         * object. */
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath(
      'https://www.gstatic.com/draco/versioned/decoders/1.5.6/' );
      dracoLoader.setDecoderConfig( { type: 'js' } );
    
    switch ( objectData.loaderType ) {
      case 'glb' || 'gltf':
        /* Set the loader type and append the dracoLoader */
        loader = new GLTFLoader()
        loader.setDRACOLoader( dracoLoader )
        
        object = await new Promise( ( resolve ) => {
          loader.parse( objectData.model, '', ( glb ) => {
            glb.scene.traverse( ( child ) => {
              if ( child instanceof THREE.Mesh ) {
                child.name = id
              }
            } )
            resolve( glb.scene );
          });
        });
        return object
      case 'obj':
        /* Set the loader type and append the dracoLoader */
        loader = new OBJLoader()
        loader.setDRACOLoader( dracoLoader )
        
        object = await new Promise( ( resolve ) => {
          loader.parse( objectData.model, '', ( obj ) => {
            obj.scene.traverse( ( child ) => {
              if ( child instanceof THREE.Mesh ) {
                child.name = id
              }
            } )
            resolve( obj );
          });
        });
        return object
        
      default:
        console.log( "No valid loaderType" );
        break;
    }
  }

  /**
   * Loads the objects from IndexedDB into the scene
   * @param { object } exParams 
   * @param { object } objectType 
   * @param { object } placeID 
   */
  async loadObjectsInScene( main, objectType, placeID ) {
    /* Init loader and updater */
    const updater = new UpdateLocalVariables()
    const objectsToBeLoaded = [];

    /* Get all objects of chosen place */
    const objects = await fromOfflineDB.getAllObjectsWithID( placeID, 'Place',
      'Models', objectType );

    if ( objects ) {
      switch ( objectType ) {
        case 'places':
          objects.forEach( object => {
            objectsToBeLoaded.push( object )
          } );
          break;
        case 'positions':
          objects.forEach( object => {
            objectsToBeLoaded.push( object )
          } );
          break;
      }
      
      if ( objectsToBeLoaded.length > 0 ) {
        for ( var i = 0; i < objectsToBeLoaded.length; i++ ) {
          /* Raw object wich hasent been added to the scene */
          const loadedObject = await this.load( objectsToBeLoaded[ i ] );
          
          /* Updated the position parameters of the object, if the object was
           * already part of the scene. This is enables the system to "remember"
           * the current rotation, coordinates and scale of the object. Also
           * returns an entry to be saved for better overview of currently
           * loaded objects. */
          const updated = updater.updateLoadedObject
            ( objectType, objectsToBeLoaded[ i ], loadedObject )
          
          /* Push new entry */
          if ( objectType === 'places') {
            main.objects.place._ids.push( updated.entry._id );
            main.objects.place.titles.push( updated.entry.title );
            main.objects.place.groups.push( updated.object );
            main.objects.place.amount++;

            main.objects.place.entry.push( {
              _id: updated.entry._id,
              placeID: updated.entry.placeID,
              title: updated.entry.title,
              group: updated.object
            } );
          } else if ( objectType === 'positions' ) {
            main.objects.position._ids.push( updated.entry._id );
            main.objects.position.titles.push( updated.entry.title );
            main.objects.position.groups.push( updated.object );
            main.objects.position.amount++;

            main.objects.position.entry.push( {
              _id: updated.entry._id,
              positionID: updated.entry.positionID,
              title: updated.entry.title,
              group: updated.object,
              position: updated.position,
              bbox: updated.bbox
            } );
          }

          /* Add loaded object to scene */
          main.scene.add( updated.object );
          main.objects.allObjects.push( updated.object );
        }
      }     
    }
  }

  /**
   * Deletes specific objects from the prameter list in Parameter.js.
   * @param { object } type 
   * @param { object } objectsToBeDeleted 
   */
  deleteObjectsFromExParams( type, objectsToBeDeleted ) {

    /* Determines the objectType to be worked with in the function, depending of
     * the given type. This enables this function to be used for place and 
     * position objects. */
    let objectType = null;
    switch ( type ) {
      case 'place':
        objectType = exParams.main.objects.place
        break;
      case 'position':
        objectType = exParams.main.objects.position
        break;
    }

    objectsToBeDeleted.forEach( object => {
      /* allObjects */
      const allObjectsIndex = exParams.main.objects.allObjects.findIndex(
        x => x.uuid === object.group.uuid );
      exParams.main.objects.allObjects.splice( allObjectsIndex, 1 )
      
      /* _ids */
      const _idsIndex = objectType._ids.indexOf( object._id )
      objectType._ids.splice( _idsIndex, 1 )
      
      /* titles */
      const titlesIndex = objectType.titles.indexOf( object.title )
      objectType.titles.splice( titlesIndex, 1 )
      
      /* groups */
      const groupsIndex = objectType.groups.indexOf( object.group )
      objectType.groups.splice( groupsIndex, 1 )
      
      /* amount */
      objectType.amount--
      
      /* entry */
      const entryIndex = objectType.entry.findIndex(
        x => x._id === object._id );
      objectType.entry.splice( entryIndex, 1 )
      
    } )
  }

  /**
   * Loads chosen position objects in teh sub scene.
   * @param {*} exParams 
   * @param {*} objectID 
   */
  async loadObjectInSub( exParams, objectID ) {

    const object = [];

    /* Check if object is already loaded */
    if ( exParams.sub.object.length = 0 ) {
      object.push( await fromOfflineDB.getObject( objectID, 'Models',
      'positions' ) ); 
    } else {
      object.push( exParams.sub.object[ 0 ] )
    }

    const loadedObject = await this.load( object )

    for ( var i in exParams.main.position.groups ) {
      if ( exParams.main.position.entry[ i ]._id == objectID ) {
        this.posInfo.modelName = "Model name: " + 
        exParams.main.position.entry[ i ].modelTitle;
        
        loadedObject.position.set( 
          -exParams.main.position.entry[ i ].position.x, 
          -exParams.main.position.entry[ i ].position.y,
          -exParams.main.position.entry[ i ].position.z )
        const height = exParams.main.position.entry[ i ].bbox.max.y - 
          exParams.main.position.entry[ i ].bbox.min.y;
        const width = exParams.main.position.entry[ i ].bbox.max.x - 
          exParams.main.position.entry[ i ].bbox.min.x;
        const length = exParams.main.position.entry[ i ].bbox.max.z - 
          exParams.main.position.entry[ i ].bbox.max.z;
        const largest = Math.max(height, width, length)
        exParams.sub.camera.position.z = largest * 2;

      }
    }

    /* Add model to sub scene */
    exParams.sub.scene.add( loadedObject );
    exParams.sub.object.push( loadedObject );
    
  }

}