/*
 * Created Date: 15.01.2024 17:29:22
 * Author: Tobias Mink
 * 
 * Last Modified: 28.03.2024 17:36:10
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
  async clearCanvases( main, sub, mmToolInfoBlock, anToolInfoBlock ) {
    /* Main scene */  
    this.removeObjects( main.scene, main.objects );
    this.removeLines( main.scene, mmToolInfoBlock );
    this.removeAnnotations( main.scene, anToolInfoBlock );
    this.removeRenderer( main.renderer );
    main.arcBallControls.dispose()
    main.transformControls.detach()

    /* Sub scene */
    this.removeObjects( sub.scene, sub.object );
    this.removeRenderer( sub.renderer );   
  }

  /**
   * Dispose Lines which includes, beside the line object, the lable and the
   * attached balls.
   * @param { object } scene 
   * @param { object } infoBlock 
   */
  removeLines( scene, infoBlock ) {
    if( infoBlock.length > 0 ) {
      /* Dispose lines in sceneMain */
      infoBlock.forEach( elem => {
        const lineInScene = scene.getObjectByName( elem.line )
        const lableInScene = scene.getObjectByName( elem.lable )
        const ballsInScene = [];
        elem.balls.forEach( ball => {
          ballsInScene.push( scene.getObjectByName( ball ) );
        } )
  
        /* Remove line */
        lineInScene.remove(lableInScene)
        lineInScene.material.dispose()
        lineInScene.geometry.dispose()
        scene.remove(lineInScene)
  
        /* Remove Lable */
        lableInScene.remove()
  
        /* Remove Balls */
        ballsInScene.forEach( ball => {
          ball.material.dispose();
          ball.geometry.dispose();
          scene.remove( ball );
        } )
      } )
    }
  }

  /**
   * Disposes annotations wicht includes the lable and box object.
   * @param { object } scene 
   * @param { object } infoBlock 
   */
  removeAnnotations( scene, infoBlock ) {
    if( infoBlock.length > 0 ) {
      infoBlock.forEach( elem => {
        console.log("Garbage collection")
        console.log(elem)
        const lableInScene = scene.getObjectByName( elem._id )
        const boxInScene = scene.getObjectByName( elem.boxName )
        
        /* Remove box */
        boxInScene.remove( lableInScene )
        boxInScene.material.dispose()
        boxInScene.geometry.dispose()
        scene.remove( boxInScene )
        
        /* Remove lable */
        lableInScene.remove()        

      } )
    }
  }

  /**
   * Removes all objects from scene.
   * @param { object } scene 
   * @param { object } objects 
   */
  removeObjects( scene, objects ) {
    /* Dispose models in sceneMain */
    for ( let i = 0; i < objects.length; i++ ) {
      const childrenToBeRemoved = [];
      const nameTo = objects[ i ].name;
      scene.traverse( ( child ) => {
        if ( child.name == nameTo ) {
          childrenToBeRemoved.push( child );
        }
      } );

      childrenToBeRemoved.forEach( ( child ) => {
        scene.remove( child );
      } );
    }
  }

  /**
   * Disposes the aktive WebGLRenderer instance.
   * @param { THREE.WebGLRenderer } renderer 
   */
  removeRenderer( renderer ) {
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.renderLists.dispose();
  }
  
}