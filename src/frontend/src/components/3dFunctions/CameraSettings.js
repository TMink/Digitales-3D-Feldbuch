/*
 * Created Date: 15.01.2024 13:52:27
 * Author: Tobias Mink
 * 
 * Last Modified: 29.03.2024 20:57:26
 * Modified By: Tobias Mink
 * 
 * Description: This class includes functions to modify the camera state in 
 *              main- and sub scene.
 */

import { Utilities } from './Utilities.js';
import { ControlSettings } from './ControlSettings.js';

export class CameraSettings {
  /**
   * Updates the Camera position position accordingly to the barycenter of the
   * object/objects in scene and restores the arcball settings if they are
   * present in IndexedDB.
   * @param { object } barycenter 
   * @param { String } placeID 
   * @param { object } camera 
   * @param { object } cameraIDsInDB 
   * @param { object } cameraInDB 
   * @param { object } cameraData 
   * @param { object } controls 
   * @param { object } arcballAnchor 
   */
  async updateCamera( barycenter, placeID, main, cameraIDsInDB, cameraInDB,
    cameraData, arcballAnchor ) {
    
    if ( cameraIDsInDB.includes( placeID ) && !cameraInDB.newObjectsInScene ) {
      const utilities = new Utilities();
      const controlSettings = new ControlSettings();

      /* Update current camera state with camera data from IndexedDB */
      const cameraPosition = cameraInDB.cameraPosition;
      cameraData.position = [ cameraPosition[ 0 ], cameraPosition[ 1 ],
        cameraPosition[ 2 ] ];
      cameraData.rotation = [ cameraPosition[ 3 ], cameraPosition[ 4 ],
        cameraPosition[ 5 ] ];

      /* Restore saved anchor position for the arcball target */
      controlSettings.restoreArcballAnchor( cameraInDB.arcballAnchor, 
        main.arcBallControls );
      
      /* Set new camera state */
      utilities.setCamera( main.camera, cameraData );
    } else {
      const utilities = new Utilities()

      /* Define an anchor point for the arcball */
      arcballAnchor.push( barycenter.x );
      arcballAnchor.push( barycenter.y );
      arcballAnchor.push( barycenter.z );

      /* Set center as the new arcball target */
      main.arcBallControls.target.set( barycenter.x, barycenter.y, barycenter.z );

      /* Move camera to the object */
      main.camera.position.set( barycenter.x, barycenter.y - 15, barycenter.z );
      cameraData = utilities.getCameraData( main.camera );

      /* Save changes made to the arcball control settings */
      main.arcBallControls.update();
    }
  }
}