/*
 * Created Date: 15.01.2024 17:29:22
 * Author: Tobias Mink
 * 
 * Last Modified: 22.01.2024 16:31:40
 * Modified By: Tobias Mink
 * 
 * Description: 
 */

export class GarbageCollection {
  
  async clearCanvases( main, sub, infoBlock ) {

      this.removeObjects( main.scene, main.objects );
      this.removeLines( main.scene, infoBlock );
      this.removeRenderer( main.renderer );
      console.log(main.arcBallControls)
      main.arcBallControls.dispose()
      main.transformControls.detach()

      this.removeObjects( sub.scene, sub.object );
      this.removeRenderer( sub.renderer );
    
    
  }

  removeLines( scene, infoBlock ) {
    if( infoBlock.length > 0 ) {
      /* Dispose lines in sceneMain */
      infoBlock.forEach( elem => {
        console.log(elem)
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

  removeRenderer( renderer ) {
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.renderLists.dispose();
  }
  
}