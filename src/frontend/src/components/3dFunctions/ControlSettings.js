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
}