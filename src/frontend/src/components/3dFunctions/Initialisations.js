/*
 * Created Date: 23.01.2024 13:09:11
 * Author: Tobias Mink
 * 
 * Last Modified: 29.03.2024 20:48:25
 * Modified By: Tobias Mink
 * 
 * Description: A Collection of initialisation functions, which will be called
 *              in the mounted function in 3DView.js. This includes the creation
 *              of the mainSceneParams/subSceneParams scene and various tools.
 */

import * as THREE from 'three';
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
import * as CSG from 'three-bvh-csg';

export class Initialisations {

  constructor( cameraSettings, segmentationTool ) {
    this.cameraSettings = cameraSettings;
    this.segmentationTool = segmentationTool;
  }

  /**
   * Initialize the measurement tool.
   * @param { object } document 
   * @param { object } canvas 
   * @param { object } params 
   */
  initMeasurementTool( main, mmTool, document ) {
    /* Create CSS2D-Renderer and adjust its attributes */
    mmTool.css2DRenderer = new CSS2DRenderer()
    mmTool.css2DRenderer.setSize( main.canvas.clientWidth, main.canvas.clientHeight );
    mmTool.css2DRenderer.domElement.style.position = mmTool.css2DRendererParams.position;
    mmTool.css2DRenderer.domElement.style.top = mmTool.css2DRendererParams.top;
    mmTool.css2DRenderer.domElement.style.color = mmTool.css2DRendererParams.color;
    mmTool.css2DRenderer.domElement.style.pointerEvents = 
    mmTool.css2DRendererParams.pointerEvents;
    /* Append the CSS2D-Renderer to document */
    document.body.appendChild( mmTool.css2DRenderer.domElement)

    /* Create new Raycaster */
    mmTool.raycaster = new THREE.Raycaster();
    mmTool.pointer = new THREE.Vector2();

    mmTool.lineID = String(Date.now());
  }

