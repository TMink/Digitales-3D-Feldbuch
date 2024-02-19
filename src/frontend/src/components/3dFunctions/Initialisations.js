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

  initMeasurementTool( document, canvas, params ) {
    /* label Renderer */
    params.css2DRenderer = new CSS2DRenderer()
    params.css2DRenderer.setSize( canvas.clientWidth,
      canvas.clientHeight );
      params.css2DRenderer.domElement.style.position = 'absolute'
      params.css2DRenderer.domElement.style.top = '35px'
      params.css2DRenderer.domElement.style.color = "white"
      params.css2DRenderer.domElement.style.pointerEvents = 'none'
    document.body.appendChild( params.css2DRenderer.domElement)

    // Raycaster measurementTool
    params.raycaster = new THREE.Raycaster();
    params.pointer = new THREE.Vector2();

    // Variables
    params.lineID = String(Date.now());
  }

  mainInit( params ) {
    /* All loaded meshes in main scene */
    params.objectsInMain = [];

    /* Renderer */
    params.renderer = new THREE.WebGLRenderer( {
      canvas: params.canvas,
      antialias: true
    } );
    params.renderer.setSize( params.canvas.clientWidth,
      params.canvas.clientHeight );
    params.renderer.setClearColor( params.sceneParams.bgColor, 1 );
    params.renderer.shadowMap.enabled = true;
    params.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    params.renderer.outputEncoding = THREE.SRGBColorSpace;
      
    // Scene
    params.scene = new THREE.Scene();
    params.scene.name = "SceneMain"

    // Camera
    params.camera = this.cameraSettings.createPerspectiveCamera( 
      params.canvas );
    params.camera.name = "CameraMain"

    // Light
    params.light = new THREE.AmbientLight( params.sceneParams.lightColor );
    params.scene.add( params.light );
    params.light.name = "LightMain"

    // Controls
    params.arcBallControls = new ArcballControls( params.camera,
      params.renderer.domElement, params.scene );
    params.arcBallControls._maxDownTime = 0;
    params.arcBallControls._maxInterval = 0;
    params.arcBallControls.cursorZoom = true;
    params.arcBallControls.setGizmosVisible( false );

    params.transformControls = new TransformControls( params.camera,
      params.renderer.domElement );
    params.transformControls.addEventListener( 'dragging-changed', e => {
      params.arcBallControls.enabled = !e.value;
    } );

    params.scene.add( params.transformControls );

    // Raycaster outlines
    params.raycaster = new THREE.Raycaster();
    params.pointer = new THREE.Vector2();
    
    // Post processing
    params.composer = new EffectComposer( params.renderer );

    params.renderPass = new RenderPass( params.scene, params.camera );
    params.composer.addPass( params.renderPass );

    params.outlinePass = new OutlinePass( new THREE.Vector2(
      params.canvas.clientWidth, params.canvas.clientHeight ),
      params.scene, params.camera );
    params.outlinePass.hiddenEdgeColor.set( params.sceneParams.outline.color )
    params.outlinePass.pulsePeriod = params.sceneParams.outline.pulsePeriod;
    params.outlinePass.edgeStrength = params.sceneParams.outline.edgeStrength;
    params.outlinePass.edgeThickness = params.sceneParams.outline.edgeThickness;
    params.outlinePass.edgeGlow = params.sceneParams.outline.edgeGlow;
    params.composer.addPass( params.outlinePass );

    // Shader
    params.effectFXAA = new ShaderPass( FXAAShader );
    params.effectFXAA.uniforms[ 'resolution' ].value.set(
      1 / params.canvas.clientWidth, 1 / params.canvas.clientHeight );
    params.composer.addPass( params.effectFXAA );

    params.gammaCorrectionShader = new ShaderPass( GammaCorrectionShader );
    params.composer.addPass( params.gammaCorrectionShader )
  }

  subInit( params ) {
    /* mesh in sub scene */
    params.object = [];

    /* Renderer */
    params.renderer = new THREE.WebGLRenderer( { canvas: params.canvas } );
    params.renderer.setPixelRatio( params.canvas.devicePixelRatio );
    params.renderer.setSize( params.canvas.clientWidth,
      params.canvas.clientHeight );
    params.renderer.setClearColor( params.sceneParams.bgColor, 1 );
    params.renderer.shadowMap.enabled = true;
    params.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    /* Scene */
    params.scene = new THREE.Scene();
    params.scene.name = "SceneSub"

    /* Camera */
    const aspect = params.canvas.clientWidth / params.canvas.clientHeight;
    params.camera = new THREE.PerspectiveCamera( 50, aspect, 1, 1000 );

    /* Light */
    params.light = new THREE.AmbientLight( params.sceneParams.lightColor );
    params.scene.add( params.light );

    /* Controls */
    params.orbitControls = new OrbitControls( params.camera,
      params.renderer.domElement );
  }
}