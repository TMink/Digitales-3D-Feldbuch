/*
 * Created Date: 15.01.2024 17:29:22
 * Author: Tobias Mink
 * 
 * Last Modified: 30.03.2024 03:28:59
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
    this.disposeOfObjects( main );
    main.arcBallControls.dispose();
    main.transformControls.dispose();
    this.disposeOfObjects( sub );
    sub.orbitControls.dispose();
  }

  /**
   * Disposes all objects of given scene.
   * @param { object } whichScene 
   */
  async disposeOfObjects( whichScene ) {
    whichScene.scene.traverse( o => {
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

    while( whichScene.scene.children.length > 0 ) {
      await Promise.all( whichScene.scene.children.map( async ( child ) => {
        if( child.children.length ) {
          if( child.children[0].type == "Object3D" ) {
            child.remove( child.children[0] )
          }
        }
        whichScene.scene.remove( child )
      } ) )
    }
    whichScene.renderer && whichScene.renderer.renderLists.dispose()
    whichScene.renderer = null
  }
  
}