  /**
   * Initialize the stToolParams tool
   * @param { object } main 
   * @param { object } stTool 
   * @param { object } centerOfObjects 
   */
  initSegmentationTool( main, stTool, centerOfObjects ) {
    /* Create new map to override attributes of new brushes */
    stTool.materialMap = new Map();

    /* Create evaluator for csg purposes. It will produce the final result of 
     * the operation. */
    stTool.csgEvaluator = new CSG.Evaluator();
    stTool.csgEvaluator.attributes = [ 'position', 'normal' ];

    /* Create a brush to cut with.
     * This brush can be moved and will be used to cut the objects. */
    const brushToCutWith = new CSG.Brush( new THREE.BoxGeometry(5, 10, 10), 
      new CSG.GridMaterial() );
    brushToCutWith.name = stTool.brushToCutWithParams.name;
    /* Move stToolParams brush to the loaded objects, according to their 
     * position */
    brushToCutWith.position.set( 
      centerOfObjects.x - stTool.brushToCutWithParams.positionOffset, 
      centerOfObjects.y, centerOfObjects.z );
    /* Create parameter entry */
    stTool.brushToCutWith = {
      brush: brushToCutWith,
	    brushColor: stTool.brushToCutWithParams.color,
      attached: stTool.brushToCutWithParams.attached
    }
    /* Update brushesOfObjects */
    this.segmentationTool.updateBrush( brushToCutWith, main );
    /* Initialize brush materials */
    stTool.brushToCutWith.brush.material.opacity = 
      stTool.brushToCutWithParams.material.opacity;
	  stTool.brushToCutWith.brush.material.transparent = 
      stTool.brushToCutWithParams.material.transparent;
	  stTool.brushToCutWith.brush.material.depthWrite = 
      stTool.brushToCutWithParams.material.depthWrite;
	  stTool.brushToCutWith.brush.material.polygonOffset = 
      stTool.brushToCutWithParams.material.polygonOffset;
	  stTool.brushToCutWith.brush.material.polygonOffsetFactor = 
      stTool.brushToCutWithParams.material.polygonOffsetFactor;
	  stTool.brushToCutWith.brush.material.polygonOffsetUnits = 
      stTool.brushToCutWithParams.material.polygonOffsetUnits;
	  stTool.brushToCutWith.brush.material.side = THREE.DoubleSide;
	  stTool.brushToCutWith.brush.material.premultipliedAlpha = 
      stTool.brushToCutWithParams.material.premultipliedAlpha;
    stTool.brushToCutWith.brush.material.color.set( 
      stTool.brushToCutWith.brushColor )
    stTool.brushToCutWith.brush.receiveShadow = 
      stTool.brushToCutWithParams.material.receiveShadow;
    stTool.brushToCutWith.brush.visible = 
      stTool.brushToCutWithParams.material.visible;
    /* Add brush to scene */
    main.scene.add( stTool.brushToCutWith.brush );
    /* Create material map for transparent to opaque variants */
    let mat;
	  mat = stTool.brushToCutWith.brush.material.clone();
	  mat.side = THREE.FrontSide;
	  mat.opacity = stTool.brushToCutWithParams.mat.opacity;
	  mat.transparent = stTool.brushToCutWithParams.mat.transparent;
	  mat.depthWrite = stTool.brushToCutWithParams.mat.depthWrite;
    mat.name = stTool.brushToCutWithParams.mat.name
	  stTool.materialMap.set( stTool.brushToCutWith.brush.material, mat );
    
    /* ## Initialize brushesOfObjects ## */
    /* Create a brush for every object in scene, so that every object can be 
     * used. */
    main.objects.allObjects.forEach( (object, idx) => {
      const brush = new CSG.Brush( object.children[0].geometry.clone(), 
        new CSG.GridMaterial() );
      brush.name = object.children[0].name;
      brush.position.set( object.children[0].position.x, 
        object.children[0].position.y, object.children[0].position.z );
      brush.scale.setScalar( 1 );
      stTool.brushesOfObjects.push( {
        brush: brush,
	      brushColor: stTool.brushesOfObjectsParams.colors[idx],
        resultBrush: stTool.brushesOfObjectsParams.resultBrush,
        originalMaterial: stTool.brushesOfObjectsParams.originalMaterial
      } );
    })
    /* Update brushesOfObjects */
    stTool.brushesOfObjects.forEach( brush => {
      this.segmentationTool.updateBrush( brush.brush, main );
    })
    /* Initialize brush materials */
    stTool.brushesOfObjects.forEach( brush => {
      brush.brush.material.opacity = 
        stTool.brushesOfObjectsParams.material.opacity;
	    brush.brush.material.transparent = 
        stTool.brushesOfObjectsParams.material.transparent;
	    brush.brush.material.depthWrite = 
        stTool.brushesOfObjectsParams.material.depthWrite;
	    brush.brush.material.polygonOffset = 
        stTool.brushesOfObjectsParams.material.polygonOffset;
	    brush.brush.material.polygonOffsetFactor = 
        stTool.brushesOfObjectsParams.material.polygonOffsetFactor;
	    brush.brush.material.polygonOffsetUnits = 
        stTool.brushesOfObjectsParams.material.polygonOffsetUnits;
	    brush.brush.material.side = THREE.DoubleSide;
	    brush.brush.material.premultipliedAlpha = 
        stTool.brushesOfObjectsParams.material.premultipliedAlpha;
      brush.brush.material.color.set( brush.brushColor )
      brush.brush.receiveShadow = 
        stTool.brushesOfObjectsParams.material.receiveShadow;
      brush.brush.visible = 
        stTool.brushesOfObjectsParams.material.visible;
    } );
    /* Add brushesOfObjects to scene */
    stTool.brushesOfObjects.forEach( brush => {
      main.scene.add( brush.brush );
    } );
    /* Create material map for transparent to opaque variants */
    stTool.brushesOfObjects.forEach( brush => {
      mat = brush.brush.material.clone();
      mat.side = THREE.FrontSide;
      mat.opacity = stTool.brushesOfObjectsParams.mat.opacity;
      mat.transparent = stTool.brushesOfObjectsParams.mat.transparent;
      mat.depthWrite = stTool.brushesOfObjectsParams.mat.depthWrite;
      mat.name = brush.brush.name;
      stTool.materialMap.set( brush.brush.material, mat );
    } );
    stTool.materialMap.forEach( ( m0, m1, m2 ) => {
      m0.enableGrid = stTool.gridTexture;
      m1.enableGrid = stTool.gridTexture;
      m2.enableGrid = stTool.gridTexture;
    } );
    /* Add object displaying the result */
    stTool.brushesOfObjects.forEach( brush => {
      brush.resultObject = new THREE.Mesh( new THREE.BufferGeometry(), 
      new THREE.MeshStandardMaterial( {
        flatShading: stTool.brushesOfObjectsParams.resultObject.flatShading,
        polygonOffset: 
          stTool.brushesOfObjectsParams.resultObject.polygonOffset,
        polygonOffsetUnits: 
          stTool.brushesOfObjectsParams.resultObject.polygonOffsetUnits,
        polygonOffsetFactor: 
          stTool.brushesOfObjectsParams.resultObject.polygonOffsetFactor
      } ) );
      brush.resultObject.castShadow = 
        stTool.brushesOfObjectsParams.resultObject.castShadow;
      brush.resultObject.receiveShadow = 
        stTool.brushesOfObjectsParams.resultObject.receiveShadow;
      brush.originalMaterial = brush.resultObject.material;
      main.scene.add( brush.resultObject );
    } );
  }

