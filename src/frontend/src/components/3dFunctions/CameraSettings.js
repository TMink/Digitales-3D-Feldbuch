/*
 * Created Date: 15.01.2024 13:52:27
 * Author: Tobias Mink
 * 
 * Last Modified: 18.04.2024 17:47:21
 * Modified By: Tobias Mink
 * 
 * Description: This class includes functions to modify the camera state in 
 *              main- and sub scene.
 */

export class CameraSettings {

  constructor( utilities, controlSettings ) {
    this.utilities = utilities;
    this.controlSettings = controlSettings;
  }
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
  async updateCamera( barycenter, camera, controls, cameraOfActivity,
    cameraData, arcballAnchor ) {

    if ( cameraOfActivity.length > 0 && !cameraOfActivity[0].objectsInSceneChanged ) {

      /* Update current camera state with camera data from IndexedDB */
      const cameraPosition = cameraOfActivity[0].cameraPosition;
      cameraData.position = [ cameraPosition[ 0 ], cameraPosition[ 1 ],
        cameraPosition[ 2 ] ];
      cameraData.rotation = [ cameraPosition[ 3 ], cameraPosition[ 4 ],
        cameraPosition[ 5 ] ];

      /* Restore saved anchor position for the arcball target */
      this.controlSettings.restoreArcballAnchor( cameraOfActivity[0].arcballAnchor, 
        controls );
      
      /* Set new camera state */
      this.utilities.setCamera( camera, cameraData );
    } else {

      /* Define an anchor point for the arcball */
      arcballAnchor.push( barycenter.x );
      arcballAnchor.push( barycenter.y );
      arcballAnchor.push( barycenter.z );

      /* Set center as the new arcball target */
      controls.target.set( barycenter.x, barycenter.y, barycenter.z );

      /* Move camera to the object */
      camera.position.set( barycenter.x, barycenter.y - 15, barycenter.z );
      cameraData = this.utilities.getCameraData( camera );

      /* Save changes made to the arcball control settings */
      controls.update();
    }
    if( cameraOfActivity.length > 0 && cameraOfActivity[0].objectsInSceneChanged ) {
      // Reset attribute
      cameraOfActivity[0].objectsInSceneChanged = false;
    }
  }
}