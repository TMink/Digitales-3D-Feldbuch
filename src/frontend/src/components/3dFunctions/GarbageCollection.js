/*
 * Created Date: 15.01.2024 17:29:22
 * Author: Tobias Mink
 * 
 * Last Modified: 18.04.2024 15:15:14
 * Modified By: Tobias Mink
 * 
 * Description: The Process that will happen, wenn ever the 3DView is closed and
 *              the scenes and assets are not used anymore. This should help
 *              with cache problems and keeps the canvas space clean of data
 *              remains.
 */

export class GarbageCollection {

  /**
   * Top function which combines every step of the cleaning process.
   * @param {*} main 
   * @param {*} sub 
   * @param {*} mmToolInfoBlock 
   * @param {*} anToolInfoBlock 
   */
  async clearCanvases( main, sub ) {
    /* Dispose scenes */
    this.disposeOfObjects( main.components.scene[0].data );
    for( const control in main.components.contorls ) {
      control.data.dispose();
    }
    if( sub.components.scene[0].data != null ) {
      this.disposeOfObjects( sub.components.scene[0].data );
      sub.orbitControls.dispose();
    }
  }

  async cleanEnv( env ) {
    if( env.components.scene[0].data != null ) {
      this.disposeOfObjects( env.components.scene[0].data )
    }
    for( const [_, controls] of Object.entries(env.components.controls) ) {
      if( controls.data != null ) {
        controls.data.dispose()
      }
    }
  }

  /**
   * Disposes all objects of given scene.
   * @param { object } whichScene 
   */
  async disposeOfObjects( scene, renderer ) {
    scene.traverse( o => {
      if (o.geometry) {
        o.geometry.dispose()                       
      }

      if (o.material) {
        if (o.material.length) {
          for (let i = 0; i < o.material.length; ++i) {
            o.material[i].dispose()                                
          }  
        }
        else {
          o.material.dispose()                           
        }
      }
    } )

    while( scene.children.length > 0 ) {
      await Promise.all( scene.children.map( async ( child ) => {
        if( child.children.length ) {
          if( child.children[0].type == "Object3D" ) {
            child.remove( child.children[0] )
          }
        }
        scene.remove( child )
      } ) )
    }
    renderer && renderer.renderLists.dispose()
    renderer = null
  }

  /**
   * 
   * @param {*} env 
   */
  deepCleanEnv( env ) {
    for( const [key, value] of Object.entries(env) ) {
      switch( key ) {
        case "canvas":
          env[key] = null;
          break;
        case "objects":
          for( const [key2, value2] of Object.entries( value ) ) {
            switch( key2 ) {
              case "allObjects":
                env[key][key2] = []
                break;
              case "place" || "position":
                for( const [ key3, _ ] of Object.entries( value2 ) ) {
                  if( key3 == "amount" ) {
                    env[key][key2][key3] = 0
                  } else {
                    env[key][key2][key3] = []
                  }
                }
                break;
            }
          }
          break;
        case "components":
          for( const [ key2, value2 ] of Object.entries( value ) ) {
            if( key2 == "attributes" ) {
              env[key][key2].list = env.reset;
            } else {
              for( const [ key3, value3 ] of Object.entries( value2 ) ) {
                for( const [ key4, _ ] of Object.entries( value3 ) ) {
                  if( key4 == "data" ) {
                    env[key][key2][key3][key4] = null;
                  } 
                }
              }
            }
          }
          break;
      }
    }
  }
  
}