/*
 * Created Date: 10.12.2023 15:32:15
 * Author: Tobias Mink
 * 
 * Last Modified: 19.02.2024 14:16:50
 * Modified By: Tobias Mink
 * 
 * Description: 
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"

import { UpdateLocalVariables } from './UpdateLocalVariables.js'
import { Utilities } from './Utilities.js'
import { fromOfflineDB } from '../../ConnectionToOfflineDB.js'
import { exParams } from './Parameter.js';
export class ObjectLoaders {

  /**
   * @param {*} objectData
   */
  async load( objectData ) {
    switch ( objectData.loaderType ) {
      case 'glb' || 'gltf':
        const loader = new GLTFLoader()
        const malfoy = new DRACOLoader()
        malfoy.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        malfoy.setDecoderConfig({type: 'js'});
        loader.setDRACOLoader( malfoy )
        const id = objectData._id
        const object = await new Promise( ( resolve ) => {
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

      default:
        console.log("No valid loaderType");
        break;

    }

  }
}