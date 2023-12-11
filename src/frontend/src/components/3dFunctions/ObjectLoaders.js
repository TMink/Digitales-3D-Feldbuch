/*
 * Created Date: 10.12.2023 15:32:15
 * Author: Tobias Mink
 * 
 * Last Modified: 11.12.2023 14:38:24
 * Modified By: Tobias Mink
 * 
 * Description: 
 */

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
export class ObjectLoaders {

  /**
   * @param {*} objectData
   */
  async load( objectData ) {

    switch ( objectData.loaderType ) {

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