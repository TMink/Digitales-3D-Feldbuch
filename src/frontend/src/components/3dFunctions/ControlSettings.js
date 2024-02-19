/*
 * Created Date: 15.01.2024 12:38:45
 * Author: Tobias Mink
 * 
 * Last Modified: 15.01.2024 13:48:52
 * Modified By: Tobias Mink
 * 
 * Description: 
 */

import { Utilities } from './Utilities.js';

export class ControlSettings {
  
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

  updateWithNewCamera( controls, camera ) {
    controls.target.set( camera.arcballAnchor[ 0 ],
      camera.arcballAnchor[ 1 ], camera.arcballAnchor[ 2 ]);

    controls.reset();
    controls.update();
  }
  
  updateWithOldCamera( controls, arcballAnchor ) {
    controls.target.set( arcballAnchor[ 0 ], arcballAnchor[ 1 ], 
      arcballAnchor[ 2 ] );

    controls.reset();
    controls.update();
  }

  restoreArcballAnchor( arcballAnchor, arcballControls ) {
    /* Restore saved anchor position for the arcball target */
    arcballControls.target.set( arcballAnchor[ 0 ], arcballAnchor[ 1 ],
      arcballAnchor[ 2 ] );

    /* Save changes made to the arcball control settings */
    arcballControls.update();
  }

}