  /**
   * Initializes the mainSceneParams scene and its attributes
   * @param { object } params 
   */
  mainInit( main ) {
    /* Create renderer */
    main.renderer = new THREE.WebGLRenderer( {
      canvas: main.canvas,
      antialias: main.rendererParams.antialias
    } );
    main.renderer.setSize( main.canvas.clientWidth, main.canvas.clientHeight );
    main.renderer.setClearColor( main.rendererParams.backgroundColor, 
      main.rendererParams.backgroundColorIntensity );
    main.renderer.shadowMap.enabled = main.rendererParams.shadowMapEnabled;
    main.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    main.renderer.outputEncoding = THREE.SRGBColorSpace;
      
    /* Create scene */
    main.scene = new THREE.Scene();
    main.scene.name = main.sceneParams.name

    /* Create camera */
    const aspect = main.canvas.clientWidth / main.canvas.clientHeight;
    main.camera = new THREE.PerspectiveCamera( 
      main.cameraParams.attributes.fov, aspect, main.cameraParams.attributes.near, 
      main.cameraParams.attributes.far );
    main.camera.name = main.cameraParams.name

    /* Create light */
    main.directionalLight = new THREE.DirectionalLight( 
      main.lightParams.directional.color,
      main.lightParams.directional.intensity );
      main.directionalLight.position.set( 
      main.lightParams.directional.position.x,
      main.lightParams.directional.position.y,
      main.lightParams.directional.position.z );
    main.scene.add( main.directionalLight, main.directionalLight.target );
    main.directionalLight.name = main.lightParams.directional.name;

    main.ambientlight = new THREE.AmbientLight( main.lightParams.ambient.color, 
      main.lightParams.ambient.intensity );
    main.scene.add( main.ambientlight );
    main.ambientlight.name = main.lightParams.ambient.name;

    /* Create controls */
    main.arcBallControls = new ArcballControls( main.camera, 
      main.renderer.domElement, main.scene );
    main.arcBallControls._maxDownTime = main.controlsParams.arcball.maxDownTime;
    main.arcBallControls._maxInterval = main.controlsParams.arcball.maxInterval;
    main.arcBallControls.cursorZoom = main.controlsParams.arcball.cursorZoom;
    main.arcBallControls.setGizmosVisible( 
      main.controlsParams.arcball.gizmosVisible );

    main.transformControls = new TransformControls( main.camera,
      main.renderer.domElement );
    main.transformControls.addEventListener( 'dragging-changed', e => {
      main.arcBallControls.enabled = !e.value;
    } );
    main.transformControls.addEventListener( 'objectChange', () => {
      main.needsUpdate = true;
    } )
    main.scene.add( main.transformControls );

    /* Create raycaster */
    main.raycaster = new THREE.Raycaster();
    main.pointer = new THREE.Vector2();
    
    /* Post processing */
    main.composer = new EffectComposer( main.renderer );

    main.renderPass = new RenderPass( main.scene, main.camera );
    main.composer.addPass( main.renderPass );

    main.outlinePass = new OutlinePass( new THREE.Vector2(
      main.canvas.clientWidth, main.canvas.clientHeight ),
      main.scene, main.camera );
    main.outlinePass.hiddenEdgeColor.set( 
      main.postProcessingParams.outlinePass.color )
    main.outlinePass.pulsePeriod = 
      main.postProcessingParams.outlinePass.pulsePeriod;
    main.outlinePass.edgeStrength = 
      main.postProcessingParams.outlinePass.edgeStrength;
    main.outlinePass.edgeThickness = 
      main.postProcessingParams.outlinePass.edgeThickness;
    main.outlinePass.edgeGlow = 
      main.postProcessingParams.outlinePass.edgeGlow;
    main.composer.addPass( main.outlinePass );

    // Shader
    main.effectFXAA = new ShaderPass( FXAAShader );
    main.effectFXAA.uniforms[ 'resolution' ].value.set(
      1 / main.canvas.clientWidth, 1 / main.canvas.clientHeight );
    main.composer.addPass( main.effectFXAA );

    main.gammaCorrectionShader = new ShaderPass( GammaCorrectionShader );
    main.composer.addPass( main.gammaCorrectionShader )
  }

  /**
   * Initializes the sub scene and its attributes
   * @param { object } params 
   */
  subInit( sub ) {
    /* Mesh in sub scene */
    sub.object = [];

    /* Create Renderer */
    sub.renderer = new THREE.WebGLRenderer( { canvas: sub.canvas } );
    sub.renderer.setPixelRatio( sub.canvas.devicePixelRatio );
    sub.renderer.setSize( sub.canvas.clientWidth,
      sub.canvas.clientHeight );
    sub.renderer.setClearColor( sub.rendererParams.backgroundColor,
      sub.renderer.backgroundColorIntensity );
    sub.renderer.shadowMap.enabled = sub.rendererParams.shadowMapEnabled;
    sub.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    /* Create Scene */
    sub.scene = new THREE.Scene();
    sub.scene.name = sub.sceneParams.name;

    /* Create Camera */
    const aspect = sub.canvas.clientWidth / sub.canvas.clientHeight;
    sub.camera = new THREE.PerspectiveCamera( sub.cameraParams.fov, aspect, 
      sub.cameraParams.near, sub.cameraParams.far );

    /* Create Light */
    sub.light = new THREE.AmbientLight( sub.lightParams.ambient.color );
    sub.scene.add( sub.light );

    /* Create Controls */
    sub.orbitControls = new OrbitControls( sub.camera, 
      sub.renderer.domElement );
  }
}