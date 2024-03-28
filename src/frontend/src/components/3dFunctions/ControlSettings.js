/*
 * Created Date: 15.01.2024 12:38:45
 * Author: Tobias Mink
 * 
 * Last Modified: 28.03.2024 17:16:59
 * Modified By: Tobias Mink
 * 
 * Description: A Collection of functions to modify the control settings and
 *              attach/detach them to/from certain objects.
 */

export class ControlSettings {
  
  /**
   * Attaches transformation controls on to an object in scene.
   * @param { object } posMods 
   * @param { object } posObject 
   * @param { object } tControls 
   */
  attachTransformControls( posMods, posObject, tControls ) {
    if ( !posMods.attachTransformControls ) {
      posMods.attachTransformControls = true;
      if ( posObject.chosenfinalModelGroup ) {
        tControls.detach();
        tControls.attach(posObject.chosenfinalModelGroup);
      }
    } else {
      posMods.attachTransformControls = false;
      tControls.detach();
    }
  }

  /**
   * Updated the arcball target with the new camera position.
   * @param { object } controls 
   * @param { object } camera 
   */
  updateWithNewCamera( controls, camera ) {
    controls.target.set( camera.arcballAnchor[ 0 ],
      camera.arcballAnchor[ 1 ], camera.arcballAnchor[ 2 ]);

    controls.reset();
    controls.update();
  }
  
  /**
   * Updated the arcball target with the old camera position.
   * @param { object } controls 
   * @param { object } arcballAnchor 
   */
  updateWithOldCamera( controls, arcballAnchor ) {
    controls.target.set( arcballAnchor[ 0 ], arcballAnchor[ 1 ], 
      arcballAnchor[ 2 ] );

    controls.reset();
    controls.update();
  }

  /**
   * Restores the arcball position with given anchor form IndexedDB.
   * @param { object } arcballAnchor 
   * @param { object } arcballControls 
   */
  restoreArcballAnchor( arcballAnchor, arcballControls ) {
    /* Restore saved anchor position for the arcball target */
    arcballControls.target.set( arcballAnchor[ 0 ], arcballAnchor[ 1 ],
      arcballAnchor[ 2 ] );

    /* Save changes made to the arcball control settings */
    arcballControls.update();
  }

}