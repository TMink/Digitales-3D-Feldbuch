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
}