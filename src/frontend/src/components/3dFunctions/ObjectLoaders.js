
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

import { UpdateLocalVariables } from './UpdateLocalVariables.js';

export class ObjectLoaders {

  constructor( loaderType ) {
    this.loaderType = loaderType

  }

  async getModelInfo() {

  }

  /**
   * 
   * @param {String} loaderType 
   * @param {*} objectData 
   * @param {*} objectInfo 
   */
  async loadObject( objectData ) {

    // const local = new UpdateLocalVariables()

    switch (this.loaderType) {

      case 'glb' || 'gltf':

        const loader = new GLTFLoader()

        const object = await new Promise( ( resolve ) => {
          loader.parse( objectData.model, '', ( glb ) => {
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