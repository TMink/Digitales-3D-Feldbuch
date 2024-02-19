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
  
  async clearCanvas( scene, data ) {

    if( scene.name == 'SceneMain' ) {
      this.removeObjects( scene, data.objects );
      this.removeLines( scene, data.infoBlock );
      this.removeRenderer( data.renderer );

      data.controls.detach()  
    } else if( scene.name == 'SceneSub' ) {
      this.removeObjects( scene, data.objects );
      this.removeRenderer( data.renderer );
    }
    
  }
}