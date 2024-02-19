/*
 * Created Date: 23.01.2024 13:09:11
 * Author: Tobias Mink
 * 
 * Last Modified: 24.01.2024 13:04:45
 * Modified By: Tobias Mink
 * 
 * Description: 
 */

import * as THREE from 'three';

import { CameraSettings } from './CameraSettings.js';

import { ArcballControls } from
'three/examples/jsm/controls/ArcballControls.js';
import { TransformControls } from
'three/examples/jsm/controls/TransformControls.js';
import { OrbitControls } from
'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 
'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 
'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 
'three/examples/jsm/postprocessing/OutlinePass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { GammaCorrectionShader } from
'three/examples/jsm/shaders/GammaCorrectionShader';
import { CSS2DRenderer } from 
'three/examples/jsm/renderers/CSS2DRenderer'

export class Initialisations {

  constructor() {
    this.cameraSettings = new CameraSettings();
  }
}