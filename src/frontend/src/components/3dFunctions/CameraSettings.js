/*
 * Created Date: 15.01.2024 13:52:27
 * Author: Tobias Mink
 * 
 * Last Modified: 24.01.2024 16:58:10
 * Modified By: Tobias Mink
 * 
 * Description: 
 */

import * as THREE from 'three';

import { Utilities } from './Utilities.js';
import { ControlSettings } from './ControlSettings.js';


export class CameraSettings {

  createPerspectiveCamera( canvas ) {
    const fov = 45;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const near = 0.01;
    const far = 2000;
    const perspectiveCamera = new THREE.PerspectiveCamera( fov, aspect, near, 
      far );
    
    return perspectiveCamera;
  }

  async updateCamera( barycenter, placeID, camera, cameraIDsInDB, cameraInDB,
    cameraData, controls, arcballAnchor ) {
    
    if ( cameraIDsInDB.includes( placeID ) && !cameraInDB.newObjectsInScene ) {
      console.log("Test")
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
        controls );
      
      /* Set new camera state */
      utilities.setCamera( camera, cameraData );
    } else {
      const utilities = new Utilities()

      /* Define an anchor point for the arcball */
      arcballAnchor.push( barycenter.x );
      arcballAnchor.push( barycenter.y );
      arcballAnchor.push( barycenter.z );

      /* Set center as the new arcball target */
      controls.target.set( barycenter.x, barycenter.y, barycenter.z );

      /* Move camera to the object */
      camera.position.set( barycenter.x, barycenter.y - 15, barycenter.z );
      cameraData = utilities.getCameraData( camera );

      /* Save changes made to the arcball control settings */
      controls.update();
    }
  }
  
  async updateCamera2( objectName, placeID, camera, cameraIDsInDB, cameraInDB,
    cameraData, controls, scene, arcballAnchor ) {
    
    if ( cameraIDsInDB.includes( placeID ) ) {
      const utilities = new Utilities()
      const controlSettings = new ControlSettings()

      /* Update current camera state with camera data from IndexedDB */
      const cameraPosition = cameraInDB.cameraPosition;
      cameraData.position = [ cameraPosition[ 0 ], cameraPosition[ 1 ],
      cameraPosition[ 2 ] ];
      cameraData.rotation = [ cameraPosition[ 3 ], cameraPosition[ 4 ],
      cameraPosition[ 5 ] ];

      /* Restore saved anchor position for the arcball target */
      controlSettings.restoreArcballAnchor( cameraInDB.arcballAnchor, 
        controls );
      
      /* Set new camera state */
      utilities.setCamera( camera, cameraData );
    } else {
      const utilities = new Utilities()
      
      /* Get center of place model as Vec3 */
      const object = scene.getObjectByName( objectName );
      const center = utilities.getModelCenter( object );

      /* Define an anchor point for the arcball */
      arcballAnchor.push( center.x );
      arcballAnchor.push( center.y );
      arcballAnchor.push( center.z );

      /* Set center as the new arcball target */
      controls.target.set( center.x, center.y, center.z );

      /* Move camera to the object */
      camera.position.set( center.x, center.y - 15, center.z );
      cameraData = utilities.getCameraData( camera );

      /* Save changes made to the arcball control settings */
      controls.update();
    }
  }

}